"use client";
import { useState } from "react";

// استيراد الأدوات والمكونات البرمجية بناءً على هيكلة مشروعك الحقيقية
import PromptScript from "./tools/prompt-script/page";
import ImageGenerator from "./tools/image-generator/page";
import VideoGenerator from "./tools/video-generator/page";
import TextToSpeech from "./tools/text-to-speech/page";
import ImageAnimator from "./tools/image-animator/page";

export default function Home() {
  // التبويب الافتراضي هو "الرئيسية"
  const [activeTab, setActiveTab] = useState("home");
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020208",
      color: "#f1f5f9",
      fontFamily: "sans-serif",
      padding: "12px",
      direction: "rtl"
    }}>
      
      {/* هيدر المنصة الاحترافي */}
      <header style={{
        textAlign: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        padding: "20px 10px",
        borderRadius: "16px",
        border: "1px solid rgba(99,102,241,0.2)",
        marginBottom: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
      }}>
        <h1 style={{ margin: "0 0 6px", fontSize: "18px", color: "#38bdf8", fontWeight: "bold" }}>
          🎬 استوديو صناع المحتوى الذكي
        </h1>
        <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
          منصة متكاملة لإنتاج القصص، السيناريوهات، الأصوات، واللقطات المتحركة من الهاتف
        </p>
      </header>

      {/* شريط التنقل العلوي المطور المتوافق مع شاشات الهاتف بالكامل */}
      <nav style={{
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        paddingBottom: "10px",
        marginBottom: "16px",
        WebkitOverflowScrolling: "touch"
      }}>
        <button 
          onClick={() => setActiveTab("home")}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            background: activeTab === "home" ? "#3b82f6" : "#1e1e38",
            color: "#fff"
          }}>
          🏠 الرئيسية
        </button>

        <button 
          onClick={() => setActiveTab("script")}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            background: activeTab === "script" ? "#8b5cf6" : "#1e1e38",
            color: "#fff"
          }}>
          📜 السيناريو والبرومبت
        </button>

        <button 
          onClick={() => setActiveTab("image")}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            background: activeTab === "image" ? "#ec4899" : "#1e1e38",
            color: "#fff"
          }}>
          🎨 توليد الصور (Flux)
        </button>

        <button 
          onClick={() => setActiveTab("speech")}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            background: activeTab === "speech" ? "#06b6d4" : "#1e1e38",
            color: "#fff"
          }}>
          🎤 هندسة الصوت
        </button>

        <button 
          onClick={() => setActiveTab("animator")}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            background: activeTab === "animator" ? "#a855f7" : "#1e1e38",
            color: "#fff"
          }}>
          🎥 تحريك الصورة
        </button>

        <button 
          onClick={() => setActiveTab("video")}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            background: activeTab === "video" ? "#10b981" : "#1e1e38",
            color: "#fff",
            boxShadow: activeTab === "video" ? "0 0 10px rgba(16,185,129,0.5)" : "none"
          }}>
          📹 إنتاج الفيديو واللقطات
        </button>
      </nav>

      {/* منطقة العرض الديناميكية (بدون نقص) */}
      <main style={{
        background: "rgba(15,23,42,0.4)",
        borderRadius: "16px",
        padding: "8px",
        minHeight: "350px"
      }}>
        
        {/* 1. محتوى تبويب الرئيسية الافتراضي */}
        {activeTab === "home" && (
          <div style={{
            padding: "30px 15px",
            textAlign: "center",
            background: "#0b0b1e",
            borderRadius: "12px",
            border: "1px solid #1e1e38"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🚀</div>
            <h2 style={{ fontSize: "15px", margin: "0 0 10px", color: "#60a5fa" }}>مرحباً بك في مستودعك الإنتاجي المطور</h2>
            <p style={{ fontSize: "11px", color: "#94a3b8", lineHeight: "1.6", maxWidth: "400px", margin: "0 auto" }}>
              اختر إحدى الأدوات من الشريط العلوي للبدء فوراً في صياغة الاسكريبت الوثائقي، توليد الشخصيات الثابتة، هندسة الأصوات، أو إنتاج اللقطات المتحركة بجودة سينمائية.
            </p>
          </div>
        )}

        {/* 2. عرض أداة السكريبت والبرومبت */}
        {activeTab === "script" && <PromptScript />}

        {/* 3. عرض أداة توليد الصور */}
        {activeTab === "image" && <ImageGenerator />}

        {/* 4. عرض أداة تحويل النص إلى صوت (هندسة الصوت) */}
        {activeTab === "speech" && <TextToSpeech />}

        {/* 5. عرض أداة تحريك الصورة لبث الكاميرا */}
        {activeTab === "animator" && <ImageAnimator />}

        {/* 6. عرض أداة إنتاج الفيديو الجديدة */}
        {activeTab === "video" && <VideoGenerator />}

      </main>

    </div>
  );
}