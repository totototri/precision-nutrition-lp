// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ★ 秘密鍵（.env に入れる）
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// 金額バリデーション（JPY, 1,000〜2,000,000円の範囲で任意に）
function validateAmount(amount) {
  return Number.isInteger(amount) && amount >= 1000 && amount <= 2000000;
}

// 単発決済（Checkout）
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount, description } = req.body;
    if (!validateAmount(amount)) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: "ja",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: { name: description || "サービス料金" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
      // 領収書メールはダッシュボード設定に依存
      allow_promotion_codes: false,
      // automatic_tax: { enabled: true },
      // billing_address_collection: "required",
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// （任意）サブスク用のルート（Price ID で管理）
app.post("/create-subscription-session", async (req, res) => {
  try {
    const { priceId, description } = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      locale: "ja",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel.html`,
      subscription_data: {
        description: description || "月額コーチング",
      },
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});

