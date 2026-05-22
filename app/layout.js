export const metadata = {
  title: "أدوات صناع المحتوى | مجاناً",
  description: "مولد صور، تحويل نص لكلام، وتحريك صور مجاناً",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", backgroundColor: "#f9fafb" }}>
        {children}
      </body>
    </html>
  );
}