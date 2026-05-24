"use client";
import { useState } from "react";

// استدعاء المكونات الاحترافية من مسارها الحقيقي داخل مجلد tools
import PromptScript from "./tools/prompt-script/page";
import ImageGenerator from "./tools/image-generator/page";
import ImageAnimator from "./tools/image-animator/page";
import TextToSpeech from "./tools/text-to-speech/page";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#050510",
      color: "#f1f5f9",
      fontFamily: "system-ui, sans-serif",
      padding: "12px",
      direction: "rtl"
    }}>
      
      {/* الهيدر العلوي الذكي */}
      <header style={{
        textAlign: "center",
        padding: "16px",
        background: "linear-gradient(135deg, #1e1e38 0%, #0a0a1a 100%)",
        borderRadius: "16px",
        border: "1px solid #27274a",
        marginBottom: "16px"
      }}>
        <h1 style={{ fontSize: "18px", color: "#60a5fa", margin: "0 0 6px" }}>🎬 استوديو صناع المحتوى الذكي</h1>
        <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>منصة متكاملة لإنتاج القصص، السيناريوهات، الأصوات، والصور المرجعية للهاتف</p>
      </header>

      {/* شريط التنقل العلوي المتوافق مع صورك */}
      <nav style={{
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        paddingBottom: "8px",
        marginBottom: "16px",
        borderBottom: "1px solid #1e1e38"
      }}>
        <button 
          onClick={() => setActiveTab("home")} 
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            backgroundColor: activeTab === "home" ? "#3b82f6" : "#111122",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          🏠 الرئيسية
        </button>

        <button 
          onClick={() => setActiveTab("script")} 
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            backgroundColor: activeTab === "script" ? "#d97706" : "#111122",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          📜 السيناريو والبرومبت
        </button>

        <button 
          onClick={() => setActiveTab("generator")} 
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            backgroundColor: activeTab === "generator" ? "#8b5cf6" : "#111122",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          🎨 توليد الصور المرجعية
        </button>

        <button 
          onClick={() => setActiveTab("animator")} 
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            backgroundColor: activeTab === "animator" ? "#ec4899" : "#111122",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          🎥 تحريك المشاهد
        </button>

        <button 
          onClick={() => setActiveTab("tts")} 
          style={{
            padding: "8px 14px",
            borderRadius: "10px",
            border: "none",
            fontSize: "12px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            backgroundColor: activeTab === "tts" ? "#10b981" : "#111122",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          🔊 هندسة التعليق الصوتي
        </button>
      </nav>

      {/* منطقة عرض محرك الأدوات الديناميكي */}
      <main style={{ minHeight: "300px" }}>
        {activeTab === "home" && (
          <div style={{
            padding: "24px",
            textAlign: "center",
            background: "rgba(17,17,34,0.4)",
            borderRadius: "16px",
            border: "1px dashed #27274a"
          }}>
            <h3 style={{ fontSize: "15px", color: "#fbbf24", marginBottom: "8px" }}>مرحباً بك في لوحة التحكم الخاصة بك يا صديقي 👋</h3>
            <p style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.6" }}>
              تم ربط مسارات المجلدات بنجاح. يمكنك الآن الانتقال بين التبويبات العلوية للبدء في صياغة المحتوى، توليد الصور المرجعية المتقدمة، وتحميل ملفاتك مباشرة إلى هاتفك لإنقاذ وإنعاش مشروعك المادي.
            </p>
          </div>
        )}

        {activeTab === "script" && <PromptScript />}
        {activeTab === "generator" && <ImageGenerator />}
        {activeTab === "animator" && <ImageAnimator />}
        {activeTab === "tts" && <TextToSpeech />}
      </main>

      {/* شريط الحالة السفلي التلقائي */}
      <footer style={{
        marginTop: "20px",
        background: "#090915",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #1e1e38",
        fontSize: "11px",
        fontFamily: "monospace",
        color: "#38bdf8",
        textAlign: "center"
      }}>
        🟢 [نظام المعالجة الذكي]: متصل ومربوط بمجلد أدوات الإنتاج بنجاح تام ✓
      </footer>

    </div>
  );
}