// src/PrecisionNutritionLP.jsx
// APIのURL（GitHub PagesのActions Variablesで VITE_API_URL を設定）
const API_URL = import.meta.env.VITE_API_URL; // 例: https://precision-nutrition-api.onrender.com

import React, { useState } from "react";

// ✅ シングルファイルReactコンポーネント
// Tailwindでデザイン。Checkoutは Render 上の /create-checkout-session を叩く。
export default function PrecisionNutritionLP() {
const [plan, setPlan] = useState({ amount: 1000, label: "お試し1,000円プラン" });

  const plans = [
  {
    title: "Trial",
    label: "お試し1,000円プラン",
    amount: 1000,
    features: [
      "Stripe本番動作の検証用（1回限り推奨）",
      "オンライン決済フローの確認",
      "領収書メール/明細表記の確認",
    ],
    badge: "テスト",
  },

    { title: "Pro", label: "月額10万円プラン", amount: 100000, features: [
      "初回コンサル90分＋月2回45分","血液データ読解＆栄養戦略","LINE/Chatで週2回のフォロー","食習慣の行動デザイン（睡眠/ストレス含む）",
    ], badge: "おすすめ" },
    { title: "Elite", label: "月額30万円プラン", amount: 300000, features: [
      "初回コンサル120分＋毎週60分","遺伝子/血液/グルコース連携の精密プラン","個別レシピ＆買い物同行（オンライン/条件付）","専門医・検査機関との連携コーディネート",
    ], badge: "フルサポート" },
  ];

  const handleCheckout = async (amount, description) => {
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${res.status}: ${text}`);
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout url in response");
    } catch (e) {
      console.error("Checkout error:", e);
      alert("決済に失敗しました。設定（VITE_API_URL / サーバ / CORS）を確認してください。");
      // 旧メールフォールバックは無効化
    }
  };

  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold">PN</span>
            <span className="font-semibold">Precision Nutrition Coaching</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-slate-700">特徴</a>
            <a href="#programs" className="hover:text-slate-700">プログラム</a>
            <a href="#pricing" className="hover:text-slate-700">料金</a>
            <a href="#faq" className="hover:text-slate-700">FAQ</a>
            <a href="#contact" className="hover:text-slate-700">お問い合わせ</a>
          </nav>
          <button
            onClick={() => handleCheckout(plan.amount, plan.label)}
            className="hidden md:inline-flex rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90"
          >今すぐ申し込む</button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              データで“あなたの食”を再設計。
              <span className="block mt-2 text-slate-600 font-medium">精密栄養学コーチングで、根本から整える。</span>
            </h1>
            <p className="mt-6 text-slate-600 text-base md:text-lg">
              血液/遺伝子/睡眠/グルコースの指標を読み解き、最短距離で体調を改善。食のプロが、実装まで伴走します。
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <button
                onClick={() => handleCheckout(plan.amount, plan.label)}
                className="rounded-2xl bg-slate-900 text-white px-5 py-3 text-base hover:opacity-90"
              >{plan.label}で申し込む</button>
              <select
                className="rounded-2xl border px-4 py-3 text-sm"
                value={plan.amount}
                onChange={(e) => {
                  const amt = Number(e.target.value);
                  const p = plans.find((p) => p.amount === amt) || plans[0];
                  setPlan({ amount: p.amount, label: p.label });
                }}
              >
                {plans.map((p) => (
                  <option key={p.amount} value={p.amount}>{p.label}</option>
                ))}
              </select>
              <a href="#features" className="text-slate-600 text-sm underline underline-offset-4">仕組みを見る</a>
            </div>
            <p className="mt-4 text-xs text-slate-500">※ 決済はStripeの安全なページで行われます。分割/領収書対応はStripe設定に依存します。</p>
          </div>
          <div className="relative">
            <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8 border border-slate-200">
              <h3 className="font-semibold text-lg">コーチングの流れ</h3>
              <ol className="mt-4 space-y-3 text-slate-700 text-sm">
                <li><span className="font-semibold">1. アセスメント</span>：既往歴/血液/生活習慣のヒアリング</li>
                <li><span className="font-semibold">2. 設計</span>：目的に合わせた栄養戦略（PFC/ミクロ栄養/サプリ）</li>
                <li><span className="font-semibold">3. 実装</span>：買い物リスト/レシピ/外食選び/行動設計</li>
                <li><span className="font-semibold">4. 計測</span>：指標の推移をトラッキング＆調整</li>
              </ol>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-500">
                <div className="rounded-xl bg-slate-50 p-3">血液データ
                  <div className="text-slate-800 font-semibold">脂質/肝機能/炎症/鉄/甲状腺</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">遺伝子（任意）
                  <div className="text-slate-800 font-semibold">MAOA/B, DAOA/DAO, GAD1…</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">なぜ“精密”なのか</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            { title: "医学的指標に基づく意思決定", body: "感覚ではなく数値に基づき、介入→結果→再設計のサイクルを最適化。" },
            { title: "食のプロによる実装力", body: "栄養理論を現実の台所に落とし込む。買い物/下ごしらえ/外食選びまで具体化。" },
            { title: "継続しやすい設計", body: "生活リズム/嗜好/予算に合わせ、無理なく続くミールプランを共同設計。" },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">プログラム</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            { name: "1週間リセット", desc: "短期で食の土台を整える集中プログラム。" },
            { name: "2週間トランスフォーム", desc: "行動設計と検証を行う人気コース。" },
            { name: "3週間コンプリート", desc: "ライフスタイル全体を再設計。長期継続のプロトコルを構築。" },
          ].map((p) => (
            <div key={p.name} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">料金</h2>
        <p className="mt-2 text-slate-600 text-sm">目的とサポート量に合わせてお選びください。金額は税込想定。</p>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.title} className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="absolute -top-2 right-4 text-xs bg-slate-900 text-white rounded-full px-2 py-1">{p.badge}</div>
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <div className="mt-2 text-3xl font-extrabold">{p.amount.toLocaleString()}<span className="text-base font-medium text-slate-500"> 円/月</span></div>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><span>✓</span>{f}</li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(p.amount, p.label)}
                className="mt-5 w-full rounded-xl bg-slate-900 text-white py-3 hover:opacity-90"
              >このプランで申し込む</button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">よくある質問</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[
            { q: "医療行為との違いは？",
              a: "本サービスは医療・診断・治療を提供するものではありません。栄養/生活習慣のコーチングと情報提供を行います。必要に応じて医療機関をご案内します。" },
            { q: "検査は必須？", a: "血液データがあると精度が上がりますが、無しでも開始できます。遺伝子検査は任意です。" },
            { q: "食事は作ってくれる？", a: "基本はコーチングですが、上位プランでレシピ/買い物同行/外食選定の具体支援を行います（条件あり/オンライン中心）。" },
            { q: "海外からも参加可能？", a: "オンライン完結のため可能です。タイムゾーンに合わせて日程調整します。" },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold">無料相談（15分）</h2>
          <p className="mt-2 text-slate-600 text-sm">まずはゴールと現状をお聞かせください。適切なプランをご提案します。</p>
          <form
            className="mt-6 grid md:grid-cols-2 gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const name = data.get("name");
              const mail = data.get("email");
              const msg = data.get("message");
              window.location.href = `mailto:hello@example.com?subject=${encodeURIComponent(
                "無料相談の予約"
              )}&body=${encodeURIComponent(`お名前: ${name}\nメール: ${mail}\nメッセージ: ${msg}`)}`;
            }}
          >
            <input name="name" required placeholder="お名前" className="rounded-xl border px-4 py-3" />
            <input name="email" required type="email" placeholder="メールアドレス" className="rounded-xl border px-4 py-3" />
            <textarea name="message" placeholder="ご相談内容" className="md:col-span-2 rounded-xl border px-4 py-3 h-28" />
            <div className="md:col-span-2 flex items-center justify-between">
              <p className="text-xs text-slate-500">プライバシーポリシーに同意のうえ送信してください。</p>
              <button type="submit" className="rounded-xl bg-slate-900 text-white px-5 py-3 hover:opacity-90">送信</button>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Precision Nutrition Coaching</p>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-slate-800">トップに戻る</a>
            <a href="#" className="hover:text-slate-800">利用規約</a>
            <a href="#" className="hover:text-slate-800">プライバシー</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

