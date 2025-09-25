import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const app = express();

// 公開LPのURL（サブパス必須）
const ORIGIN = process.env.FRONTEND_URL || "https://totototri.github.io/precision-nutrition-lp";
app.use(cors({ origin: ORIGIN }));
app.use(express.json());

// ← ここで“終了しない”ように変更
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
if (!/^sk_(test|live)_/.test(stripeKey)) {
  console.warn("⚠️ STRIPE_SECRET_KEY が未設定または不正です:", stripeKey ? stripeKey.slice(0, 8) + "…" : "MISSING");
}
const stripe = new Stripe(stripeKey || "sk_test_dummy", { apiVersion: "2024-06-20" });

// 確認用エンドポイント
app.get("/healthz", (_req, res) => res.json({ ok: true, origin: ORIGIN }));
app.get("/__status", (_req, res) => {
  res.json({
    origin: ORIGIN,
    stripeKey: stripeKey ? stripeKey.slice(0, 10) + "…" : "MISSING",
  });
});

const okAmount = (a) => Number.isInteger(a) && a >= 1000 && a <= 2_000_000;

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, description } = req.body;
    if (!okAmount(amount)) return res.status(400).json({ error: "Invalid amount" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "ja",
      line_items: [{
        price_data: {
          currency: "jpy",
          product_data: { name: description || "サービス料金" },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${ORIGIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe error:", e?.raw?.message || e.message);
    res.status(500).json({ error: e?.raw?.message || e.message || "Server error" });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
