​"use client";
import { useState } from "react";
​export default function ImageGenerator() {
const [prompt, setPrompt] = useState("");
const [width, setWidth] = useState(1024);
const [height, setHeight] = useState(1024);
const [refUrl, setRefUrl] = useState("");
const [imageUrl, setImageUrl] = useState(null);
const [loading, setLoading] = useState(false);
const [uploading, setUploading] = useState(false);
​const handleFileChange = async (e) => {
const file = e.target.files[0];
if (!file) return;
​setUploading(true);
const localUrl = URL.createObjectURL(file);
setRefUrl(localUrl);
​try {
const formData = new FormData();
formData.append("file", file);
​const res = await fetch("https://file.io/?expires=1d", {
method: "POST",
body: formData,
});
const data = await res.json();
​if (data?.success && data?.link) {
setRefUrl(data.link);
}
} catch (err) {
console.log("Upload error:", err);
}
setUploading(false);
};
​const generate = () => {
const text = prompt.trim();
if (!text) {
alert("الرجاء كتابة وصف للصورة أولاً!");
return;
}
​if (uploading) {
alert("يرجى الانتظار حتى يكتمل رفع الصورة المرجعية");
return;
}
​setLoading(true);
setImageUrl(null);
​let params = "?width=" + width + "&height=" + height + "&nologo=true&seed=" + Math.random();
​if (refUrl && refUrl.startsWith("https://")) {
params += "&image=" + encodeURIComponent(refUrl);
}
​const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(text) + params;
setImageUrl(url);
};
​const downloadImage = async () => {
if (!imageUrl) return;
try {
const response = await fetch(imageUrl);
const blob = await response.blob();
const blobUrl = window.URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = blobUrl;
link.download = "ai-image-" + Date.now() + ".png";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
window.URL.revokeObjectURL(blobUrl);
} catch (error) {
window.open(imageUrl, "_blank");
}
};
​return (
<main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "system-ui, sans-serif", direction: "rtl" }}>
<h2 style={{ fontSize: "20px", marginBottom: "15px", textAlign: "center" }}>🖼️ مولد الصور + مرجع</h2>
​<textarea
placeholder="اكتب وصف الصورة بالإنجليزية (مثال: a cat in cyberpunk city, cinematic lighting)"
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", marginBottom: "10px", minHeight: "70px", fontFamily: "inherit" }}
/>
​<div style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
<label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>📱 صورة مرجعية (اختياري):</label>
<input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: "14px" }} />
{refUrl && (
<img src={refUrl} alt="Reference" style={{ marginTop: "8px", maxWidth: "100%", maxHeight: "150px", borderRadius: "6px", objectFit: "cover" }} />
)}
</div>
​<div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
<input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="العرض" style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }} />
<input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="الارتفاع" style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }} />
</div>
​<button
onClick={generate}
disabled={loading || uploading}
style={{
width: "100%", padding: "12px",
backgroundColor: (loading || uploading) ? "#9ca3af" : "#2563eb",
color: "#fff", border: "none", borderRadius: "8px",
fontSize: "16px", cursor: (loading || uploading) ? "not-allowed" : "pointer",
fontWeight: "bold", fontFamily: "inherit"
}}
>
{uploading ? "⏳ جاري رفع المرجع..." : loading ? "⏳ جاري التوليد..." : "🚀 توليد الصورة"}
</button>
​{imageUrl && (
<div style={{ marginTop: "20px", textAlign: "center" }}>
<img
src={imageUrl}
alt="Generated"
onLoad={() => setLoading(false)}
onError={() => { alert("خطأ في جلب الصورة، حاول مجدداً"); setLoading(false); }}
style={{ maxWidth: "100%", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
/>
<button
onClick={downloadImage}
style={{ display: "block", width: "100%", marginTop: "10px", padding: "10px 20px", backgroundColor: "#16a34a", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "500", cursor: "pointer", fontSize: "15px", fontFamily: "inherit" }}
>
⬇️ تحميل الصورة
</button>
</div>
)}
</main>
);
}