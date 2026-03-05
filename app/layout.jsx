export const metadata = {
  title: "アドラーと、悩みを解く",
  description: "アルフレッド・アドラーの哲学で対人関係の悩みを解決する",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
