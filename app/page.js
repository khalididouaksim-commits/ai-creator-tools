export default function Home() {
  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>🛠️ أدوات صناع المحتوى</h1>
      <div style={{ display: "grid", gap: "15px" }}>
        <a href="/tools/image-generator" style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", textDecoration: "none", color: "#111", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>🖼️ مولد الصور</a>
        <a href="/tools/text-to-speech" style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", textDecoration: "none", color: "#111", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>🔊 تحويل النص إلى كلام</a>
        <a href="/tools/image-animator" style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", textDecoration: "none", color: "#111", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>🎬 تحريك الصور</a>
        <a href="/tools/prompt-script" style={{ padding: "20px", backgroundColor: "#fff", borderRadius: "10px", textDecoration: "none", color: "#111", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>✍️ مولد البرومبت والسيناريو</a>
      </div>
    </main>
  );
}