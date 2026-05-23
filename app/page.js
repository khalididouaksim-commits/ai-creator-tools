"use client";
import { useState } from "react";

// استيراد المكونات والأدوات الأصلية المتقدمة من مجلداتها الفرعية الصحيحة
import PromptScript from "./prompt-script/page";
import ImageGenerator from "./image-generator/page";
import ImageAnimator from "./image-animator/page";
import VideoGenerator from "./video-generator/page";
import TextToSpeech from "./text-to-speech/page";

export default function MainLayout() {
  // جعل صفحة توليد الصور هي الصفحة الافتراضية المفضلة لديك بناءً على صورك القديمة
  const [activeTab, setActiveTab] = useState("image");
  
  return (
    <div style={{ minHeight: "100vh", background: "#04040c", color: "#f1f5f9", fontFamily: "sans-serif", direction: "rtl" }}>
      
      {/* هيدر المنصة الأصلي الفخم */}
      <header style={{ textAlign: "center", padding: "24px 16px", borderBottom: "1px solid rgba(139,92,246,0.15)", background: "linear-gradient(to bottom, #090918, #04040c)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 }}>
          🎬 استوديو صناع المحتوى الذكي
        </h1>
        <p style={{ fontSize: "12px", color: "#a78bfa", marginTop: "6px", opacity: 0.8 }}>
          منصة متكاملة لإنتاج القصص، السيناريوهات، الأصوات، والصور
        </p>
      </header>

      {/* شريط الأزرار الأصلي المستوحى تماماً من واجهتك القديمة والجديدة معاً وبشكل متجاوب */}
      <nav style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        justifyContent: "center", 
        background: "#09091f", 
        padding: "10px", 
        gap: "8px", 
        borderBottom: "1px solid #1e1e38" 
      }}>
        
        <button
          onClick={() => setActiveTab("script")}
          style={{
            padding: "10px 16px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer",
            background: activeTab === "script" ? "#8b5cf6" : "rgba(39, 39, 74, 0.4)",
            color: "#fff", border: activeTab === "script" ? "none" : "1px solid #27274a"
          }}
        >
          📜 السيناريو والبرومبت
        </button>

        <button
          onClick={() => setActiveTab("image")}
          style={{
            padding: "10px 16px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer",
            background: activeTab === "image" ? "#8b5cf6" : "rgba(39, 39, 74, 0.4)",
            color: "#fff", border: activeTab === "image" ? "none" : "1px solid #27274a"
          }}
        >
          🎨 توليد الصور
        </button>

        <button
          onClick={() => setActiveTab("animate")}
          style={{
            padding: "10px 16px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer",
            background: activeTab === "animate" ? "#8b5cf6" : "rgba(39, 39, 74, 0.4)",
            color: "#fff", border: activeTab === "animate" ? "none" : "1px solid #27274a"
          }}
        >
          🎬 تحريك الصور
        </button>

        <button
          onClick={() => setActiveTab("video")}
          style={{
            padding: "10px 16px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer",
            background: activeTab === "video" ? "#8b5cf6" : "rgba(39, 39, 74, 0.4)",
            color: "#fff", border: activeTab === "video" ? "none" : "1px solid #27274a"
          }}
        >
          🎥 فيديو من نص
        </button>

        <button
          onClick={() => setActiveTab("tts")}
          style={{
            padding: "10px 16px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer",
            background: activeTab === "tts" ? "#8b5cf6" : "rgba(39, 39, 74, 0.4)",
            color: "#fff", border: activeTab === "tts" ? "none" : "1px solid #27274a"
          }}
        >
          🎤 هندسة الصوت
        </button>

      </nav>

      {/* منطقة جلب وعرض الملفات المتقدمة الحقيقية ديناميكياً */}
      <main style={{ padding: "16px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {activeTab === "script" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <PromptScript />
          </div>
        )}

        {activeTab === "image" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <ImageGenerator />
          </div>
        )}

        {activeTab === "animate" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <ImageAnimator />
          </div>
        )}

        {activeTab === "video" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <VideoGenerator />
          </div>
        )}

        {activeTab === "tts" && (
          <div style={{ animation: "fadeIn 0.3s ease-in-out" }}>
            <TextToSpeech />
          </div>
        )}

      </main>

      {/* ستايل بسيط لإضافة تأثير سلاسة أثناء التنقل بين الأدوات */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}