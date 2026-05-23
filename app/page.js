"use client";
import { useState } from "react";
import ImageGenerator from "./image-generator/page";
import TextToSpeech from "./text-to-speech/page";
import ImageAnimator from "./image-animator/page";
import PromptScript from "./prompt-script/page";
import VideoGenerator from "./video-generator/page"; // استيراد صانع الفيديو الجديد

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState("script");
  
  return (
    <div style={{ minHeight: "100vh", background: "#04040c", color: "#f1f5f9", fontFamily: "sans-serif", direction: "rtl" }}>
      
      <header style={{ textAlign: "center", padding: "24px 16px", borderBottom: "1px solid rgba(139,92,246,0.15)", background: "linear-gradient(to bottom, #090918, #04040c)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 }}>
          🎬 استوديو "The Preserved Archive" المتكامل
        </h1>
        <p style={{ fontSize: "12px", color: "#a78bfa", marginTop: "6px", opacity: 0.8 }}>
          جميع أدوات صناعة المحتوى المرعب والغامض في مكان واحد من هاتفك 🚀
        </p>
      </header>

      {/* شريط الأزرار المحدث لجمع الـ 5 أدوات */}
      <nav style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", background: "#09091f", padding: "8px", gap: "8px", borderBottom: "1px solid #1e1e38" }}>
        <button onClick={() => setActiveTab("script")} style={{ padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", background: activeTab === "script" ? "linear-gradient(135deg, #fbbf24, #d97706)" : "#111126", color: activeTab === "script" ? "#fff" : "#94a3b8" }}>
          📜 1. السيناريو والمشاهد
        </button>

        <button onClick={() => setActiveTab("image")} style={{ padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", background: activeTab === "image" ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : "#111126", color: activeTab === "image" ? "#fff" : "#94a3b8" }}>
          🎨 2. توليد الصور
        </button>

        <button onClick={() => setActiveTab("animate")} style={{ padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", background: activeTab === "animate" ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "#111126", color: activeTab === "animate" ? "#fff" : "#94a3b8" }}>
          🎥 3. تحريك الصورة
        </button>

        <button onClick={() => setActiveTab("video")} style={{ padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", background: activeTab === "video" ? "linear-gradient(135deg, #f43f5e, #be123c)" : "#111126", color: activeTab === "video" ? "#fff" : "#94a3b8" }}>
          🎬 4. فيديو من نص (جديد)
        </button>

        <button onClick={() => setActiveTab("tts")} style={{ padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", background: activeTab === "tts" ? "linear-gradient(135deg, #10b981, #059669)" : "#111126", color: activeTab === "tts" ? "#fff" : "#94a3b8" }}>
          🔊 5. التعليق الصوتي
        </button>
      </nav>

      <main style={{ padding: "16px", maxWidth: "850px", margin: "0 auto" }}>
        {activeTab === "script" && <PromptScript />}
        {activeTab === "image" && <ImageGenerator />}
        {activeTab === "animate" && <ImageAnimator />}
        {activeTab === "video" && <VideoGenerator />} 
        {activeTab === "tts" && <TextToSpeech />}
      </main>

    </div>
  );
}