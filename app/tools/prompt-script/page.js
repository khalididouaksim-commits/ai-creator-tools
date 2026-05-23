"use client";
import { useState } from "react";

export default function PromptScript() {
  const [logs, setLogs] = useState([]);
  const [topic, setTopic] = useState("richard-byrd"); // موضوع الفيديو التاريخي
  const [videoTone, setVideoTone] = useState("horror"); // نبرة الغموض النفسي
  const [customDetails, setCustomDetails] = useState("");
  
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString("ar-EG", { hour12: false });
    setLogs((prev) => [...prev.slice(-2), "[" + time + "] " + msg]);
  };
  
  // المواضيع الجاهزة لقناتك (The Preserved Archive)
  const topics = {
    "richard-byrd": {
      title: "سر رحلة الأدميرال ريتشارد بيرد إلى جوف الأرض",
      scene1: "لقطة سينمائية عريضة 16:9، طائرة قديمة من الأربعينات تخترق عاصفة ثلجية شرسة فوق القطب الجنوبي، الضباب يغطي كل شيء.",
      scene2: "لقطة قريبة Close-up، الأدميرال ريتشارد بيرد بملامح مصدومة وعينين حادتين ينظر إلى عدادات الطائرة التي تدور بشكل جنوني.",
      scene3: "فتحة أرضية ضخمة غامضة وسط الجليد ينبعث منها ضوء دافئ غريب، لقطة من الأعلى تكشف المستور."
    },
    "dyatlov": {
      title: "حادثة ممر دياتلوف - الليلة الأخيرة",
      scene1: "مجموعة من المستكشفين الشباب ينصبون خيمة ممزقة وسط عاصفة جليدية مرعبة على جبال الأورال، تواجد ظلال غامضة.",
      scene2: "لقطة قريبة داخل الخيمة، ملامح الرعب النفسي على وجوههم وهم يستمعون لصوت غريب يقترب من الخارج.",
      scene3: "آثار أقدام حافية في الثلج تمتد إلى المجهول وسط غابة صنوبر مظلمة ومليئة بالضباب التام."
    }
  };
  
  const tones = {
    "horror": "أجواء رعب نفسي، ظلال حادة، إضاءة كشاف خافتة، ألوان باردة desaturated cyan.",
    "mystery": "أجواء وثائقية غامضة، أرشيف قديم، إضاءة دافئة مع غبار متطاير فالجو، ألوان سيبيا كلاسيكية."
  };
  
  // بناء السيناريو الكامل
  const currentTopic = topics[topic] || topics["richard-byrd"];
  const currentTone = tones[videoTone];
  
  const fullScript = `🎬 عنوان الفيديو: ${currentTopic.title}
🎭 النمط الإخراجي: ${currentTone}
💡 التفاصيل الإضافية: ${customDetails || "لا توجد"}

--------------------------------------------------
🎥 [المشهد الأول - البداية]:
📌 الوصف النصي للتوليد (Prompt):
Cinematic 16:9 wide shot, ${currentTopic.scene1} ${currentTone} photorealistic, 8k, highly detailed, historical video style.

--------------------------------------------------
🎥 [المشهد الثاني - العقدة]:
📌 الوصف النصي للتوليد (Prompt):
Cinematic close-up portrait, 50mm lens, ${currentTopic.scene2} ${currentTone} hyper-realistic skin textures, dramatic shadows.

--------------------------------------------------
🎥 [المشهد الثالث - النهاية/الغموض]:
📌 الوصف النصي للتوليد (Prompt):
Low angle dramatic shot, ${currentTopic.scene3} ${currentTone} mysterious atmospheric glow, dark masterpiece.`;
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullScript);
      addLog("تم نسخ السيناريو الكامل والمشاهد إلى الحافظة ✓");
    } catch (err) {
      addLog("فشل النسخ التلقائي، انسخه يدوياً");
    }
  };
  
  return (
    <div style={{ padding: "12px", background: "rgba(17,17,34,0.2)", borderRadius: "14px", direction: "rtl", color: "#f1f5f9" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "16px" }}>
          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#a78bfa" }}>🎬 إعدادات قصة الفيديو</h3>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>📁 اختر القضية أو الغموض التاريخي:</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "13px", marginBottom: "12px" }}>
              <option value="richard-byrd">❄️ لغز الأدميرال ريتشارد بيرد (جوف الأرض)</option>
              <option value="dyatlov">🏔️ حادثة ممر دياتلوف (رعب جبال الأورال)</option>
            </select>

            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}>👁️ نبرة الإخراج النفسي:</label>
            <select value={videoTone} onChange={(e) => setVideoTone(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "#090915", color: "#f1f5f9", border: "1px solid #27274a", fontSize: "13px" }}>
              <option value="horror">👻 رعب نفسي وغموض مظلم (Psychological Horror)</option>
              <option value="mystery">🕵️ أرشيف وثائقي كلاسيكي (Historical Mystery)</option>
            </select>
          </section>

          <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(139,92,246,0.15)" }}>
            <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px" }}>✍️ أفكار أو حوارات باغي تزيدها فالسيناريو:</label>
            <textarea value={customDetails} onChange={(e) => setCustomDetails(e.target.value)} placeholder="مثال: إضافة مشهد كشاف يدوي يتحرك، أو حوار غامض عن الكائنات..." style={{ width: "100%", minHeight: "100px", padding: "10px", borderRadius: "8px", background: "#090915", color: "#fbbf24", border: "1px solid #27274a", fontSize: "13px" }} />
          </section>
        </div>

        <section style={{ background: "rgba(17,17,34,0.6)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(16,185,129,0.2)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: "14px", color: "#10b981" }}>📋 السيناريو والمشاهد الجاهزة للصق الفوري:</h3>
          <pre style={{ background: "#05050f", padding: "14px", borderRadius: "10px", border: "1px solid #1e1e38", fontSize: "12px", color: "#38bdf8", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: "200px", overflowY: "auto", textAlign: "right" }}>{fullScript}</pre>
          <button onClick={handleCopy} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "13px", marginTop: "12px" }}>📋 إنسخ السيناريو والمشاهد كاملة</button>
        </section>

      </div>
    </div>
  );
}