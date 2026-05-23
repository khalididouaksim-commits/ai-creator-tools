"use client";
import { useState, useEffect } from "react";

export default function ContentStudio() {
  // التحكم في التبويب النشط (الافتراضي: الرئيسية)
  const [activeTab, setActiveTab] = useState("home");
  const [logs, setLogs] = useState([]);
  
  // إضافة سجل التنبيهات السفلي
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs(prev => [...prev.slice(-2), "[" + time + "] " + msg]);
  };
  
  useEffect(() => {
    addLog("تم تشغيل استوديو صناع المحتوى بنجاح ✓");
  }, []);
  
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #060609 0%, #0b0b14 50%, #020205 100%)",
      color: "#f1f5f9",
      fontFamily: "system-ui, -apple-system, sans-serif",
      direction: "rtl",
      padding: "12px",
      paddingBottom: "30px"
    }}>
      
      {/* هيدر الموقع الاحترافي */}
      <header style={{
        textAlign: "center",
        marginBottom: "16px",
        padding: "16px",
        background: "rgba(13, 13, 25, 0.7)",
        borderRadius: "14px",
        border: "1px solid rgba(139, 92, 246, 0.2)",
        boxShadow: "0 0 15px rgba(139, 92, 246, 0.05)"
      }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🎬 استوديو صناع المحتوى الذكي
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>منصة متكاملة لإنتاج القصص، السيناريوهات، الأصوات، والصور</p>
      </header>

      {/* شريط التنقل الأفقي المتجاوب - حل مشكلة الأيقونات العمودية في الهاتف */}
      <nav style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        marginBottom: "20px",
        padding: "8px 4px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none", // إخفاء شريط التمرير في فايرفوكس
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* ستايل مخصص لإخفاء شريط التمرير في كروم وسفاري */}
        <style>{`
          nav::-webkit-scrollbar { display: none; }
          .nav-btn {
            padding: 10px 16px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.05);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
          }
        `}</style>

        <button onClick={() => setActiveTab("home")} className="nav-btn" style={{ background: activeTab === "home" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "home" ? "#fff" : "#94a3b8" }}>
          🏠 الرئيسية
        </button>
        <button onClick={() => setActiveTab("story")} className="nav-btn" style={{ background: activeTab === "story" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "story" ? "#fff" : "#94a3b8" }}>
          📚 كتابة القصة
        </button>
        <button onClick={() => setActiveTab("script")} className="nav-btn" style={{ background: activeTab === "script" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "script" ? "#fff" : "#94a3b8" }}>
          📜 السيناريو والبرومبت
        </button>
        <button onClick={() => setActiveTab("audio")} className="nav-btn" style={{ background: activeTab === "audio" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "audio" ? "#fff" : "#94a3b8" }}>
          🎤 هندسة الصوت
        </button>
        <button onClick={() => setActiveTab("image")} className="nav-btn" style={{ background: activeTab === "image" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "image" ? "#fff" : "#94a3b8" }}>
          🎨 توليد الصور
        </button>
        <button onClick={() => setActiveTab("animate")} className="nav-btn" style={{ background: activeTab === "animate" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "animate" ? "#fff" : "#94a3b8" }}>
          🎬 تحريك الصور
        </button>
      </nav>

      {/* محتوى التبويبات المتغيرة */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "300px" }}>
        
        {/* 1. تبويب الصفحة الرئيسية */}
        {activeTab === "home" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139, 92, 246, 0.15)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🚀</div>
            <h2 style={{ fontSize: "18px", color: "#a78bfa", marginBottom: "8px" }}>مرحباً بك في استوديو الإنتاج المتكامل</h2>
            <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6", maxWidth: "500px", margin: "0 auto" }}>
              هذه المنصة مصممة خصيصاً لمساعدتك في بناء وتطوير محتواك الرقمي بكفاءة عالية. تصفح الأدوات من الشريط العلوي للبدء في العمل.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
              <div style={{ background: "#090911", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>حالة النظام</div>
                <div style={{ fontSize: "13px", color: "#10b981", fontWeight: "600", marginTop: "4px" }}>جاهز ومستقر ✓</div>
              </div>
              <div style={{ background: "#090911", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>نوع الحساب</div>
                <div style={{ fontSize: "13px", color: "#fbbf24", fontWeight: "600", marginTop: "4px" }}>مطور محترف (مجاني)</div>
              </div>
            </div>
          </section>
        )}

        {/* 2. تبويب كتابة القصة */}
        {activeTab === "story" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء محرك كتابة القصة وتوزيع المشاهد...</p>
          </section>
        )}

        {/* 3. تبويب السيناريو */}
        {activeTab === "script" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء محرك كتابة السيناريو والحوار والبرومبت...</p>
          </section>
        )}

        {/* 4. تبويب الهندسة الصوتية */}
        {activeTab === "audio" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء نظام تحويل النص إلى صوت واستنساخ صوتك الشخصي بجودة عالية...</p>
          </section>
        )}

        {/* 5. تبويب توليد الصور */}
        {activeTab === "image" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا دمج كود توليد الصور المطور بعد معالجة مشكلة التحميل المباشر...</p>
          </section>
        )}

        {/* 6. تبويب تحريك الصور */}
        {activeTab === "animate" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء محرك تحريك الصور الثابتة إلى مقاطع فيديو...</p>
          </section>
        )}

      </div>

      {/* لوحة مراقبة النظام والـ Logs السفلية الاحترافية */}
      <footer style={{ maxWidth: "1200px", margin: "20px auto 0", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>

    </main>
  );
}