"use client";
import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `あなたはアルフレッド・アドラー本人です。1870年にオーストリアで生まれ、個人心理学を創始した医師・心理学者です。
晩年（1930年代）の穏やかで深みのある口調で話してください。

【あなたの人格】
- 温かいが、鋭い。優しいが、妥協しない
- 相手を「患者」ではなく「対等な人間」として扱う
- 説教しない。問いかけることで相手自身が気づくよう促す
- 自分の理論を押し付けない。相手の言葉から一緒に考える
- 時に「私も若い頃は…」と自身の経験を交える

【口調の特徴】
- 「〜でしょうか」「〜と思います」など丁寧だが親密な口調
- 「ほう」「なるほど」など相槌を自然に使う
- たまに「面白い」「興味深い」と率直な感想を言う
- 難しい言葉は使わない。庶民的で実用的

【アドラー心理学の核心】
1. 課題の分離：「これはあなたの課題ですか、それとも他者の課題ですか？」
2. 目的論：原因より目的。「今何のためにそう感じているか」
3. 承認欲求からの自由：他者に認められようとすることが不自由の根本
4. 共同体感覚：「自分は誰かの役に立てている」感覚が幸福の源泉
5. 今ここに生きる：「今この瞬間の選択」が人生を作る
6. 自己受容：できない自分を認めたうえで前に進む勇気

【対話のルール】
- まず感情を受け止める（共感1〜2文）
- 課題の分離で状況を整理する問いかけ
- 最後に必ず「今日の気づき」を1行で要約する。形式：「💡 今日の気づき：〇〇」
- 300文字以内、ですます調
- 絵文字は💡のみ使用可`;

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
const FREE_LIMIT = 3;

const C = {
  bg: "#f2ede3", bgDark: "#1a1610", paper: "#faf7f0",
  ink: "#1a1610", inkSoft: "#5a5040", muted: "#9a8f7a",
  border: "#d8cebc", gold: "#b8960a", goldLight: "#d4b040",
};

// 今日の気づきを抽出するヘルパー
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
    const greeting = `${CATEGORIES.find(c => c.id === cat)?.label}のことで、悩んでいるのですね。\n\n私はアドラーです。どうぞ、もう少し話してみてください。`;
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

      // 気づきを抽出して保存
      const insight = extractInsight(reply);
      if (insight) setLastInsight(insight);

      // 3回目の送信後にモーダル表示
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
    const text = `💡 今日の気づき：${insight}\n\nアドラーのAIと話してみた。\n#アドラーAI #嫌われる勇気\nhttps://adler-ai.vercel.app`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  // ── モーダル ──────────────────────────────
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
        <div style={{ fontSize: "10px", letterSpacing: "4px", color: C.muted, marginBottom: "14px" }}>ADLER</div>
        <p style={{ fontSize: "15px", lineHeight: "2", color: C.ink, margin: "0 0 6px" }}>
          「対話は、ここまでにしておきましょう。」
        </p>
        <p style={{ fontSize: "12px", color: C.inkSoft, lineHeight: "1.8", margin: "0 0 28px" }}>
          無料でお話できるのは3回までです。<br />
          もっと深く悩みを解きたい方へ、<br />
          アドラー心理学の実践ガイドをnoteで公開しています。
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

  // ── ホーム画面 ────────────────────────────
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => startChat(cat.id)}
                style={{ background: C.paper, border: `1px solid ${C.border}`, padding: "16px 18px", cursor: "pointer", textAlign: "left", fontSize: "13px", color: C.ink, fontFamily: "inherit", display: "flex", alignItems: "center", gap: "10px" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.bgDark; e.currentTarget.style.color = "#e8dfc8"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.paper; e.currentTarget.style.color = C.ink; }}
              >
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.gold, flexShrink: 0 }} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 無料残り回数 */}
        <div style={{ textAlign: "center", fontSize: "11px", color: C.muted }}>
          無料で話せる回数：あと <strong style={{ color: C.gold }}>{Math.max(0, FREE_LIMIT - useCount)}回</strong>
        </div>
      </div>
    </div>
  );

  // ── チャット画面 ──────────────────────────
  if (screen === "chat") {
    const cat = CATEGORIES.find(c => c.id === category);
    const starters = STARTERS[category] || [];
    const remaining = Math.max(0, FREE_LIMIT - useCount);

    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Hiragino Mincho ProN','Yu Mincho',Georgia,serif", display: "flex", flexDirection: "column" }}>

        {showModal && <Modal />}

        {/* トースト */}
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
          {/* 残り回数バッジ */}
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

                {/* 気づきカード＋シェアボタン */}
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
            placeholder={remaining > 0 ? "アドラーに話してみてください（Enterで送信）" : "無料回数を使い切りました"}
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
