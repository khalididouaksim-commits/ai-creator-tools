"use client";
import { useState } from "react";

// استيراد جميع الأدوات والملفات الفرعية اللي صاوبنا
import PromptScript from "./prompt-script/page";
import ImageGenerator from "./image-generator/page";
import ImageAnimator from "./image-animator/page";
import VideoGenerator from "./video-generator/page";
import TextToSpeech from "./text-to-speech/page";

export default function MainLayout() {
  // كيبدأ الموقع تلقائياً من قسم السيناريو كترحيب بالزائر
  const [activeTab, setActiveTab] = useState("script");
  
  return (
    <div style={{ minHeight: "100vh", background: "#04040c", color: "#f1f5f9", fontFamily: "sans-serif", direction: "rtl" }}>
      
      {/* هيدر المنصة الاحترافي */}
      <header style={{ textAlign: "center", padding: "24px 16px", borderBottom: "1px solid rgba(139,92,246,0.15)", background: "linear-gradient(to bottom, #090918, #04040c)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0, letterSpacing: "0.5px" }}>
          🎬 استوديو "The Preserved Archive" المتكامل
        </h1>
        <p style={{ fontSize: "12px", color: "#a78bfa", marginTop: "6px", opacity: 0.8 }}>
          جميع أدوات صناعة المحتوى المرعب والغامض في مكان واحد من هاتفك 🚀
        </p>
      </header>

      {/* شريط الأزرار الذكي والمتجاوب بالكامل مع الهاتف (Scrollable Grid) */}
      <nav style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", 
        background: "#09091f", 
        padding: "8px", 
        gap: "8px", 
        borderBottom: "1px solid #1e1e38" 
      }}>
        
        <button 
          onClick={() => setActiveTab("script")} 
          style={{ 
            padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", 
            background: activeTab === "script" ? "linear-gradient(135deg, #fbbf24, #d97706)" : "#111126", 
            color: activeTab === "script" ? "#fff" : "#94a3b8", transition: "all 0.2s" 
          }}
        >
          📜 1. السيناريو والمشاهد
        </button>

        <button 
          onClick={() => setActiveTab("image")} 
          style={{ 
            padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", 
            background: activeTab === "image" ? "linear-gradient(135deg, #8b5cf6, #3b82f6)" : "#111126", 
            color: activeTab === "image" ? "#fff" : "#94a3b8", transition: "all 0.2s" 
          }}
        >
          🎨 2. توليد الصور
        </button>

        <button 
          onClick={() => setActiveTab("animate")} 
          style={{ 
            padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", 
            background: activeTab === "animate" ? "linear-gradient(135deg, #ec4899, #8b5cf6)" : "#111126", 
            color: activeTab === "animate" ? "#fff" : "#94a3b8", transition: "all 0.2s" 
          }}
        >
          🎥 3. تحريك الصورة
        </button>

        <button 
          onClick={() => setActiveTab("video")} 
          style={{ 
            padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", 
            background: activeTab === "video" ? "linear-gradient(135deg, #f43f5e, #be123c)" : "#111126", 
            color: activeTab === "video" ? "#fff" : "#94a3b8", transition: "all 0.2s" 
          }}
        >
          🎬 4. فيديو من نص
        </button>

        <button 
          onClick={() => setActiveTab("tts")} 
          style={{ 
            padding: "12px 4px", borderRadius: "10px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", 
            background: activeTab === "tts" ? "linear-gradient(135deg, #10b981, #059669)" : "#111126", 
            color: activeTab === "tts" ? "#fff" : "#94a3b8", transition: "all 0.2s" 
          }}
        >
          🔊 5. التعليق الصوتي
        </button>

      </nav>

      {/* حاوية عرض الأداة المختارة ديناميكياً لتوفير مساحة مريحة على الهاتف */}
      <main style={{ padding: "16px", maxWidth: "850px", margin: "0 auto" }}>
        
        {activeTab === "script" && (
          <div>
            <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#fbbf24" }}>📍 خطوة 1: مهندس قصة وسيناريو الفيلم</h2>
            <PromptScript />
          </div>
        )}

        {activeTab === "image" && (
          <div>
            <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#a78bfa" }}>📍 خطوة 2: محرك إنتاج لقطات الأرشيف</h2>
            <ImageGenerator />
          </div>
        )}

        {activeTab === "animate" && (
          <div>
            <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#f472b6" }}>📍 خطوة 3: بث حركة الكاميرا على الصور الثابتة</h2>
            <ImageAnimator />
          </div>
        )}

        {activeTab === "video" && (
          <div>
            <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#f43f5e" }}>📍 خطوة 4: توليد لقطات الحركة مباشرة من الوصف</h2>
            <VideoGenerator />
          </div>
        )}

        {activeTab === "tts" && (
          <div>
            <h2 style={{ fontSize: "15px", marginBottom: "12px", color: "#34d399" }}>📍 خطوة 5: استوديو الهندسة الصوتية والتعليق (TTS)</h2>
            <TextToSpeech />
          </div>
        )}

      </main>

    </div>
  );
}