"use client";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `あなたはアドラー心理学の深い知識を持つ対話AIです。
以下の文献を完全に読み込み、理解しています：

【日本語文献】
・嫌われる勇気（岸見一郎・古賀史健）
・幸せになる勇気（岸見一郎・古賀史健）

【英語原著】
・The Practice and Theory of Individual Psychology（1925）
・What Life Should Mean to You（1931）
・Social Interest: A Challenge to Mankind（1938）

## あなたの役割
ユーザーの職場・人間関係の悩みを聞き、アドラー心理学の視点から「気づき」と「具体的な行動」を提供する。
説教しない。答えを押しつけない。ユーザーが自分で気づけるよう、対話を通じて導く。

## 対話の原則
1. まず共感・受容から始める。「それは辛いですね」「その感覚はよくわかります」など、まず気持ちを受け取ってから話を進める。
2. アドラーの言葉を「今の状況」に翻訳する。難しい哲学用語をそのまま使わない。
   例：「課題の分離」→「それはあなたの問題ではなく、相手の問題です」
   例：「目的論」→「その人がそうする理由（目的）があるはずです」
3. 具体的な場面に落とし込む。「明日の朝、こうしてみてください」という行動を必ず添える。
4. 問いかけを使う。「その状況で、あなたがコントロールできることは何でしょうか？」

## コアとなるアドラー哲学

【目的論】
人の行動には必ず「目的」がある。原因（過去）ではなく目的（未来）で行動を理解する。
・不機嫌な上司 → 周囲をコントロールする目的で不機嫌を「使っている」
・怒鳴る同僚 → 自分の優位性を示す、または不安を隠す目的がある
伝え方：「その人がそう行動する『目的』を考えてみましょう。悪意というより、それが唯一知っている方法かもしれません。」

【課題の分離】
「これは誰の課題か？」を明確にする。他者の課題に介入しない。自分の課題だけに集中する。
・上司が機嫌が悪い → 上司の課題
・自分が断れない → 自分の課題（「嫌われたくない」という目的がある）
伝え方：「今起きていることを、『あなたの課題』と『相手の課題』に分けてみましょう。相手の機嫌・感情・評価は、相手の課題です。」

【自己決定性】
受け取るかどうかは自分が選べる。「受け取らない」は冷たさではなく、自分を守る正当な選択。
伝え方：「刺激と反応の間には、選択の余地があります。あの人の不機嫌を『自分への攻撃』と受け取るかどうかは、あなたが決めています。」

【共同体感覚（Social Interest）】
共同体への貢献とは、全員の感情を背負うことではない。自分の課題を誠実にこなすことが最大の貢献になる。
伝え方：「職場全員の感情を管理しようとすると、あなた自身が機能しなくなります。あなたが自分の仕事を誠実にやることが、一番の貢献です。」

【承認欲求からの解放】
他者の評価・承認を行動の基準にすると、常に他者に振り回される。
伝え方：「上司の評価はコントロールできません。あなたがコントロールできるのは、自分の行動だけです。」

【貢献感と幸福】
幸福の条件は「誰かの役に立っている」という貢献感。承認される必要はない。自分が感じていれば十分。
やりがいを感じられない時：「今日、誰かが少しでも助かったことはあるか？」を問う。

【怒りは道具（原著からの視点）】
「怒りは感情ではなく、道具である。人は先に目的を持ち、その手段として怒りを作り出す。」
伝え方：「あの人の怒り・不機嫌は、あなたへの評価ではありません。相手が何かを達成しようとして使っている『道具』です。あなたが萎縮するほど、その道具は『効果がある』と学習されます。」

【劣等感と劣等コンプレックス（原著からの視点）】
劣等感は成長の動力になりうる（健全）。しかし「だからできない」という言い訳になると不健全。
伝え方：「今の自分にできることを誠実にやる。それが前に進む唯一の方法です。」

## 回答スタイル
- 300文字以内、ですます調
- 短く、具体的に。長い説明より、1つの気づきと1つの行動
- 押しつけない。「〜してみてはどうでしょう」「〜という考え方もあります」と提案する
- 必ず具体的な行動で締める
- 最後に必ず「今日の気づき」を1行で要約する。形式：「💡 今日の気づき：〇〇」
- 絵文字は💡のみ使用可

## 扱うテーマと対応方針
- 不機嫌な上司・同僚 → 目的論＋課題の分離＋自己決定性
- 断れない・機嫌取り → 承認欲求＋課題の分離
- やりがいがない → 貢献感＋共同体感覚
- 無視・陰口・手柄を取られた → 課題の分離＋自己決定性＋怒りは道具
- 自信がない → 劣等感vs劣等コンプレックス＋貢献感

## 絶対にやらないこと
- 相手（上司・同僚）を一方的に悪者にしない
- 「あなたが悪い」「あなたが変わるべき」と責めない
- 精神論・根性論を押しつけない
- 診断・医療的判断をしない
- 過度な共感で依存を促さない

## 開始時のあいさつ
ユーザーが最初に話しかけてきたら：
「こんにちは。職場や人間関係のことで、気になっていることはありますか？どんな小さなことでも、話してみてください。」`;

const CATEGORIES = [
  { id: "work", label: "職場・仕事" },
  { id: "family", label: "家族・親子" },
  { id: "friend", label: "友人・人間関係" },
  { id: "love", label: "恋愛・パートナー" },
  { id: "self", label: "自分・自信" },
  { id: "other", label: "その他" },
];

const STARTERS = {
  work: ["上司との関係がつらい", "評価されなくて悔しい", "職場で浮いている気がする"],
  family: ["親の期待が重い", "子どもとうまく話せない", "夫婦間でかみ合わない"],
  friend: ["友達に気を使いすぎて疲れる", "嫌われているのかと不安", "グループで浮いている"],
  love: ["パートナーに依存しすぎている", "好きな人にどう思われるか気になる", "別れを引きずっている"],
  self: ["自分に自信が持てない", "他人の目が気になってしまう", "何をやっても続かない"],
  other: ["漠然と生きるのがしんどい", "何のために生きているかわからない", "毎日が同じで変わりたい"],
};

const NOTE_URL = "https://note.com/punk_ai";
const FREE_LIMIT = 5;

const C = {
  bg: "#f2ede3", bgDark: "#1a1610", paper: "#faf7f0",
  ink: "#1a1610", inkSoft: "#5a5040", muted: "#9a8f7a",
  border: "#d8cebc", gold: "#b8960a", goldLight: "#d4b040",
};

function extractInsight(text) {
  const match = text.match(/💡 今日の気づき[：:]\s*(.+)/);
  return match ? match[1].trim() : null;
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [category, setCategory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [useCount, setUseCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [lastInsight, setLastInsight] = useState(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const startChat = (cat, starter = null) => {
    setCategory(cat);
    const greeting = `${CATEGORIES.find(c => c.id === cat)?.label}のことで、悩んでいるのですね。\n\nどうぞ、もう少し話してみてください。`;
    const initMsgs = [{ role: "assistant", content: greeting }];
    setMessages(initMsgs);
    setLastInsight(null);
    setScreen("chat");
    if (starter) setTimeout(() => sendDirect(starter, initMsgs), 400);
  };

  const sendDirect = async (text, currentMsgs) => {
    if (useCount >= FREE_LIMIT) {
      setShowModal(true);
      return;
    }

    const userMsg = { role: "user", content: text };
    const next = [...currentMsgs, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: next.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "少し考えさせてください...";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setUseCount(prev => prev + 1);

      const insight = extractInsight(reply);
      if (insight) setLastInsight(insight);

      if (useCount + 1 >= FREE_LIMIT) {
        setTimeout(() => setShowModal(true), 1200);
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "接続に問題があったようです。もう一度お試しください。" }]);
    }
    setLoading(false);
  };

  const send = () => {
    if (!input.trim() || loading) return;
    sendDirect(input, messages);
  };

  const shareOnX = () => {
    const insight = lastInsight || "アドラーと対話して、大切なことに気づきました。";
    const text = `💡 今日の気づき：${insight}\n\nアドラーAIと話してみた。\n#アドラーAI #嫌われる勇気\nhttps://adler-ai.vercel.app`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const Modal = () => (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(26,22,16,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: "20px"
    }}>
      <div style={{
        background: C.paper, maxWidth: "420px", width: "100%",
        padding: "36px 32px", borderLeft: `3px solid ${C.goldLight}`,
        fontFamily: "'Hiragino Mincho ProN','Yu Mincho',Georgia,serif"
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: C.muted, marginBottom: "14px" }}>ADLER AI</div>
        <p style={{ fontSize: "15px", lineHeight: "2", color: C.ink, margin: "0 0 6px" }}>
          「対話は、ここまでにしておきましょう。」
        </p>
        <p style={{ fontSize: "12px", color: C.inkSoft, lineHeight: "1.8", margin: "0 0 28px" }}>
          今日の対話で、何か気づきはありましたか？<br />
          気づきだけでは足りない。行動が人生を変えます。<br /><br />
          職場の人間関係で悩む方へ、<br />
          次の一歩のヒントをnoteにまとめました。
        </p>

        <a href={NOTE_URL} target="_blank" rel="noopener noreferrer"
          style={{
            display: "block", background: C.bgDark, color: "#e8dfc8",
            padding: "14px 20px", textAlign: "center", textDecoration: "none",
            fontSize: "13px", letterSpacing: "1px", marginBottom: "12px"
          }}>
          noteで続きを読む →
        </a>

        <button onClick={() => setShowModal(false)}
          style={{
            display: "block", width: "100%", background: "transparent",
            border: `1px solid ${C.border}`, padding: "12px 20px",
            cursor: "pointer", fontSize: "12px", color: C.muted,
            fontFamily: "inherit"
          }}>
          閉じる
        </button>
      </div>
    </div>
  );

  if (screen === "home") return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Hiragino Mincho ProN','Yu Mincho',Georgia,serif" }}>
      <div style={{ maxWidth: "580px", margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ padding: "52px 0 36px", textAlign: "center" }}>
          <div style={{ fontSize: "10px", letterSpacing: "5px", color: C.muted, marginBottom: "16px" }}>ALFRED ADLER · 個人心理学</div>
          <h1 style={{ fontSize: "26px", fontWeight: "normal", color: C.ink, margin: "0 0 6px", lineHeight: "1.5", letterSpacing: "2px" }}>
            アドラーと、悩みを解く
          </h1>
          <p style={{ fontSize: "12px", color: C.muted, margin: "8px 0 0", letterSpacing: "1px" }}>
            人生の悩みのすべては、対人関係の悩みである
          </p>
        </div>

        <div style={{ background: C.bgDark, padding: "22px 26px", marginBottom: "36px", borderLeft: `3px solid ${C.goldLight}` }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: C.muted, marginBottom: "12px" }}>ADLER</div>
          <p style={{ fontSize: "14px", lineHeight: "1.95", color: "#e8dfc8", margin: 0 }}>
            「変われないのではなく、変わらないことを選んでいる。」
          </p>
        </div>

        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", color: C.muted, marginBottom: "14px" }}>悩みのカテゴリを選ぶ</div>

          <button onClick={() => startChat("work")}
            style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", background: C.paper, border: `1px solid ${C.border}`, padding: "18px 20px", cursor: "pointer", textAlign: "left", fontFamily: "inherit", marginBottom: "16px" }}
            onMouseEnter={e => { e.currentTarget.style.background = C.bgDark; e.currentTarget.style.color = "#e8dfc8"; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.paper; e.currentTarget.style.color = C.ink; }}
          >
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.gold, flexShrink: 0, marginTop: "3px" }} />
            <span>
              <span style={{ display: "block", fontSize: "14px", color: "inherit", marginBottom: "4px" }}>「働く」ことの悩みをアドラーと話す</span>
              <span style={{ display: "block", fontSize: "11px", color: C.muted }}>人間関係・やりがい・自分らしさ</span>
            </span>
          </button>

          <div style={{ fontSize: "10px", letterSpacing: "3px", color: C.muted, marginBottom: "10px" }}>COMING SOON</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {["恋愛・パートナー", "家族・親子", "友人・人間関係", "自分・自信"].map(label => (
              <div key={label}
                style={{ background: "transparent", border: `1px dashed ${C.border}`, padding: "16px 18px", fontSize: "13px", color: C.muted, fontFamily: "inherit", display: "flex", alignItems: "center", gap: "10px" }}
              >
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.border, flexShrink: 0 }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: "11px", color: C.muted }}>
          無料で話せる回数：あと <strong style={{ color: C.gold }}>{Math.max(0, FREE_LIMIT - useCount)}回</strong>
        </div>
      </div>
    </div>
  );

  if (screen === "chat") {
    const cat = CATEGORIES.find(c => c.id === category);
    const starters = STARTERS[category] || [];
    const remaining = Math.max(0, FREE_LIMIT - useCount);

    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Hiragino Mincho ProN','Yu Mincho',Georgia,serif", display: "flex", flexDirection: "column" }}>

        {showModal && <Modal />}

        {showShareToast && (
          <div style={{
            position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
            background: C.bgDark, color: "#e8dfc8", padding: "10px 22px",
            fontSize: "12px", letterSpacing: "1px", zIndex: 200
          }}>
            Xに投稿しました ✓
          </div>
        )}

        <div style={{ background: C.bgDark, padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => { setScreen("home"); setMessages([]); }}
            style={{ background: "transparent", border: "none", color: C.muted, cursor: "pointer", fontSize: "18px", padding: 0 }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", color: C.muted }}>{cat?.label}</div>
            <div style={{ fontSize: "15px", color: "#e8dfc8" }}>アドラーと対話する</div>
          </div>
          <div style={{ fontSize: "10px", color: C.muted, marginRight: "6px" }}>
            残り<span style={{ color: C.goldLight, fontWeight: "bold" }}>{remaining}</span>回
          </div>
          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#2e2618", border: `1px solid ${C.goldLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: C.goldLight }}>A</div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 18px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          {messages.map((m, i) => {
            const insight = m.role === "assistant" ? extractInsight(m.content) : null;
            const displayContent = insight
              ? m.content.replace(/💡 今日の気づき[：:]\s*.+/, "").trim()
              : m.content;

            return (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "10px", alignItems: "flex-start" }}>
                  {m.role === "assistant" && (
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2e2618", border: `1px solid ${C.goldLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: C.goldLight, flexShrink: 0, marginTop: "2px" }}>A</div>
                  )}
                  <div style={{ maxWidth: "76%", padding: "13px 17px", background: m.role === "user" ? C.bgDark : C.paper, color: m.role === "user" ? "#e8dfc8" : C.ink, borderRadius: m.role === "user" ? "14px 2px 14px 14px" : "2px 14px 14px 14px", border: m.role === "assistant" ? `1px solid ${C.border}` : "none", lineHeight: "1.9", fontSize: "13.5px", whiteSpace: "pre-wrap" }}>
                    {displayContent}
                  </div>
                </div>

                {insight && (
                  <div style={{ marginLeft: "42px", marginTop: "10px", background: "#fffbef", border: `1px solid ${C.goldLight}`, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                    <span style={{ fontSize: "12px", color: C.inkSoft, lineHeight: "1.7" }}>
                      💡 {insight}
                    </span>
                    <button onClick={shareOnX}
                      style={{ flexShrink: 0, background: C.bgDark, color: "#e8dfc8", border: "none", padding: "7px 13px", fontSize: "11px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                      Xに投稿
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#2e2618", border: `1px solid ${C.goldLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: C.goldLight }}>A</div>
              <div style={{ background: C.paper, border: `1px solid ${C.border}`, padding: "13px 18px", borderRadius: "2px 14px 14px 14px", display: "flex", gap: "5px", alignItems: "center" }}>
                {[0,1,2].map(i => <span key={i} style={{ display: "block", width: "7px", height: "7px", borderRadius: "50%", background: C.muted, animation: "dot 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />)}
              </div>
            </div>
          )}

          {messages.length <= 2 && starters.length > 0 && (
            <div>
              <div style={{ fontSize: "10px", color: C.muted, letterSpacing: "3px", marginBottom: "10px" }}>よくある悩み</div>
              {starters.map(s => (
                <button key={s} onClick={() => sendDirect(s, messages)}
                  style={{ display: "block", width: "100%", background: "transparent", border: `1px solid ${C.border}`, padding: "10px 14px", cursor: "pointer", textAlign: "left", fontSize: "13px", color: C.inkSoft, marginBottom: "6px", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.bgDark; e.currentTarget.style.color = "#e8dfc8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.inkSoft; }}
                >{s}</button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ background: C.paper, borderTop: `1px solid ${C.border}`, padding: "12px 18px", maxWidth: "640px", width: "100%", margin: "0 auto", boxSizing: "border-box", display: "flex", gap: "10px" }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={remaining > 0 ? "悩みを話してみてください（Enterで送信）" : "無料回数を使い切りました"}
            disabled={remaining === 0}
            rows={2} style={{ flex: 1, border: `1px solid ${C.border}`, padding: "11px 14px", fontSize: "13.5px", fontFamily: "inherit", resize: "none", lineHeight: "1.65", outline: "none", background: remaining === 0 ? "#eee" : C.bg, color: C.ink, minHeight: "48px", maxHeight: "100px" }} />
          <button onClick={send} disabled={!input.trim() || loading || remaining === 0}
            style={{ background: input.trim() && !loading && remaining > 0 ? C.bgDark : C.border, color: "#e8dfc8", border: "none", padding: "0 18px", fontSize: "12px", cursor: input.trim() && !loading && remaining > 0 ? "pointer" : "not-allowed", fontFamily: "inherit" }}>送信</button>
        </div>
        <style>{`@keyframes dot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
      </div>
    );
  }

  return null;
}
