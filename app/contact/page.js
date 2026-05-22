export default function Contact() {
  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px", textAlign: "center" }}>📩 اتصل بنا</h1>
      <p style={{ marginBottom: "15px", textAlign: "center" }}>نرحب باستفساراتكم واقتراحاتكم. فريقنا يرد خلال 24–48 ساعة.</p>
      
      <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", textAlign: "center", marginBottom: "20px" }}>
        <p style={{ fontSize: "15px", marginBottom: "15px", color: "#334155" }}>📧 بريدنا الرسمي:</p>
        <p style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px", color: "#0f172a", direction: "ltr" }}>khalididouaksim@gmail.com</p>
        
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=khalididouaksim@gmail.com" target="_blank" style={{ display: "inline-block", padding: "12px 24px", backgroundColor: "#ea4335", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "15px" }}>
          ✉️ راسلني عبر Gmail
        </a>
      </div>

      <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center" }}>
        🔒 نحترم خصوصيتك ولا نشارك بريدك أو بيانات الزوار مع أي طرف ثالث.
      </p>
    </main>
  );
}