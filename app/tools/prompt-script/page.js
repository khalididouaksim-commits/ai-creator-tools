"use client";
import { useState } from "react";

export default function PromptScript() {
  const [input, setInput] = useState("");
  const [type, setType] = useState("prompt");
  const [result, setResult] = useState("");
  
  const generate = () => {
    if (!input.trim()) return;
    const topic = input.trim();
    
    if (type === "prompt") {
      const styles = ["photorealistic", "digital art", "cinematic lighting", "minimalist", "3D render"];
      const style = styles[Math.floor(Math.random() * styles.length)];
      setResult(`🖼️ Prompt جاهز:\n"${topic}", ${style}, high resolution, detailed composition, professional photography, soft shadows, 4k --ar 16:9 --v 6.0`);
    } else {
      setResult(`📜 سيناريو (${topic}):\n⏱️ المدة: 45 ثانية\n\n🎣 الخطاف (3 ثوانٍ): "إليك أسرع طريقة لإتقان ${topic} بدون خبرة مسبقة!"\n\n💡 النقطة 1: ابدأ بـ ${topic} باستخدام أدوات مجانية\n💡 النقطة 2: ركّز على الجودة قبل الكمية\n💡 النقطة 3: كرّر العملية يومياً لمدة أسبوع\n\n✅ الخاتمة: "جربها الآن، ولا تنسى المتابعة للمزيد!"`);
    }
  };
  
  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>✍️ مولد البرومبت والسيناريو</h2>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "15px", fontFamily: "inherit", backgroundColor: "#fff" }}
      >
        <option value="prompt">🖼️ مولد Prompt (صور/فيديو)</option>
        <option value="script">📜 مولد سيناريو (يوتيوب/تيك توك)</option>
      </select>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="اكتب موضوعك هنا (مثال: قهوة صباحية، ذكاء اصطناعي)..."
        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "15px", fontFamily: "inherit" }}
      />
      <button
        onClick={generate}
        style={{ width: "100%", padding: "12px", backgroundColor: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", fontFamily: "inherit", marginBottom: "15px" }}
      >
        ✨ توليد الآن
      </button>
      {result && (
        <div style={{ position: "relative" }}>
          <pre style={{ backgroundColor: "#f3f4f6", padding: "15px", borderRadius: "8px", whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: "1.6", border: "1px solid #e5e7eb" }}>{result}</pre>
          <button
            onClick={() => { navigator.clipboard.writeText(result); alert("تم النسخ بنجاح!"); }}
            style={{ marginTop: "10px", width: "100%", padding: "10px", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "inherit" }}
          >
            📋 نسخ النص
          </button>
        </div>
      )}
    </main>
  );
}