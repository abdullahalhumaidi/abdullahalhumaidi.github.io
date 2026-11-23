# عبدالله المطيري | وراء كل رسالة حكاية

ملف أعمال شخصي تفاعلي بالعربي والإنجليزي، يعرض أعمال عبدالله المطيري في التواصل الداخلي: تعاميم HTML، الفعاليات والمناسبات، تجربة الموظف، الأفكار التفاعلية، ومنشورات LinkedIn.

الرابط المستهدف بعد النشر: https://abdullahalhumaidi.github.io/

> الموقع مستقل تماما: ما يعتمد على Claude ولا على أي حساب شركة. كل الخطوط والمكتبات مجانية ومحفوظة داخل المشروع.

---

## ١. تشغيل الموقع على جهازك

**المطلوب مرة وحدة:** ثبت برنامج Node.js (الإصدار 22 أو أحدث) من nodejs.org.

بعدها افتح الطرفية (Terminal) داخل مجلد المشروع واكتب:

```bash
npm install      # مرة وحدة فقط: يثبت المكتبات
npm run dev      # يشغل الموقع للمعاينة
```

افتح الرابط اللي يطلع لك (غالبا http://localhost:5173). أي تعديل تحفظه يظهر مباشرة.

| الأمر | وش يسوي |
|---|---|
| `npm run dev` | تشغيل المعاينة أثناء التعديل |
| `npm run dev:review` | معاينة تشمل المواد اللي في `content-private` (للمراجعة فقط) |
| `npm run build` | فحص المحتوى + فحص الأكواد + بناء نسخة النشر في مجلد `dist` |
| `npm run preview` | تشغيل نسخة النشر المبنية للتأكد منها |
| `npm run check:content` | يتأكد إن كل نص له عربي وإنجليزي، وإن الملفات موجودة |

---

## ٢. وين المحتوى؟

كل اللي تحتاج تعدله في مجلد **`content/`**. ما تحتاج تلمس الأكواد.

```
content/
  site.json          ← اسمك، التواصل، الأرقام، المهارات، المسيرة
  ui/ar.json         ← كل نصوص الواجهة بالعربي
  ui/en.json         ← نفس النصوص بالإنجليزي (لازم نفس المفاتيح)
  works/<id>/        ← التعاميم (قسم "رسائل")
  events/<id>/       ← الفعاليات (قسم "قصص")
  posters/<id>/      ← الملصقات
  ideas/<id>/        ← التطبيقات التفاعلية (قسم "أفكار تجربها")
  posts/posts.json   ← منشورات LinkedIn
content-private/     ← مواد تنتظر المراجعة. لا تنرفع على GitHub أبدا
```

كل عمل له حقل `"status"`:
- `"approved"` يظهر في الموقع المنشور.
- `"pending"` ما يظهر في النشر أبدا (يظهر فقط في `npm run dev:review`).

---

## ٣. إضافة تعميم جديد

1. أنشئ مجلد باسم قصير بالإنجليزي، مثل: `content/works/ramadan-greeting/`
2. حط فيه:
   - `index.html` ملف التعميم.
   - مجلد `assets/` فيه صور التعميم، وعدل روابط الصور داخل الملف لتكون مثل `assets/hero.webp` بدل الروابط الخارجية.
   - `cover.jpg` صورة غلاف (لقطة من أعلى التعميم).
   - `meta.json` (انسخه من أي تعميم موجود وعدله):

```json
{
  "id": "ramadan-greeting",
  "status": "approved",
  "order": 10,
  "category": "internal-comms",
  "kicker": { "ar": "تهنئة", "en": "Greeting" },
  "title": { "ar": "عنوان إبداعي", "en": "Creative title" },
  "description": { "ar": "وصف قصير", "en": "Short description" },
  "role": { "ar": "دورك", "en": "Your role" },
  "format": "html",
  "file": "index.html",
  "cover": "cover.jpg"
}
```

- `category`: إما `internal-comms` (التواصل الداخلي) أو `employee-experience` (تجربة الموظف والتقدير).
- لو التعميم صورة بدل HTML: خله `"format": "image"` و `"file": "image.jpg"`.
- لو مرتبط بفعالية: أضف `"eventId": "رقم-الفعالية"`.

**قبل الإضافة راجع:** احذف أرقام الجوال والإيميلات وأسماء الموظفين الحقيقية والروابط الداخلية. التعميم يعرض داخل إطار معزول لا يشغل أي سكربت.

## ٤. إضافة فعالية جديدة

1. أنشئ `content/events/<id>/meta.json`:

```json
{
  "id": "founding-day",
  "status": "approved",
  "order": 12,
  "type": "occasion",
  "title": { "ar": "يوم التأسيس", "en": "Founding Day" },
  "description": { "ar": "...", "en": "..." },
  "role": { "ar": "التنظيم", "en": "Organized it" },
  "how": { "ar": "كيف نفذتها", "en": "How it was done" },
  "comms": { "ar": "علاقتها بالتواصل الداخلي", "en": "The internal comms angle" },
  "relatedWorks": [],
  "relatedPosts": []
}
```

- `type`: `corporate` (مؤسسية) أو `occasion` (مناسبات وأيام) أو `engagement` (تجربة الموظف).
- `description` هي "الفكرة". لدور "من الفكرة إلى التنفيذ" اكتب الدور: `{ "ar": "من الفكرة إلى التنفيذ", "en": "From concept to execution" }` وتظهر الشارة تلقائيا.
- لا تضع نفس الصورة في الفعالية وفي الملصقات.

2. للصور: حطها في نفس المجلد، وأضف `photos.json`:

```json
{ "eventId": "founding-day", "status": "approved", "photos": [{ "file": "photo-1.jpg" }] }
```

بدون صور؟ يظهر مكان مخصص مكتوب فيه "الصور تنضاف هنا لاحقا".

## ٥. إضافة منشور LinkedIn

أضف عنصر في `content/posts/posts.json`:

```json
{
  "id": "post-new",
  "status": "approved",
  "order": 7,
  "topic": { "ar": "الموضوع", "en": "Topic" },
  "excerpt": "أول سطر من المنشور…",
  "excerptLang": "ar",
  "url": "https://www.linkedin.com/feed/update/urn:li:activity:رقم-المنشور/",
  "eventId": "اختياري: رقم الفعالية لعرض صورتها"
}
```

## ٦. إضافة ملصق أو تطبيق

- **ملصق:** مجلد `content/posters/<id>/` فيه صورة التصميم و `meta.json` (`image` اسم الصورة، و`eventId` الفعالية المرتبطة).
- **تطبيق تفاعلي:** `content/ideas/<id>/` فيه `app.html` (ملف واحد مكتمل) و `cover.jpg` و `meta.json`. التطبيق يشتغل داخل إطار معزول عن الموقع.

---

## ٧. الرفع على GitHub والنشر (لما تقرر)

### أ. إنشاء المستودع
1. سجل دخول على github.com بحساب **abdullahalhumaidi**.
2. أنشئ مستودع جديد باسم **`abdullahalhumaidi.github.io`** بالضبط، واختر **Private**.
3. الطريقة الأسهل: برنامج **GitHub Desktop**. اختر File ← Add local repository ← مجلد المشروع، ثم Publish repository.
   - أو من الطرفية:
   ```bash
   git init
   git add .
   git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/abdullahalhumaidi/abdullahalhumaidi.github.io.git
   git push -u origin main
   ```
4. **لا تكتب كلمة المرور أو أي Token داخل ملفات المشروع.** GitHub Desktop أو المتصفح يتكفلون بتسجيل الدخول.

> مجلد `content-private` ومجلد `node_modules` مستبعدين تلقائيا ولن ينرفعون.

### ب. النشر (مهم: الحساب المجاني)
في الحساب المجاني، **GitHub Pages ما يشتغل مع المستودع الخاص**. لما تكون جاهز للنشر:
1. من إعدادات المستودع Settings ← General ← Change visibility ← **Public**.
2. Settings ← Pages ← Source: اختر **GitHub Actions**.
3. Actions ← "Deploy to GitHub Pages" ← **Run workflow**.
4. بعد دقيقتين تقريبا يكون الموقع على https://abdullahalhumaidi.github.io/

النشر حاليا **يدوي فقط**. لتفعيله تلقائيا مع كل رفع، اتبع الملاحظة في أعلى ملف `.github/workflows/deploy.yml`.

---

## ٨. التفاصيل الكاملة

كل شي عن التصميم والألوان والخطوط والمكونات والحركات في ملف **`PROJECT_GUIDE.md`**.
