// ملف التحكم الرئيسي لربط وقراءة بيانات المنصة الذكية
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 تم تشغيل استوديو المحتوى الذكي بنجاح والأدوات جاهزة للعمل!");
  
  // دالة اختبارية للتأكد من ربط ملفات المكونات والبيانات في الخلفية
  initStudio();
});

function initStudio() {
  // مستقبلاً سنستخدم دالة fetch() هنا لجلب البيانات ديناميكياً من مجلد data/ داخل الأدوات
  const paths = {
    genres: '/data/genres.json',
    styles: '/data/styles.json',
    emotions: '/data/emotions.json'
  };
  
  console.log("📁 مسارات البيانات المحملة برمجياً:", paths);
}