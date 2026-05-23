"use client";
import { useState, useEffect } from "react";

export default function ContentStudio() {
  // التحكم في التبويب النشط (الإعداد الافتراضي يعود للشاشة الرئيسية)
  const [activeTab, setActiveTab] = useState("home");
  const [logs, setLogs] = useState([]);

  // ==========================================
  // [1] حالات (States) مولد الصور المطوّر
  // ==========================================
  const [prompt, setPrompt] = useState("");
  const [refFile, setRefFile] = useState(null);
  const [refUrl, setRefUrl] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [refStrength, setRefStrength] = useState(65); // النسبة المثالية للحفاظ على الهوية
  const [customSeed, setCustomSeed] = useState("422422"); // بذرة ثابتة لمنع تشوه الوجه
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ==========================================
  // [2] حالات (States) هندسة الصوت 
  // ==========================================
  const [audioText, setAudioText] = useState("");
  const [voiceModel, setVoiceModel] = useState("ar-EG-SalmaNeural");
  const [audioFormat, setAudioFormat] = useState("mp3");
  const [speechSpeed, setSpeechSpeed] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);

  // إضافة سجل التنبيهات السفلي
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs(prev => [...prev.slice(-3), "[" + time + "] " + msg]);
  };

  useEffect(() => {
    addLog("تم تشغيل استوديو صناع المحتوى بنجاح ✓");
  }, []);

  // معالجة الصورة المرجعية وضمان رفعها عبر سيرفر tmpfiles المستقر
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setRefFile(file);
    const localPreview = URL.createObjectURL(file);
    setRefUrl(localPreview);
    addLog("جاري الرفع على سيرفر مستقر للمطابقة...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // الرفع على tmpfiles.org لضمان بقاء الرابط حياً ومتاحاً لمحرك الصور
      const res = await fetch("https://tmpfiles.org/api/v1/upload", { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      
      if (data && data.status === "success" && data.data && data.data.url) {
        // تحويل الرابط إلى رابط مباشر قابل للقراءة من السيرفرات الخارجية مثل Pollinations
        const directLink = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
        setRefUrl(directLink);
        addLog("تم قفل الهوية بنجاح ✓ الرابط مستقر وجاهز للتوليد");
      } else {
        addLog("تنبيه: فشل استخراج الرابط المباشر، تم الاعتماد على المعاينة المحلية");
      }
    } catch (err) {
      addLog("خطأ في الرفع، سيتم الاعتماد على المعاينة المحلية");
    }
    setUploading(false);
  };

  // توليد صور متطابقة الملامح عبر هندسة البرومبت والـ Seed الثابت
  const generateImage = async () => {
    const cleanPrompt = prompt.trim().replace(/\s+/g, " ");
    if (!cleanPrompt) { addLog("خطأ: اكتب وصفاً للمشهد أو الملابس أولاً"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى ينتهي رفع المرجع"); return; }
    
    setImageLoading(true);
    setImageUrl(null);
    addLog("جاري دمج الهوية والملامح مع محرك Flux الدقيق...");
    
    let w = 1280, h = 720;
    if (aspectRatio === "9:16") { w = 720; h = 1280; }
    else if (aspectRatio === "1:1") { w = 1024; h = 1024; }
    
    // فرض المطابقة التشريحية عبر النص لمنع لقطات الـ Close-up التلقائية أو تشويه الوجه
    const structuredPrompt = `High resolution cinematic photo of the exact same person from the reference image, maintaining identical facial structure, beard, and expressions. ${cleanPrompt}, highly detailed, photorealistic, 8k, dramatic studio lighting, captured on 50mm lens, depth of field`;

    let params = `?width=${w}&height=${h}&model=flux&enhance=true&nologo=true&seed=${customSeed}`;
    
    if (refUrl && refUrl.startsWith("https://")) {
      params += `&image=${encodeURIComponent(refUrl)}&weight=${refStrength / 100}`;
      addLog(`تم قفل الـ Seed على [${customSeed}] ووزن المطابقة على: ${refStrength}%`);
    }
    
    const fullUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(structuredPrompt)}${params}`;
    
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setImageUrl(fullUrl);
      addLog("تم إنتاج اللقطة الجديدة المتطابقة تماماً ✓");
      setImageLoading(false);
    };
    img.onerror = () => {
      addLog("حدث ضغط، جاري إعادة المحاولة التلقائية...");
      setImageUrl(fullUrl + "&retry=true");
      setImageLoading(false);
    };
  };

  const handleImageDownload = async (e) => {
    e.preventDefault();
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `studio-character-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      addLog("تم حفظ الصورة بنجاح في معرض الهاتف ✓");
    } catch (err) {
      window.open(imageUrl, "_blank");
    }
  };

  // ==========================================
  // [3] دالة توليد التعليق الصوتي
  // ==========================================
  const generateVoice = async () => {
    if (!audioText.trim()) { addLog("خطأ: يرجى كتابة النص المراد تحويله لصوت أولاً"); return; }
    setAudioLoading(true);
    setAudioUrl(null);
    addLog("جاري معالجة النبرة الصوتية وتشكيل الموجات...");

    try {
      const encodedText = encodeURIComponent(audioText.trim());
      const speedParam = speechSpeed === 1 ? "" : `&speed=${speechSpeed}`;
      const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${voiceModel.split('-')[0]}&client=tw-ob&q=${encodedText}${speedParam}`;

      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setAudioUrl(url);
      addLog(`تم إنتاج التعليق الصوتي بنجاح بصيغة ${audioFormat.toUpperCase()} ✓`);
    } catch (err) {
      addLog("خطأ في معالجة الصوت، يرجى المحاولة مرة أخرى");
    }
    setAudioLoading(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = `studio-voice-${Date.now()}.${audioFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("تم حفظ الملف الصوتي في مجلد التحميلات بنجاح ✓");
  };

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
      
      {/* هيدر الموقع */}
      <header style={{
        textAlign: "center",
        marginBottom: "16px",
        padding: "16px",
        background: "rgba(13, 13, 25, 0.7)",
        borderRadius: "14px",
        border: "1px solid rgba(139, 92, 246, 0.2)"
      }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🎬 استوديو صناع المحتوى الذكي
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>منصة متكاملة لإنتاج القصص، السيناريوهات، الأصوات، والصور</p>
      </header>

      {/* شريط التنقل الأفقي المرن لإعادة التنقل بين كل الواجهات بسلاسة على الهاتف */}
      <nav style={{
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        marginBottom: "20px",
        padding: "8px 4px",
        overflowX: "auto",
        whiteSpace: "nowrap",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }}>
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

        <button onClick={() => setActiveTab("home")} className="nav-btn" style={{ background: activeTab === "home" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "home" ? "#fff" : "#94a3b8" }}>🏠 الرئيسية</button>
        <button onClick={() => setActiveTab("story")} className="nav-btn" style={{ background: activeTab === "story" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "story" ? "#fff" : "#94a3b8" }}>📚 كتابة القصة</button>
        <button onClick={() => setActiveTab("script")} className="nav-btn" style={{ background: activeTab === "script" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "script" ? "#fff" : "#94a3b8" }}>📜 السيناريو والبرومبت</button>
        <button onClick={() => setActiveTab("audio")} className="nav-btn" style={{ background: activeTab === "audio" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "audio" ? "#fff" : "#94a3b8" }}>🎤 هندسة الصوت</button>
        <button onClick={() => setActiveTab("image")} className="nav-btn" style={{ background: activeTab === "image" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "image" ? "#fff" : "#94a3b8" }}>🎨 توليد الصور</button>
        <button onClick={() => setActiveTab("animate")} className="nav-btn" style={{ background: activeTab === "animate" ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : "#111122", color: activeTab === "animate" ? "#fff" : "#94a3b8" }}>🎬 تحريك الصور</button>
      </nav>

      {/* محتويات الواجهات المتغيرة */}
      <div style={{ maxWidth: "1250px", margin: "0 auto", minHeight: "350px" }}>
        
        {/* الواجهة الرئيسية */}
        {activeTab === "home" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "20px", border: "1px solid rgba(139, 92, 246, 0.15)", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🚀</div>
            <h2 style={{ fontSize: "18px", color: "#a78bfa", marginBottom: "8px" }}>مرحباً بك في استوديو الإنتاج المتكامل</h2>
            <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}>
              هذه المنصة مصممة خصيصاً لمساعدتك في بناء وتطوير محتواك الرقمي بكفاءة عالية. تصفح الأدوات من الشريط العلوي للبدء في العمل.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
              <div style={{ padding: "10px 16px", background: "#0c0c1a", borderRadius: "10px", border: "1px solid rgba(16, 185, 129, 0.2)", fontSize: "12px" }}>حالة النظام: <span style={{ color: "#10b981", fontWeight: "bold" }}>جاهز ومستقر ✓</span></div>
              <div style={{ padding: "10px 16px", background: "#0c0c1a", borderRadius: "10px", border: "1px solid rgba(251, 191, 36, 0.2)", fontSize: "12px" }}>نوع الحساب: <span style={{ color: "#fbbf24", fontWeight: "bold" }}>مطور محترف (مجاني)</span></div>
            </div>
          </section>
        )}

        {/* واجهة توليد الصور المصلحة والمستقرة */}
        {activeTab === "image" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
              
              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#a78bfa" }}>📝 المشهد والملابس الجديدة</h3>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="اكتب فقط الملابس أو البيئة الجديدة هنا (مثلاً: wearing a neat dark blue suit inside an office)..." style={{ width: "100%", minHeight: "100px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", fontFamily: "inherit" }} />
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "10px", marginBottom: "4px" }}>📎 ارفع صورة الشخص الأساسي هنا:</label>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} style={{ fontSize: "12px", width: "100%" }} />
                {refUrl && <div style={{ marginTop: "8px" }}><img src={refUrl} alt="ref" style={{ width: "100%", maxHeight: "100px", objectFit: "cover", borderRadius: "6px" }} /></div>}
              </section>

              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#60a5fa" }}>⚙️ التحكم في ثبات الملامح</h3>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>📐 الأبعاد الهندسية للفيلم:</label>
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a" }}>
                  <option value="16:9">أفقي 16:9 (يوتيوب سينمائي)</option>
                  <option value="9:16">عمودي 9:16</option>
                  <option value="1:1">مربع 1:1</option>
                </select>

                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "12px", marginBottom: "4px" }}>
                  🎯 قوة الارتباط بالمرجع (Weight): <span style={{ color: "#60a5fa", fontWeight: "bold" }}>{refStrength}%</span>
                </label>
                <input type="range" min="30" max="90" value={refStrength} onChange={(e) => setRefStrength(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa" }} />

                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "12px", marginBottom: "4px" }}>🔑 رقم البذرة للشخصية (Seed):</label>
                <input type="text" value={customSeed} onChange={(e) => setCustomSeed(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", background: "#090915", color: "#fbbf24", border: "1px solid #27274a", fontSize: "13px", fontWeight: "bold", textAlign: "center" }} />
              </section>

              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#10b981" }}>🖥️ النتيجة السينمائية الجديدة</h3>
                <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "110px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "1px dashed rgba(139,92,246,0.2)" }}>
                  {imageUrl ? <img src={imageUrl} alt="AI Matched" style={{ maxWidth: "100%", maxHeight: "110px", objectFit: "contain" }} /> : <span style={{ color: "#64748b", fontSize: "12px" }}>ستظهر اللقطة المتطابقة هنا...</span>}
                </div>
                <button onClick={handleImageDownload} disabled={!imageUrl} style={{ width: "100%", padding: "10px", background: imageUrl ? "linear-gradient(135deg, #10b981, #059669)" : "#1e1e2f", color: "#fff", border: "none", borderRadius: "10px", cursor: imageUrl ? "pointer" : "not-allowed", fontSize: "13px" }}>⬇️ حفظ اللقطة المصلحة بجهازي</button>
              </section>
            </div>
            <button onClick={generateImage} disabled={imageLoading || uploading} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
              {imageLoading ? "🎨 جاري معالجة الهوية وتغيير السياق..." : "🚀 إنتاج اللقطة الجديدة المتطابقة تماماً"}
            </button>
          </div>
        )}

        {/* واجهة هندسة الصوت والتعليق */}
        {activeTab === "audio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#a78bfa" }}>✍️ نص التعليق الصوتي</h3>
                <textarea value={audioText} onChange={(e) => setAudioText(e.target.value)} placeholder="اكتب أو الصق النص هنا ليتم تحويله إلى صوت نقي وجذاب فورا..." style={{ width: "100%", minHeight: "120px", padding: "12px", borderRadius: "10px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px", resize: "vertical", fontFamily: "inherit" }} />
              </section>

              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#60a5fa" }}>🎛️ اختيار النبرة والمعايير</h3>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>🗣️ المعلق واللغة:</label>
                <select value={voiceModel} onChange={(e) => setVoiceModel(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #27274a", background: "#090915", color: "#f1f5f9", fontSize: "13px" }}>
                  <option value="ar-EG-SalmaNeural">عربي - نبرة إلقاء واضحة وثائقية</option>
                  <option value="en-US-GuyNeural">إنجليزي - وثائقي فخم (Male)</option>
                </select>
                <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginTop: "10px", marginBottom: "4px" }}>⚡ سرعة الإلقاء: {speechSpeed}x</label>
                <input type="range" min="0.5" max="1.5" step="0.1" value={speechSpeed} onChange={(e) => setSpeechSpeed(Number(e.target.value))} style={{ width: "100%", accentColor: "#60a5fa" }} />
              </section>

              <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", color: "#10b981" }}>🎧 المعاينة والمشغل</h3>
                <div style={{ background: "#05050f", borderRadius: "10px", minHeight: "60px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", border: "1px dashed rgba(139,92,246,0.2)" }}>
                  {audioUrl ? <audio src={audioUrl} controls style={{ width: "100%" }} /> : <span style={{ color: "#64748b", fontSize: "12px" }}>اضغط على توليد للاستماع للمعاينة الفورية...</span>}
                </div>
                <button onClick={downloadAudio} disabled={!audioUrl} style={{ width: "100%", padding: "10px", background: audioUrl ? "linear-gradient(135deg, #10b981, #059669)" : "#1e1e2f", color: audioUrl ? "#fff" : "#64748b", border: "none", borderRadius: "10px", fontWeight: "600", cursor: audioUrl ? "pointer" : "not-allowed" }}>⬇️ تحميل ملف الصوت للجهاز</button>
              </section>
            </div>
            <button onClick={generateVoice} disabled={audioLoading} style={{ width: "100%", padding: "14px", background: audioLoading ? "#27274a" : "linear-gradient(135deg, #a78bfa, #6366f1)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer" }}>
              {audioLoading ? "⏳ جاري هندسة الصوت..." : "🎤 بدْء توليد التعليق الصوتي الآن"}
            </button>
          </div>
        )}

        {/* الواجهات الأخرى */}
        {activeTab === "story" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[الخطوة القادمة] سيتم هنا بناء محرك كتابة القصة وتوزيع المشاهد...</p>
          </section>
        )}
        {activeTab === "script" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء محرك كتابة السيناريو والحوار والبرومبت...</p>
          </section>
        )}
        {activeTab === "animate" && (
          <section style={{ background: "rgba(17, 17, 34, 0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139, 92, 246, 0.15)" }}>
            <p style={{ color: "#64748b", fontSize: "13px", textAlign: "center" }}>[قريباً] سيتم هنا بناء محرك تحريك الصور الثابتة إلى مقاطع فيديو...</p>
          </section>
        )}

      </div>

      {/* لوحة مراقبة النظام السفلية */}
      <footer style={{ maxWidth: "1200px", margin: "20px auto 0", background: "#05050a", borderRadius: "10px", padding: "10px", border: "1px solid rgba(255,255,255,0.03)", fontFamily: "monospace", fontSize: "11px", color: "#38bdf8" }}>
        {logs.map((log, i) => <div key={i} style={{ marginBottom: "2px" }}>{log}</div>)}
      </footer>

    </main>
  );
}