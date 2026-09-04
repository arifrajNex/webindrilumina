export type SupportedLanguageCode =
  | 'id'
  | 'en'
  | 'ar'
  | 'zh'
  | 'ja'
  | 'de'
  | 'fr'
  | 'ru';

export interface LanguageOption {
  code: SupportedLanguageCode;
  label: string; // Indonesia, Inggris, Arab, China, Jepang, Jerman, Perancis, Rusia
  nativeName: string;
  flag: string;
  speechCode: string;
  dir: 'ltr' | 'rtl';
}

export const NAV_LANGUAGES: LanguageOption[] = [
  {
    code: 'id',
    label: 'Indonesia',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    speechCode: 'id-ID',
    dir: 'ltr',
  },
  {
    code: 'en',
    label: 'Inggris',
    nativeName: 'English',
    flag: '🇬🇧',
    speechCode: 'en-US',
    dir: 'ltr',
  },
  {
    code: 'ar',
    label: 'Arab',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speechCode: 'ar-SA',
    dir: 'rtl',
  },
  {
    code: 'zh',
    label: 'China',
    nativeName: '中文 (Mandarin)',
    flag: '🇨🇳',
    speechCode: 'zh-CN',
    dir: 'ltr',
  },
  {
    code: 'ja',
    label: 'Jepang',
    nativeName: '日本語',
    flag: '🇯🇵',
    speechCode: 'ja-JP',
    dir: 'ltr',
  },
  {
    code: 'de',
    label: 'Jerman',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    dir: 'ltr',
  },
  {
    code: 'fr',
    label: 'Perancis',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    dir: 'ltr',
  },
  {
    code: 'ru',
    label: 'Rusia',
    nativeName: 'Русский',
    flag: '🇷🇺',
    speechCode: 'ru-RU',
    dir: 'ltr',
  },
];

export interface SiteTranslations {
  nav: {
    paket: string;
    jadwal: string;
    keunggulan: string;
    profil: string;
    galeri: string;
    poster: string;
    testimoni: string;
    konsultasi: string;
    free: string;
  };
  hero: {
    tagline: string;
    subtext: string;
    btnVoice: string;
    btnPackages: string;
  };
  chatbot: {
    greeting: string;
    title: string;
    status: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguageCode, SiteTranslations> = {
  id: {
    nav: {
      paket: 'Paket & Jadwal',
      jadwal: 'Jadwal Desember',
      keunggulan: 'Keunggulan',
      profil: 'Profil Leader',
      galeri: 'Galeri',
      poster: 'Poster & Brosur',
      testimoni: 'Testimoni',
      konsultasi: 'Konsultasi',
      free: 'Free',
    },
    hero: {
      tagline: 'Antara Anda & Baitullah',
      subtext:
        'Menyajikan pelayanan umroh dan haji plus dengan mengedepankan kualitas, kenyamanan hotel bintang 5, serta kepuasan jamaah dalam menjelajahi keindahan peradaban dunia.',
      btnVoice: 'Konsultasi CS Ka Lila',
      btnPackages: 'Lihat Paket & Jadwal',
    },
    chatbot: {
      greeting:
        'Assalamualaikum Ka.. Aku Ka Lila. Asisten AI Cerdas resmi Arminareka. Ada yang bisa Lila bantu untuk rencana ibadah suci Kakak hari ini?',
      title: 'Ka Lila AI Voice Consultant',
      status: 'Online • Siap Melayani',
    },
  },
  en: {
    nav: {
      paket: 'Packages & Schedule',
      jadwal: 'December Schedule',
      keunggulan: 'Why Choose Us',
      profil: 'Leader Profile',
      galeri: 'Gallery',
      poster: 'Brochures',
      testimoni: 'Testimonials',
      konsultasi: 'Consultation',
      free: 'Free',
    },
    hero: {
      tagline: 'Connecting You to Baitullah',
      subtext:
        'Offering premium Umrah and VIP Hajj services with unmatched quality, 5-star courtyard hotel comfort, and utmost satisfaction on your spiritual journey.',
      btnVoice: 'Consult Ka Lila AI',
      btnPackages: 'View Packages & Dates',
    },
    chatbot: {
      greeting:
        'Hello and welcome! Assalamualaikum Ka.. I am Ka Lila, official AI consultant of Arminareka Perdana. How may I assist you with your blessed Umrah or Hajj plans today?',
      title: 'Ka Lila AI Voice Consultant',
      status: 'Online • Ready to Assist',
    },
  },
  ar: {
    nav: {
      paket: 'الباقات والجدول',
      jadwal: 'جدول ديسمبر',
      keunggulan: 'المميزات والخدمات',
      profil: 'ملف القائد',
      galeri: 'معرض الصور',
      poster: 'الملصقات والكتيبات',
      testimoni: 'شهادات الحجاج',
      konsultasi: 'استشارة',
      free: 'مجاناً',
    },
    hero: {
      tagline: 'بينكم وبين بيت الله الحرام',
      subtext:
        'تقديم أرقى خدمات العمرة والحج الخاص بفنادق 5 نجوم مطلة على ساحات الحرمين الشريفين، لتحقيق أقصى درجات الراحة والطمأنينة لضيوف الرحمن.',
      btnVoice: 'استشارة الذكاء الاصطناعي كاليلا',
      btnPackages: 'عرض الباقات والمواعيد',
    },
    chatbot: {
      greeting:
        'أهلاً ومرحباً بكم، السلام عليكم Ka.. أنا كا ليلا، المستشارة الذكية الرسمية لشركة أرميناريكا برادانا. كيف يمكنني مساعدتكم في رحلتكم الإيمانية اليوم؟',
      title: 'المستشارة الذكية كا ليلا',
      status: 'متصل • في خدمتكم دائماً',
    },
  },
  zh: {
    nav: {
      paket: '套餐与日程',
      jadwal: '十二月日程',
      keunggulan: '核心优势',
      profil: '导师团队',
      galeri: '圣地相册',
      poster: '海报与手册',
      testimoni: '客户评价',
      konsultasi: '专业咨询',
      free: '免费',
    },
    hero: {
      tagline: '连接您与圣城麦加',
      subtext:
        '提供高品质尊贵副朝与特约朝觐服务，尊享五星级酒店住宿与圣寺庭院黄金距离，让每位穆斯林朝圣之旅更加安心圆满。',
      btnVoice: 'Ka Lila AI 语音客服',
      btnPackages: '浏览朝觐套餐与日程',
    },
    chatbot: {
      greeting:
        '您好，真主赐福！Assalamualaikum Ka.. 我是 Ka Lila，Arminareka 官方智能客服顾问。请问今天有什么我可以为您和家人的朝圣行程提供协助吗？',
      title: 'Ka Lila AI 智能顾问',
      status: '在线 • 随时为您服务',
    },
  },
  ja: {
    nav: {
      paket: 'パッケージ・日程',
      jadwal: '12月スケジュール',
      keunggulan: '当社の強み',
      profil: 'リーダー紹介',
      galeri: 'ギャラリー',
      poster: '公式ポスター・案内',
      testimoni: 'お客様の声',
      konsultasi: 'ご相談',
      free: '無料',
    },
    hero: {
      tagline: 'あなたと聖地バイトゥッラーを結ぶ',
      subtext:
        '5つ星ホテルの最高級の快適さと巡礼者の安心・満足を最優先にした、高品質なウムラおよび特別ハッジの巡礼サポートをお届けします。',
      btnVoice: 'AI相談員 Ka Lila に聞く',
      btnPackages: 'パッケージと日程を見る',
    },
    chatbot: {
      greeting:
        'ようこそ！アッサラームアライクム Ka.. 私は Arminareka 公式AIアドバイザーの Ka Lila です。聖地巡礼のご計画について、何かお手伝いできることはありますか？',
      title: 'Ka Lila AI 音声コンサルタント',
      status: 'オンライン • ご案内可能',
    },
  },
  de: {
    nav: {
      paket: 'Pakete & Termine',
      jadwal: 'Dezember-Termine',
      keunggulan: 'Unsere Vorteile',
      profil: 'Leiter-Profil',
      galeri: 'Fotogalerie',
      poster: 'Broschüren',
      testimoni: 'Erfahrungsberichte',
      konsultasi: 'Beratung',
      free: 'Gratis',
    },
    hero: {
      tagline: 'Ihre Brücke nach Baitullah',
      subtext:
        'Erstklassige Umrah- und VIP-Haddsch-Dienste mit 5-Sterne-Hotelkomfort in erster Reihe und vollendeter Zufriedenheit für alle Pilger.',
      btnVoice: 'Ka Lila AI Beraterin',
      btnPackages: 'Pakete & Termine ansehen',
    },
    chatbot: {
      greeting:
        'Guten Tag und herzlich willkommen! Assalamualaikum Ka.. Ich bin Ka Lila, die offizielle KI-Beraterin von Arminareka Perdana. Wie darf ich Ihnen bei Ihrer Pilgerreise helfen?',
      title: 'Ka Lila AI Sprachberaterin',
      status: 'Online • Jederzeit bereit',
    },
  },
  fr: {
    nav: {
      paket: 'Forfaits & Dates',
      jadwal: 'Calendrier Décembre',
      keunggulan: 'Nos Atouts',
      profil: 'Profil du Leader',
      galeri: 'Galerie Photos',
      poster: 'Affiches & Brochures',
      testimoni: 'Témoignages',
      konsultasi: 'Conseil',
      free: 'Gratuit',
    },
    hero: {
      tagline: 'Entre Vous et la Maison Sacrée',
      subtext:
        'Offrant des services d’excellence pour la Omra et le Hajj VIP, alliant le confort d’hôtels 5 étoiles face aux cours sacrées et une sérénité spirituelle absolue.',
      btnVoice: 'Conseillère IA Ka Lila',
      btnPackages: 'Voir Forfaits & Dates',
    },
    chatbot: {
      greeting:
        'Bonjour et bienvenue ! Assalamualaikum Ka.. Je suis Ka Lila, conseillère IA officielle d’Arminareka Perdana. Que puis-je faire pour vous accompagner dans votre noble pèlerinage ?',
      title: 'Conseillère Vocale IA Ka Lila',
      status: 'En ligne • À votre service',
    },
  },
  ru: {
    nav: {
      paket: 'Пакеты и даты',
      jadwal: 'Расписание на декабрь',
      keunggulan: 'Преимущества',
      profil: 'Профиль лидера',
      galeri: 'Галерея',
      poster: 'Буклеты и постеры',
      testimoni: 'Отзывы паломников',
      konsultasi: 'Консультация',
      free: 'Бесплатно',
    },
    hero: {
      tagline: 'Мост между вами и Святыней',
      subtext:
        'Премиальное обслуживание программ Умры и VIP-Хаджа с проживанием в 5-звездочных отелях первой линии и всесторонней поддержкой паломников.',
      btnVoice: 'ИИ-консультант Ka Lila',
      btnPackages: 'Смотреть пакеты и даты',
    },
    chatbot: {
      greeting:
        'Здравствуйте и добро пожаловать! Assalamualaikum Ka.. Я Ka Lila, официальный ИИ-консультант компании Arminareka Perdana. Чем я могу помочь вам в планировании священного паломничества?',
      title: 'Голосовой ИИ-консультант Ka Lila',
      status: 'В сети • Готова помочь',
    },
  },
};
