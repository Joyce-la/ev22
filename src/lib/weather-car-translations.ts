export const WEATHER_BY_LANG: Record<
  string,
  { sunny: string; cloudy: string; rainy: string; snowy: string; stormy: string }
> = {
  hi: { sunny: "धूप", cloudy: "बादल", rainy: "बारिश", snowy: "बर्फ़", stormy: "तूफ़ान" },
  ar: { sunny: "مشمس", cloudy: "غائم", rainy: "ممطر", snowy: "ثلجي", stormy: "عاصف" },
  ru: { sunny: "Солнечно", cloudy: "Облачно", rainy: "Дождь", snowy: "Снег", stormy: "Гроза" },
  de: { sunny: "Sonnig", cloudy: "Wolkig", rainy: "Regnerisch", snowy: "Schnee", stormy: "Stürmisch" },
  fr: { sunny: "Ensoleillé", cloudy: "Nuageux", rainy: "Pluvieux", snowy: "Neige", stormy: "Orageux" },
  es: { sunny: "Soleado", cloudy: "Nublado", rainy: "Lluvioso", snowy: "Nevado", stormy: "Tormentoso" },
  it: { sunny: "Soleggiato", cloudy: "Nuvoloso", rainy: "Piovoso", snowy: "Nevoso", stormy: "Temporale" },
  pt: { sunny: "Ensolarado", cloudy: "Nublado", rainy: "Chuvoso", snowy: "Nevando", stormy: "Tempestuoso" },
  tr: { sunny: "Güneşli", cloudy: "Bulutlu", rainy: "Yağmurlu", snowy: "Karlı", stormy: "Fırtınalı" },
  nl: { sunny: "Zonnig", cloudy: "Bewolkt", rainy: "Regen", snowy: "Sneeuw", stormy: "Storm" },
  sv: { sunny: "Soligt", cloudy: "Molnigt", rainy: "Regn", snowy: "Snö", stormy: "Storm" },
  pl: { sunny: "Słonecznie", cloudy: "Pochmurno", rainy: "Deszcz", snowy: "Śnieg", stormy: "Burza" },
  uk: { sunny: "Сонячно", cloudy: "Хмарно", rainy: "Дощ", snowy: "Сніг", stormy: "Буря" },
  fa: { sunny: "آفتابی", cloudy: "ابری", rainy: "بارانی", snowy: "برفی", stormy: "طوفانی" },
  bn: { sunny: "রৌদ্রোজ্জ্বল", cloudy: "মেঘলা", rainy: "বৃষ্টি", snowy: "তুষার", stormy: "ঝড়" },
  ur: { sunny: "دھوپ", cloudy: "ابر آلود", rainy: "بارش", snowy: "برف", stormy: "طوفان" },
  fil: { sunny: "Maaraw", cloudy: "Maulap", rainy: "Maulan", snowy: "Niyebe", stormy: "Bagyo" },
};

export const CAR_BY_LANG: Record<
  string,
  { drivingModes: string; adaptiveCruise: string; autoParking: string; laneCentering: string }
> = {
  ar: {
    drivingModes: "أوضاع القيادة",
    adaptiveCruise: "مثبّت سرعة متكيّف",
    autoParking: "ركن تلقائي",
    laneCentering: "تمركز المسار",
  },
  ru: {
    drivingModes: "Режимы вождения",
    adaptiveCruise: "Адаптивный круиз-контроль",
    autoParking: "Автопарковка",
    laneCentering: "Удержание в полосе",
  },
  de: {
    drivingModes: "Fahrmodi",
    adaptiveCruise: "Adaptiver Tempomat",
    autoParking: "Automatisches Parken",
    laneCentering: "Spurzentrierung",
  },
  fr: {
    drivingModes: "Modes de conduite",
    adaptiveCruise: "Régulateur adaptatif",
    autoParking: "Stationnement auto",
    laneCentering: "Centrage de voie",
  },
  es: {
    drivingModes: "Modos de conducción",
    adaptiveCruise: "Control crucero adaptativo",
    autoParking: "Estacionamiento automático",
    laneCentering: "Centrado de carril",
  },
  it: {
    drivingModes: "Modalità di guida",
    adaptiveCruise: "Cruise control adattivo",
    autoParking: "Parcheggio automatico",
    laneCentering: "Centraggio corsia",
  },
  pt: {
    drivingModes: "Modos de condução",
    adaptiveCruise: "Cruzeiro adaptativo",
    autoParking: "Estacionamento automático",
    laneCentering: "Centralização de faixa",
  },
  tr: {
    drivingModes: "Sürüş Modları",
    adaptiveCruise: "Adaptif hız sabitleyici",
    autoParking: "Otomatik park",
    laneCentering: "Şeritte ortalama",
  },
  nl: {
    drivingModes: "Rijmodi",
    adaptiveCruise: "Adaptieve cruisecontrol",
    autoParking: "Automatisch parkeren",
    laneCentering: "Rijstrookcentrering",
  },
  sv: {
    drivingModes: "Körlägen",
    adaptiveCruise: "Adaptiv farthållare",
    autoParking: "Autoparkering",
    laneCentering: "Filcentrering",
  },
  pl: {
    drivingModes: "Tryby jazdy",
    adaptiveCruise: "Adaptacyjny tempomat",
    autoParking: "Auto-parkowanie",
    laneCentering: "Utrzymanie pasa",
  },
  uk: {
    drivingModes: "Режими руху",
    adaptiveCruise: "Адаптивний круїз",
    autoParking: "Автопаркування",
    laneCentering: "Центрування смуги",
  },
  fa: {
    drivingModes: "حالت‌های رانندگی",
    adaptiveCruise: "کروز تطبیقی",
    autoParking: "پارک خودکار",
    laneCentering: "مرکز نگه‌داشتن خط",
  },
  bn: {
    drivingModes: "ড্রাইভিং মোড",
    adaptiveCruise: "অ্যাডাপ্টিভ ক্রুজ",
    autoParking: "অটো-পার্কিং",
    laneCentering: "লেন সেন্টারিং",
  },
  ur: {
    drivingModes: "ڈرائیونگ موڈز",
    adaptiveCruise: "ایڈاپٹو کروز",
    autoParking: "آٹو پارکنگ",
    laneCentering: "لین سینٹرنگ",
  },
  fil: {
    drivingModes: "Mga mode ng pagmamaneho",
    adaptiveCruise: "Adaptibong cruise control",
    autoParking: "Awtomatikong pag-park",
    laneCentering: "Pananatili sa gitna ng linya",
  },
};

/** `search.quick*` + optional `topbar.searchBar` for locales that only had partial `search` merged from English. */
export const SEARCH_OVERLAY: Record<
  string,
  {
    quickAutoParking: string;
    quickPhoneConnect: string;
    quickAdaptiveCruise: string;
    quickLaneCentering: string;
    quickNavigation: string;
    topbarSearchBar?: string;
  }
> = {
  th: {
    quickAutoParking: "จอดอัตโนมัติ",
    quickPhoneConnect: "เชื่อมต่อโทรศัพท์อัตโนมัติ",
    quickAdaptiveCruise: "ครูซคอนโทรลแบบปรับตาม",
    quickLaneCentering: "คุมรถให้อยู่กลางเลน",
    quickNavigation: "นำทาง",
  },
  vi: {
    quickAutoParking: "Đỗ xe tự động",
    quickPhoneConnect: "Tự động kết nối điện thoại",
    quickAdaptiveCruise: "Ga tự động thích ứng",
    quickLaneCentering: "Giữ làn",
    quickNavigation: "Dẫn đường",
  },
  ja: {
    quickAutoParking: "自動駐車",
    quickPhoneConnect: "スマホ自動接続",
    quickAdaptiveCruise: "アダプティブクルーズ",
    quickLaneCentering: "レーンセンタリング",
    quickNavigation: "ナビゲーション",
  },
  ko: {
    quickAutoParking: "자동 주차",
    quickPhoneConnect: "휴대폰 자동 연결",
    quickAdaptiveCruise: "어댑티브 크루즈",
    quickLaneCentering: "차로 중앙 유지",
    quickNavigation: "내비게이션",
  },
  hi: {
    quickAutoParking: "ऑटो पार्किंग",
    quickPhoneConnect: "फ़ोन ऑटो-कनेक्ट",
    quickAdaptiveCruise: "एडैप्टिव क्रूज़",
    quickLaneCentering: "लेन सेंटरिंग",
    quickNavigation: "नेविगेशन",
  },
  ar: {
    quickAutoParking: "ركن تلقائي",
    quickPhoneConnect: "اتصال الهاتف تلقائياً",
    quickAdaptiveCruise: "مثبّت سرعة متكيّف",
    quickLaneCentering: "تمركز المسار",
    quickNavigation: "ملاحة",
  },
  ru: {
    quickAutoParking: "Автопарковка",
    quickPhoneConnect: "Автоподключение телефона",
    quickAdaptiveCruise: "Адаптивный круиз-контроль",
    quickLaneCentering: "Удержание в полосе",
    quickNavigation: "Навигация",
  },
  fil: {
    quickAutoParking: "Awtomatikong pag-park",
    quickPhoneConnect: "Awtomatikong koneksyon ng telepono",
    quickAdaptiveCruise: "Adaptibong cruise control",
    quickLaneCentering: "Pananatili sa gitna ng linya",
    quickNavigation: "Nabigasyon",
    topbarSearchBar: "Bar ng paghahanap",
  },
  de: {
    quickAutoParking: "Autoparken",
    quickPhoneConnect: "Telefon automatisch verbinden",
    quickAdaptiveCruise: "Adaptiver Tempomat",
    quickLaneCentering: "Spurzentrierung",
    quickNavigation: "Navigation",
  },
  fr: {
    quickAutoParking: "Stationnement auto",
    quickPhoneConnect: "Connexion auto du téléphone",
    quickAdaptiveCruise: "Régulateur adaptatif",
    quickLaneCentering: "Centrage de voie",
    quickNavigation: "Navigation",
  },
  it: {
    quickAutoParking: "Parcheggio automatico",
    quickPhoneConnect: "Connessione automatica telefono",
    quickAdaptiveCruise: "Cruise control adattivo",
    quickLaneCentering: "Centraggio corsia",
    quickNavigation: "Navigazione",
  },
  pt: {
    quickAutoParking: "Estacionamento automático",
    quickPhoneConnect: "Conexão automática do telefone",
    quickAdaptiveCruise: "Cruzeiro adaptativo",
    quickLaneCentering: "Centralização de faixa",
    quickNavigation: "Navegação",
  },
  tr: {
    quickAutoParking: "Otomatik park",
    quickPhoneConnect: "Telefon otomatik bağlantı",
    quickAdaptiveCruise: "Adaptif hız sabitleyici",
    quickLaneCentering: "Şeritte ortalama",
    quickNavigation: "Navigasyon",
  },
  nl: {
    quickAutoParking: "Automatisch parkeren",
    quickPhoneConnect: "Telefoon automatisch verbinden",
    quickAdaptiveCruise: "Adaptieve cruisecontrol",
    quickLaneCentering: "Rijstrookcentrering",
    quickNavigation: "Navigatie",
  },
  sv: {
    quickAutoParking: "Autoparkering",
    quickPhoneConnect: "Telefon autoanslutning",
    quickAdaptiveCruise: "Adaptiv farthållare",
    quickLaneCentering: "Filcentrering",
    quickNavigation: "Navigation",
  },
  pl: {
    quickAutoParking: "Auto-parkowanie",
    quickPhoneConnect: "Automatyczne łączenie telefonu",
    quickAdaptiveCruise: "Adaptacyjny tempomat",
    quickLaneCentering: "Utrzymanie pasa",
    quickNavigation: "Nawigacja",
  },
  uk: {
    quickAutoParking: "Автопаркування",
    quickPhoneConnect: "Автопідключення телефону",
    quickAdaptiveCruise: "Адаптивний круїз",
    quickLaneCentering: "Центрування смуги",
    quickNavigation: "Навігація",
  },
  fa: {
    quickAutoParking: "پارک خودکار",
    quickPhoneConnect: "اتصال خودکار تلفن",
    quickAdaptiveCruise: "کروز تطبیقی",
    quickLaneCentering: "مرکز نگه‌داشتن خط",
    quickNavigation: "مسیریابی",
  },
  bn: {
    quickAutoParking: "অটো পার্কিং",
    quickPhoneConnect: "ফোন অটো-কানেক্ট",
    quickAdaptiveCruise: "অ্যাডাপ্টিভ ক্রুজ",
    quickLaneCentering: "লেন সেন্টারিং",
    quickNavigation: "ন্যাভিগেশন",
  },
  ur: {
    quickAutoParking: "آٹو پارکنگ",
    quickPhoneConnect: "فون آٹو کنیکٹ",
    quickAdaptiveCruise: "ایڈاپٹو کروز",
    quickLaneCentering: "لین سینٹرنگ",
    quickNavigation: "نیویگیشن",
  },
};

export function applyWeatherCarTranslations(resources: Record<string, { translation: Record<string, any> }>) {
  for (const [lng, w] of Object.entries(WEATHER_BY_LANG)) {
    const tr = resources[lng]?.translation;
    if (!tr) continue;
    tr.weather = { ...(tr.weather ?? {}), ...structuredClone(w) };
  }

  for (const [lng, car] of Object.entries(CAR_BY_LANG)) {
    const tr = resources[lng]?.translation;
    if (!tr) continue;
    tr.car = { ...(tr.car ?? {}), ...structuredClone(car) };
  }

  for (const [lng, s] of Object.entries(SEARCH_OVERLAY)) {
    const tr = resources[lng]?.translation;
    if (!tr) continue;
    const { topbarSearchBar, ...searchQuicks } = s;
    tr.search = { ...(tr.search ?? {}), ...structuredClone(searchQuicks) };
    if (topbarSearchBar) {
      tr.topbar = { ...(tr.topbar ?? {}), searchBar: topbarSearchBar };
    }
  }
}

