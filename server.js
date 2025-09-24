// 先頭付近（既にあればそのまま）
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const app = express();

// ← ここ重要：フロントの公開URLを固定（サブパス含む）
const ORIGIN = process.env.FRONTEND_URL || "https://totototri.github.io/precision-nutrition-lp";

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

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
          unit_amount: amount, // 例: 300000 = ¥300,000
        },
        quantity: 1,
      }],
      success_url: `${ORIGIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ORIGIN}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (e) {
    // ✅ 何で落ちたか見えるようにする
    console.error("Stripe error:", e?.raw?.message || e.message, e?.raw || "");
    res.status(500).json({ error: e?.raw?.message || e.message || "Server error" });
  }
});

