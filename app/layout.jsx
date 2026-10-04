import "./globals.css";

export const metadata = {
  title: "eSports Betting",
  description: "Dashboard de apuestas eSports con Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
