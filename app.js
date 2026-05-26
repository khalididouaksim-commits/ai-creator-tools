// محرك لوحة تحكم استوديو صناع المحتوى الذكي
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 تم تشغيل استوديو المحتوى بنجاح محلياً مئة بالمئة!");
  
  // ميزة اختيارية: إضافة تأثير حركي خفيف عند الضغط على كروت الأدوات من الهاتف
  const toolCards = document.querySelectorAll('.tool-card');
  
  toolCards.forEach(card => {
    card.addEventListener('click', () => {
      // إضافة اهتزاز خفيف جداً إذا كان الهاتف يدعم ذلك لتعزيز تجربة المستخدم
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  });
});