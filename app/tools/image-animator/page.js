"use client";
import { useState } from "react";

export default function ImageAnimator() {
  const [imageSrc, setImageSrc] = useState(null);
  const [animation, setAnimation] = useState("none");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImageSrc(URL.createObjectURL(file));
  };

  const getStyle = () => {
    switch (animation) {
      case "zoom": return { transform: "scale(1.15)", transition: "transform 4s ease-in-out" };
      case "pan": return { animation: "panLeft 5s linear infinite alternate" };
      case "float": return { animation: "float 3s ease-in-out infinite" };
      default: return {};
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "15px" }}>🎬 تحريك الصور</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: "15px", fontFamily: "inherit" }} />
      <select
        value={animation}
        onChange={(e) => setAnimation(e.target.value)}
        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "15px", fontFamily: "inherit", backgroundColor: "#fff" }}
      >
        <option value="none">بدون تحريك</option>
        <option value="zoom">تكبير تدريجي</option>
        <option value="pan">تحريك جانبي</option>
        <option value="float">طفو عائم</option>
      </select>

      {imageSrc && (
        <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", height: "300px", backgroundColor: "#eee" }}>
          <img src={imageSrc} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", ...getStyle() }} />
        </div>
      )}

      <style>{`
        @keyframes panLeft { 0% { transform: translateX(0) scale(1.1); } 100% { transform: translateX(-10%) scale(1.1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>

      <p style={{ marginTop: "15px", fontSize: "13px", color: "#666", textAlign: "center" }}>
        💡 ملاحظة: التحريك يعمل في المتصفح مباشرة. يمكنك تسجيل الشاشة لحفظ النتيجة كفيديو.
      </p>
    </main>
  );
}