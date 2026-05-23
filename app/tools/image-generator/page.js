  // توليد لقطات سينمائية عبر دمج الرابط مباشرة داخل نص الوصف (نفس اقتراحك العبقري)
  const generateImage = async () => {
    const cleanPrompt = prompt.trim().replace(/\s+/g, " ");
    if (!cleanPrompt) { addLog("خطأ: اكتب وصفاً للمشهد أو الملابس أولاً"); return; }
    if (uploading) { addLog("يرجى الانتظار حتى ينتهي رفع المرجع"); return; }
    
    setImageLoading(true);
    setImageUrl(null);
    addLog("جاري دمج الرابط المباشر مع الوصف لمحرك Flux...");
    
    let w = 1280, h = 720;
    if (aspectRatio === "9:16") { w = 720; h = 1280; }
    else if (aspectRatio === "1:1") { w = 1024; h = 1024; }
    
    // 1. هنا نطبق فكرتك: ندمج رابط الصورة المرجعية مباشرة في مقدمة النص كإشارة (+) للسيرفر
    let finalPromptText = "";
    if (refUrl && refUrl.startsWith("https://")) {
      // وضع رابط الصورة المباشر في أول النص لكي يجبر المحرك على قراءته واعتماده كمرجع تشريحي
      finalPromptText = `${refUrl} High resolution cinematic photo of the exact same person from this image link, maintaining identical facial structure, features, and expressions. ${cleanPrompt}, highly detailed, photorealistic, 8k, dramatic studio lighting`;
    } else {
      finalPromptText = `High resolution cinematic photo. ${cleanPrompt}, highly detailed, photorealistic, 8k`;
    }

    // 2. إرسال الرابط المدمج بالكامل للسيرفر مع تثبيت الـ Seed لمنع العشوائية
    let params = `?width=${w}&height=${h}&model=flux&enhance=true&nologo=true&seed=${customSeed}`;
    
    const fullUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPromptText)}${params}`;
    
    const img = new Image();
    img.src = fullUrl;
    img.onload = () => {
      setImageUrl(fullUrl);
      addLog("تم إنتاج اللقطة الجديدة بالاعتماد على المرجع المدمج ✓");
      setImageLoading(false);
    };
    img.onerror = () => {
      addLog("حدث ضغط، جاري إعادة المحاولة التلقائية...");
      setImageUrl(fullUrl + "&retry=true");
      setImageLoading(false);
    };
  };