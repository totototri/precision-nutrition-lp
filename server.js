// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const app = express();

/* ---------- 公開URLとCORS ---------- */
// GitHub Pages の公開URL（サブパス必須）
const PUBLIC_URL =
  process.env.FRONTEND_URL || "https://totototri.github.io/precision-nutrition-lp";
// CORS は「スキーム+ホスト(+ポート)」のみで比較する
const CORS_ORIGIN = new URL(PUBLIC_URL).origin; // => https://totototri.github.io
app.use(cors({ origin: CORS_ORIGIN }));

/* ---------- JSON/body パーサ（最優先） ---------- */
app.use(express.json({ type: ["application/json", "application/*+json"] }));
app.use(express.urlencoded({ extended: false }));

/* ---------- Stripe 初期化 ---------- */
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
if (!/^sk_(test|live)_/.test(stripeKey)) {
  console.warn(
    "⚠️ STRIPE_SECRET_KEY が未設定または不正です:",
    stripeKey ? stripeKey.slice(0, 8) + "…" : "MISSING"
  );
}
const stripe = new Stripe(stripeKey || "sk_test_dummy", { apiVersion: "2024-06-20" });

/* ---------- ヘルスチェック ---------- */
app.get("/", (_req, res) => res.send("Precision Nutrition API is running"));
app.get("/healthz", (_req, res) => res.json({ ok: true, origin: CORS_ORIGIN, publicUrl: PUBLIC_URL }));
app.get("/__status", (_req, res) =>
  res.json({ origin: CORS_ORIGIN, publicUrl: PUBLIC_URL, stripeKey: stripeKey ? stripeKey.slice(0, 10) + "…" : "MISSING" })
);

/* ---------- 決済API ---------- */
const okAmount = (a) => Number.isInteger(a) && a >= 1000 && a <= 2_000_000;

app.post("/create-checkout-session", async (req, res) => {
  try {
    // 直接の分割代入はやめて、未定義でも安全に読む
    const body = req.body ?? {};
    const amount = Number(body.amount);
    const description = body.description || "サービス料金";

    if (!Number.isFinite(amount)) return res.status(400).json({ error: "No/invalid amount in body" });
    if (!okAmount(amount)) return res.status(400).json({ error: "Invalid amount range" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "ja",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: { name: description },
            unit_amount: Math.trunc(amount),
          },
          quantity: 1,
        },
      ],
      success_url: `${PUBLIC_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${PUBLIC_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe error:", e?.raw?.message || e.message);
    res.status(500).json({ error: e?.raw?.message || e.message || "Server error" });
  }
});

/* ---------- 起動 ---------- */
const PORT = process.env.PORT || 4242;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));

