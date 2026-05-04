/**
 * Full user-manual body per display language. Applied after fillMissing so
 * `settings.manual` is never taken from English for these locales.
 */
export type UserManualBundle = {
  home: { title: string; points: string[] };
  media: { title: string; points: string[] };
  brightness: { title: string; points: string[] };
  navigation: { title: string; points: string[] };
  phone: { title: string; points: string[] };
};

export const USER_MANUAL_BY_LANG: Record<string, UserManualBundle> = {
  id: {
    home: {
      title: "Dasbor beranda",
      points: [
        "Kolom kiri menampilkan lalu lintas atau media tergantung layar.",
        "Kolom tengah menampilkan peta dan kontrol kecerahan.",
        "Kolom kanan menampilkan gigi transmisi, level baterai, dan cuaca.",
      ],
    },
    media: {
      title: "Media dan musik",
      points: [
        "Ketuk kartu musik untuk membuka pemutar dan kontrol pemutaran.",
        "Gunakan main/jeda dan lewati untuk mengganti lagu.",
        "Papan ketik: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R mengganti gigi saat berkendara.",
        "Buka halaman ini di Chrome untuk pintasan papan ketik dan dukungan kecerahan terbaik.",
        "Kartu musik ringkas sejajar dengan kartu lain di baris bawah.",
      ],
    },
    brightness: {
      title: "Kecerahan dan iklim",
      points: [
        "Kecerahan otomatis menyesuaikan jika data kecerahan layar tersedia.",
        "Jika layar redup, mode otomatis dapat mencerahkan aplikasi agar lebih mudah dibaca.",
        "Mode manual memungkinkan penyesuaian kecerahan dengan tombol +/−.",
        "Kartu di baris bawah tetap sejajar agar tata letak konsisten.",
      ],
    },
    navigation: {
      title: "Navigasi dan peta",
      points: [
        "Di layar peta, gunakan bilah pencarian untuk menetapkan tujuan.",
        "Ketuk stasiun pengisian dekat atau peringatan lalu lintas untuk konteks rute cepat.",
        "Peta sejajar dengan panel gigi di baris atas.",
      ],
    },
    phone: {
      title: "Pemasangan ponsel dan pengaturan",
      points: [
        "Pindai kode QR untuk menautkan ponsel secara otomatis.",
        "Ubah bahasa tampilan, tema, dan ukuran font di panel ini.",
        "Gunakan area ini untuk meninjau kontrol dan memperbarui preferensi.",
      ],
    },
  },
  th: {
    home: {
      title: "แดชบอร์ดหน้าแรก",
      points: [
        "คอลัมน์ซ้ายแสดงการจราจรหรือสื่อตามหน้าจอ",
        "คอลัมน์กลางแสดงแผนที่และการควบคุมความสว่าง",
        "คอลัมน์ขวาแสดงเกียร์ ระดับแบตเตอรี่ และสภาพอากาศ",
      ],
    },
    media: {
      title: "สื่อและเพลง",
      points: [
        "แตะการ์ดเพลงเพื่อขยายตัวเล่นและใช้ปุ่มควบคุมการเล่น",
        "ใช้เล่น/หยุดชั่วคราวและข้ามเพื่อเปลี่ยนแทร็ก",
        "คีย์บอร์ด: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R สลับเกียร์ขณะขับ",
        "เปิดหน้านี้ใน Chrome เพื่อรองรับปุ่มลัดและความสว่างที่ดีที่สุด",
        "การ์ดเพลงแบบกะทัดรัดจัดแนวกับการ์ดอื่นในแถวล่าง",
      ],
    },
    brightness: {
      title: "ความสว่างและระบบปรับอากาศ",
      points: [
        "โหมดความสว่างอัตโนมัติปรับเมื่อมีข้อมูลความสว่างหน้าจอ",
        "หากหน้าจอมืด โหมดอัตโนมัติช่วยให้อ่านแอปได้ง่ายขึ้น",
        "โหมดปรับเองใช้ปุ่ม +/− เพื่อปรับความสว่าง",
        "การ์ดแถวล่างจัดเรียงให้เสถียร",
      ],
    },
    navigation: {
      title: "การนำทางและแผนที่",
      points: [
        "บนหน้าจอแผนที่ ใช้แถบค้นหาเพื่อตั้งจุดหมาย",
        "แตะสถานีชาร์จใกล้เคียงหือการแจ้งเตือนจราจรเพื่อดูบริบทเส้นทาง",
        "แผนที่จัดแนวกับแผงเกียร์ในแถวบน",
      ],
    },
    phone: {
      title: "เชื่อมต่อโทรศัพท์และการตั้งค่า",
      points: [
        "สแกน QR เพื่อเชื่อมโทรศัพท์อัตโนมัติ",
        "เปลี่ยนภาษาที่แสดง ธีม และขนาดตัวอักษรในแผงนี้",
        "ใช้พื้นที่นี้เพื่อทบทวนการควบคุมและอัปเดตการตั้งค่า",
      ],
    },
  },
  vi: {
    home: {
      title: "Bảng điều khiển trang chủ",
      points: [
        "Cột trái hiển thị giao thông hoặc phương tiện truyền thông tùy màn hình.",
        "Cột giữa hiển thị bản đồ và điều khiển độ sáng.",
        "Cột phải hiển thị số, mức pin và thời tiết.",
      ],
    },
    media: {
      title: "Phương tiện và nhạc",
      points: [
        "Chạm thẻ nhạc để mở rộng trình phát và dùng nút điều khiển.",
        "Dùng phát/tạm dừng và bỏ qua để đổi bài.",
        "Bàn phím: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R để đổi số khi lái.",
        "Mở trang này trong Chrome để hỗ trợ phím tắt và độ sáng tốt nhất.",
        "Thẻ nhạc gọn xếp thẳng hàng với các thẻ khác ở hàng dưới.",
      ],
    },
    brightness: {
      title: "Độ sáng và điều hòa",
      points: [
        "Độ sáng tự động điều chỉnh khi có dữ liệu độ sáng màn hình.",
        "Nếu màn hình tối, chế độ tự động có thể làm sáng ứng dụng để dễ đọc.",
        "Chế độ thủ công cho phép chỉnh độ sáng bằng nút +/−.",
        "Các thẻ hàng dưới được căn chỉnh ổn định.",
      ],
    },
    navigation: {
      title: "Dẫn đường và bản đồ",
      points: [
        "Trên màn hình bản đồ, dùng thanh tìm kiếm để đặt điểm đến.",
        "Chạm trạm sạc gần đây hoặc cảnh báo giao thông để xem nhanh ngữ cảnh tuyến.",
        "Bản đồ thẳng hàng với bảng số ở hàng trên.",
      ],
    },
    phone: {
      title: "Ghép điện thoại và cài đặt",
      points: [
        "Quét mã QR để liên kết điện thoại tự động.",
        "Đổi ngôn ngữ hiển thị, chủ đề và cỡ chữ trong bảng này.",
        "Dùng khu vực này để xem lại điều khiển và cập nhật tùy chọn.",
      ],
    },
  },
  ko: {
    home: {
      title: "홈 대시보드",
      points: [
        "왼쪽 열은 화면에 따라 교통 정보 또는 미디어를 표시합니다.",
        "가운데 열은 지도와 밝기 조작을 표시합니다.",
        "오른쪽 열은 기어, 배터리 잔량, 날씨를 표시합니다.",
      ],
    },
    media: {
      title: "미디어 및 음악",
      points: [
        "음악 카드를 탭해 플레이어를 펼치고 재생 컨트롤을 사용합니다.",
        "재생/일시정지 및 건너뛰기로 곡을 바꿉니다.",
        "키보드: 주행 중 Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R로 기어를 바꿉니다.",
        "단축키와 밝기 지원을 위해 이 페이지는 Chrome에서 여세요.",
        "작은 음악 카드는 아래 줄의 다른 카드와 높이가 맞춰집니다.",
      ],
    },
    brightness: {
      title: "밝기 및 공조",
      points: [
        "화면 밝기 정보가 있으면 자동 밝기가 조정됩니다.",
        "화면이 어두우면 자동 모드로 가독성을 높일 수 있습니다.",
        "수동 모드에서는 +/− 버튼으로 밝기를 조절합니다.",
        "아래 카드는 정렬되어 레이아웃이 안정적입니다.",
      ],
    },
    navigation: {
      title: "내비게이션 및 지도",
      points: [
        "지도 화면에서 검색창으로 목적지를 설정합니다.",
        "근처 충전소나 교통 알림을 탭해 경로 맥락을 빠르게 확인합니다.",
        "지도는 위쪽 줄의 기어 패널과 맞춰 배치됩니다.",
      ],
    },
    phone: {
      title: "휴대폰 연결 및 설정",
      points: [
        "QR 코드를 스캔해 휴대폰을 자동으로 연결합니다.",
        "이 패널에서 표시 언어, 테마, 글자 크기를 변경합니다.",
        "이 영역에서 조작 방법을 확인하고 설정을 업데이트합니다.",
      ],
    },
  },
  hi: {
    home: {
      title: "होम डैशबोर्ड",
      points: [
        "बायाँ कॉलम स्क्रीन के अनुसार ट्रैफ़िक या मीडिया दिखाता है।",
        "मध्य कॉलम मानचित्र और चमक नियंत्रण दिखाता है।",
        "दायाँ कॉलम गियर, बैटरी स्तर और मौसम दिखाता है।",
      ],
    },
    media: {
      title: "मीडिया और संगीत",
      points: [
        "प्लेयर खोलने और नियंत्रण के लिए संगीत कार्ड पर टैप करें।",
        "ट्रैक बदलने के लिए चलाएँ/रोकें और स्किप का उपयोग करें।",
        "कीबोर्ड: ड्राइविंग के दौरान Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R से गियर बदलें।",
        "सर्वोत्तम शॉर्टकट और चमक के लिए यह पेज Chrome में खोलें।",
        "कॉम्पैक्ट संगीत कार्ड निचली पंक्ति में अन्य कार्डों के साथ संरेखित है।",
      ],
    },
    brightness: {
      title: "चमक और जलवायु",
      points: [
        "स्क्रीन चमक उपलब्ध होने पर ऑटो चमक समायोजित होती है।",
        "स्क्रीन मंद होने पर ऑटो मोड पठनीयता बढ़ा सकता है।",
        "मैनुअल मोड में +/− बटन से चमक समायोजित करें।",
        "नीचे की कार्ड स्थिर लेआउट के लिए संरेखित रहती हैं।",
      ],
    },
    navigation: {
      title: "नेविगेशन और मानचित्र",
      points: [
        "मानचित्र स्क्रीन पर खोज पट्टी से गंतव्य सेट करें।",
        "रूट संदर्भ के लिए नज़दीकी स्टेशन या ट्रैफ़िक अलर्ट पर टैप करें।",
        "मानचित्र ऊपरी पंक्ति में गियर पैनल के साथ संरेखित है।",
      ],
    },
    phone: {
      title: "फ़ोन पेयरिंग और सेटिंग्स",
      points: [
        "QR कोड स्कैन करके फ़ोन स्वतः लिंक करें।",
        "इस पैनल में भाषा, थीम और फ़ॉन्ट आकार बदलें।",
        "नियंत्रण देखें और वरीयताएँ अपडेट करें।",
      ],
    },
  },
  ar: {
    home: {
      title: "لوحة الرئيسية",
      points: [
        "العمود الأيسر يعرض المرور أو الوسائط حسب الشاشة.",
        "العمود الأوسط يعرض الخريطة وعناصر التحكم بالسطوع.",
        "العمود الأيمن يعرض ناقل الحركة ومستوى البطارية والطقس.",
      ],
    },
    media: {
      title: "الوسائط والموسيقى",
      points: [
        "اضغط على بطاقة الموسيقى لتوسيع المشغّل واستخدام عناصر التحكم.",
        "استخدم التشغيل/الإيقاف المؤقت والتخطي لتغيير المقطوعات.",
        "لوحة المفاتيح: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R لتغيير السرعة أثناء القيادة.",
        "افتح هذه الصفحة في Chrome لأفضل دعم للاختصارات والسطوع.",
        "بطاقة الموسيقى المدمجة تتماشى مع البطاقات الأخرى في الصف السفلي.",
      ],
    },
    brightness: {
      title: "السطوع والمناخ",
      points: [
        "يضبط السطوع التلقائي عند توفر بيانات سطوع الشاشة.",
        "إذا كانت الشاشة خافتة، قد يزيد الوضع التلقائي وضوح التطبيق.",
        "الوضع اليدوي يتيح ضبط السطوع بأزرار +/−.",
        "البطاقات السفلية تبقى محاذية لتخطيط ثابت.",
      ],
    },
    navigation: {
      title: "التنقل والخريطة",
      points: [
        "على شاشة الخريطة، استخدم شريط البحث لتعيين الوجهة.",
        "اضغط على محطات الشحن القريبة أو تنبيهات المرور لسياق سريع للمسار.",
        "الخريطة محاذية مع لوحة ناقل الحركة في الصف العلوي.",
      ],
    },
    phone: {
      title: "ربط الهاتف والإعدادات",
      points: [
        "امسح رمز الاستجابة السريعة لربط هاتفك تلقائياً.",
        "غيّر لغة العرض والسمة وحجم الخط في هذه اللوحة.",
        "استخدم هذه المنطقة لمراجعة التحكم وتحديث التفضيلات.",
      ],
    },
  },
  ru: {
    home: {
      title: "Главная панель",
      points: [
        "Левая колонка показывает трафик или медиа в зависимости от экрана.",
        "Центральная колонка — карта и управление яркостью.",
        "Правая колонка — передача, заряд батареи и погода.",
      ],
    },
    media: {
      title: "Медиа и музыка",
      points: [
        "Нажмите на карточку музыки, чтобы развернуть плеер и элементы управления.",
        "Воспроизведение/пауза и пропуск переключают треки.",
        "Клавиатура: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R — смена передачи во время движения.",
        "Откройте страницу в Chrome для лучшей поддержки горячих клавиш и яркости.",
        "Компактная карточка музыки выровнена с другими карточками в нижнем ряду.",
      ],
    },
    brightness: {
      title: "Яркость и климат",
      points: [
        "Автояркость работает, когда доступны данные о яркости экрана.",
        "Если экран тусклый, авто может сделать приложение читабельнее.",
        "В ручном режиме яркость настраивается кнопками +/−.",
        "Нижние карточки остаются выровненными для стабильной вёрстки.",
      ],
    },
    navigation: {
      title: "Навигация и карта",
      points: [
        "На экране карты задайте пункт назначения в строке поиска.",
        "Нажмите на ближайшие станции зарядки или предупреждения о трафике для контекста маршрута.",
        "Карта выровнена с панелью передач в верхнем ряду.",
      ],
    },
    phone: {
      title: "Сопряжение телефона и настройки",
      points: [
        "Отсканируйте QR-код для автоматической привязки телефона.",
        "Язык интерфейса, тема и размер шрифта меняются в этой панели.",
        "Здесь можно просмотреть элементы управления и обновить параметры.",
      ],
    },
  },
  ta: {
    home: {
      title: "முகப்பு டாஷ்போர்டு",
      points: [
        "இடது நெடுவரிசை திரையைப் பொறுத்து போக்குவரத்து அல்லது ஊடகத்தைக் காட்டும்.",
        "நடு நெடுவரிசை வரைபடம் மற்றும் பிரகாசக் கட்டுப்பாடுகளைக் காட்டும்.",
        "வலது நெடுவரிசை கியர், மின்கல நிலை மற்றும் வானிலையைக் காட்டும்.",
      ],
    },
    media: {
      title: "ஊடகம் மற்றும் இசை",
      points: [
        "இசை அட்டையைத் தட்டி பிளேயரை விரிவாக்கி கட்டுப்பாடுகளைப் பயன்படுத்தவும்.",
        "பாடல்களை மாற்ற இயக்க/இடைநிறுத்தம் மற்றும் தவிர்த்தல் பயன்படுத்தவும்.",
        "விசைப்பலகை: ஓட்டும்போது Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R கியரை மாற்றும்.",
        "குறுக்குவழி மற்றும் பிரகாச ஆதரவிற்கு இந்தப் பக்கத்தை Chrome இல் திறக்கவும்.",
        "சிறிய இசை அட்டை கீழ் வரிசையிலுள்ள மற்ற அட்டைகளுடன் சீரமைக்கப்படும்.",
      ],
    },
    brightness: {
      title: "பிரகாசம் மற்றும் காலநிலை",
      points: [
        "திரை பிரகாசத் தரவு கிடைக்கும்போது தானியங்கி பிரகாசம் சரிசெய்யும்.",
        "திரை மங்கலாக இருந்தால் தானியங்கி முறை படிப்பதை எளிதாக்கும்.",
        "கைமுறை முறையில் +/− பொத்தான்களால் பிரகாசத்தை மாற்றவும்.",
        "கீழ் அட்டைகள் நிலையான அமைப்பிற்கு சீரமைக்கப்படும்.",
      ],
    },
    navigation: {
      title: "வழிசெலுத்தல் மற்றும் வரைபடம்",
      points: [
        "வரைபடத் திரையில் தேடல் பட்டியில் இலக்கை அமைக்கவும்.",
        "வழி சூழலுக்கு அருகிலுள்ள நிலையங்கள் அல்லது போக்குவரத்து எச்சரிக்கைகளைத் தட்டவும்.",
        "வரைபடம் மேல் வரிசையிலுள்ள கியர் பலகையுடன் சீரமைக்கப்படும்.",
      ],
    },
    phone: {
      title: "தொலைபேசி இணைப்பு மற்றும் அமைப்புகள்",
      points: [
        "QR ஐ ஸ்கேன் செய்து தொலைபேசியை தானாக இணைக்கவும்.",
        "இந்தப் பலகையில் காட்சி மொழி, தீம் மற்றும் எழுத்து அளவை மாற்றவும்.",
        "கட்டுப்பாடுகளைப் பார்த்து விருப்பங்களைப் புதுப்பிக்க இந்தப் பகுதியைப் பயன்படுத்தவும்.",
      ],
    },
  },
  es: {
    home: {
      title: "Panel de inicio",
      points: [
        "La columna izquierda muestra tráfico o multimedia según la pantalla.",
        "La columna central muestra el mapa y los controles de brillo.",
        "La columna derecha muestra la marcha, el nivel de batería y el tiempo.",
      ],
    },
    media: {
      title: "Multimedia y música",
      points: [
        "Toca la tarjeta de música para expandir el reproductor y usar los controles.",
        "Usa reproducir/pausa y saltar para cambiar de pista.",
        "Teclado: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R cambia la marcha al conducir.",
        "Abre esta página en Chrome para el mejor soporte de atajos y brillo.",
        "La tarjeta de música compacta se alinea con las demás en la fila inferior.",
      ],
    },
    brightness: {
      title: "Brillo y clima",
      points: [
        "El brillo automático se ajusta cuando hay datos de brillo de pantalla.",
        "Si la pantalla está oscura, el modo automático puede mejorar la lectura.",
        "El modo manual permite ajustar el brillo con los botones +/−.",
        "Las tarjetas inferiores permanecen alineadas para un diseño estable.",
      ],
    },
    navigation: {
      title: "Navegación y mapa",
      points: [
        "En la pantalla del mapa, usa la barra de búsqueda para fijar el destino.",
        "Toca estaciones de carga cercanas o alertas de tráfico para contexto de ruta.",
        "El mapa se alinea con el panel de marchas en la fila superior.",
      ],
    },
    phone: {
      title: "Emparejamiento del teléfono y ajustes",
      points: [
        "Escanea el código QR para vincular el teléfono automáticamente.",
        "Cambia el idioma de pantalla, el tema y el tamaño de fuente en este panel.",
        "Usa esta zona para revisar los controles y actualizar preferencias.",
      ],
    },
  },
  de: {
    home: {
      title: "Start-Dashboard",
      points: [
        "Die linke Spalte zeigt je nach Bildschirm Verkehr oder Medien.",
        "Die mittlere Spalte zeigt die Karte und die Helligkeitsregler.",
        "Die rechte Spalte zeigt Gang, Batteriestand und Wetter.",
      ],
    },
    media: {
      title: "Medien und Musik",
      points: [
        "Tippen Sie auf die Musik-Karte, um den Player zu öffnen und Steuerung zu nutzen.",
        "Wiedergabe/Pause und Überspringen wechseln die Titel.",
        "Tastatur: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R wechselt den Gang während der Fahrt.",
        "Öffnen Sie diese Seite in Chrome für die beste Tastenkürzel- und Helligkeitsunterstützung.",
        "Die kompakte Musik-Karte ist mit den anderen Karten in der unteren Reihe ausgerichtet.",
      ],
    },
    brightness: {
      title: "Helligkeit und Klima",
      points: [
        "Die automatische Helligkeit passt sich an, wenn Bildschirmhelligkeitsdaten verfügbar sind.",
        "Ist der Bildschirm dunkel, kann der Auto-Modus die Lesbarkeit verbessern.",
        "Im manuellen Modus stellen Sie die Helligkeit mit +/− ein.",
        "Die unteren Karten bleiben für ein stabiles Layout ausgerichtet.",
      ],
    },
    navigation: {
      title: "Navigation und Karte",
      points: [
        "Legen Sie auf der Kartenansicht in der Suchleiste das Ziel fest.",
        "Tippen Sie auf nahe Ladestationen oder Verkehrshinweise für Routenkontext.",
        "Die Karte ist mit dem Gang-Panel in der oberen Reihe ausgerichtet.",
      ],
    },
    phone: {
      title: "Telefon koppeln und Einstellungen",
      points: [
        "Scannen Sie den QR-Code, um Ihr Telefon automatisch zu verknüpfen.",
        "Ändern Sie Anzeigesprache, Thema und Schriftgröße in diesem Bereich.",
        "Nutzen Sie diesen Bereich, um Bedienung zu prüfen und Einstellungen anzupassen.",
      ],
    },
  },
  fr: {
    home: {
      title: "Tableau de bord d’accueil",
      points: [
        "La colonne de gauche affiche le trafic ou les médias selon l’écran.",
        "La colonne centrale affiche la carte et les réglages de luminosité.",
        "La colonne de droite affiche la marche, la batterie et la météo.",
      ],
    },
    media: {
      title: "Médias et musique",
      points: [
        "Touchez la carte musique pour agrandir le lecteur et utiliser les commandes.",
        "Lecture/pause et saut pour changer de morceau.",
        "Clavier : Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R change de vitesse en conduisant.",
        "Ouvrez cette page dans Chrome pour le meilleur support des raccourcis et de la luminosité.",
        "La carte musique compacte s’aligne avec les autres cartes en bas.",
      ],
    },
    brightness: {
      title: "Luminosité et climat",
      points: [
        "La luminosité automatique s’ajuste lorsque les données d’écran sont disponibles.",
        "Si l’écran est sombre, le mode auto peut améliorer la lisibilité.",
        "Le mode manuel règle la luminosité avec les boutons +/−.",
        "Les cartes du bas restent alignées pour une mise en page stable.",
      ],
    },
    navigation: {
      title: "Navigation et carte",
      points: [
        "Sur l’écran carte, utilisez la barre de recherche pour définir la destination.",
        "Touchez les bornes proches ou les alertes trafic pour le contexte d’itinéraire.",
        "La carte s’aligne avec le panneau de vitesses en haut.",
      ],
    },
    phone: {
      title: "Appairage du téléphone et réglages",
      points: [
        "Scannez le QR code pour lier automatiquement votre téléphone.",
        "Changez la langue d’affichage, le thème et la taille du texte dans ce panneau.",
        "Utilisez cette zone pour revoir les commandes et mettre à jour les préférences.",
      ],
    },
  },
  it: {
    home: {
      title: "Dashboard home",
      points: [
        "La colonna sinistra mostra traffico o media a seconda della schermata.",
        "La colonna centrale mostra la mappa e i controlli luminosità.",
        "La colonna destra mostra marcia, livello batteria e meteo.",
      ],
    },
    media: {
      title: "Media e musica",
      points: [
        "Tocca la scheda musica per espandere il lettore e usare i controlli.",
        "Play/pausa e salta per cambiare traccia.",
        "Tastiera: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R cambia marcia in guida.",
        "Apri questa pagina in Chrome per il miglior supporto a scorciatoie e luminosità.",
        "La scheda musica compatta è allineata alle altre nella fila inferiore.",
      ],
    },
    brightness: {
      title: "Luminosità e clima",
      points: [
        "La luminosità automatica si regola quando sono disponibili i dati dello schermo.",
        "Se lo schermo è scuro, la modalità automatica può migliorare la leggibilità.",
        "In manuale regoli la luminosità con i pulsanti +/−.",
        "Le schede inferiori restano allineate per un layout stabile.",
      ],
    },
    navigation: {
      title: "Navigazione e mappa",
      points: [
        "Nella schermata mappa usa la barra di ricerca per impostare la destinazione.",
        "Tocca stazioni di ricarica vicine o avvisi traffico per contesto percorso.",
        "La mappa è allineata al pannello marce nella fila superiore.",
      ],
    },
    phone: {
      title: "Accoppiamento telefono e impostazioni",
      points: [
        "Scansiona il QR code per collegare automaticamente il telefono.",
        "Cambia lingua di visualizzazione, tema e dimensione caratteri in questo pannello.",
        "Usa quest’area per rivedere i comandi e aggiornare le preferenze.",
      ],
    },
  },
  pt: {
    home: {
      title: "Painel inicial",
      points: [
        "A coluna esquerda mostra tráfego ou multimédia conforme o ecrã.",
        "A coluna central mostra o mapa e os controlos de brilho.",
        "A coluna direita mostra a mudança, o nível da bateria e o tempo.",
      ],
    },
    media: {
      title: "Multimédia e música",
      points: [
        "Toque no cartão de música para expandir o leitor e usar os controlos.",
        "Use reproduzir/pausa e saltar para mudar de faixa.",
        "Teclado: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R muda a mudança em condução.",
        "Abra esta página no Chrome para o melhor suporte a atalhos e brilho.",
        "O cartão de música compacto alinha-se com os outros na fila inferior.",
      ],
    },
    brightness: {
      title: "Brilho e clima",
      points: [
        "O brilho automático ajusta-se quando há dados de brilho do ecrã.",
        "Se o ecrã estiver escuro, o modo automático pode melhorar a leitura.",
        "No modo manual ajuste o brilho com os botões +/−.",
        "Os cartões inferiores mantêm-se alinhados para um layout estável.",
      ],
    },
    navigation: {
      title: "Navegação e mapa",
      points: [
        "No ecrã do mapa use a barra de pesquisa para definir o destino.",
        "Toque em postos de carregamento próximos ou alertas de tráfego para contexto de rota.",
        "O mapa alinha-se com o painel de mudanças na fila superior.",
      ],
    },
    phone: {
      title: "Emparelhamento do telefone e definições",
      points: [
        "Digitalize o código QR para ligar o telefone automaticamente.",
        "Altere idioma de exibição, tema e tamanho da fonte neste painel.",
        "Use esta área para rever controlos e atualizar preferências.",
      ],
    },
  },
  tr: {
    home: {
      title: "Ana gösterge paneli",
      points: [
        "Sol sütun ekrana göre trafik veya medya gösterir.",
        "Orta sütun harita ve parlaklık kontrollerini gösterir.",
        "Sağ sütun vites, pil seviyesi ve hava durumunu gösterir.",
      ],
    },
    media: {
      title: "Medya ve müzik",
      points: [
        "Oynatıcıyı açmak ve kontrolleri kullanmak için müzik kartına dokunun.",
        "Parça değiştirmek için oynat/duraklat ve atla kullanın.",
        "Klavye: Sürüş sırasında Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R vites değiştirir.",
        "Kısayol ve parlaklık desteği için bu sayfayı Chrome’da açın.",
        "Kompakt müzik kartı alt sıradaki diğer kartlarla hizalanır.",
      ],
    },
    brightness: {
      title: "Parlaklık ve iklim",
      points: [
        "Ekran parlaklığı verisi varsa otomatik parlaklık ayarlanır.",
        "Ekran karanlıksa otomatik mod okunabilirliği artırabilir.",
        "Manuel modda +/− ile parlaklığı ayarlayın.",
        "Alt kartlar düzenli bir yerleşim için hizalı kalır.",
      ],
    },
    navigation: {
      title: "Navigasyon ve harita",
      points: [
        "Harita ekranında hedefi belirlemek için arama çubuğunu kullanın.",
        "Rota bağlamı için yakındaki istasyonlara veya trafik uyarılarına dokunun.",
        "Harita üst sıradaki vites paneliyle hizalanır.",
      ],
    },
    phone: {
      title: "Telefon eşleştirme ve ayarlar",
      points: [
        "Telefonu otomatik bağlamak için QR kodunu tarayın.",
        "Bu panelde görüntü dili, tema ve yazı boyutunu değiştirin.",
        "Kontrolleri gözden geçirmek ve tercihleri güncellemek için bu alanı kullanın.",
      ],
    },
  },
  nl: {
    home: {
      title: "Startdashboard",
      points: [
        "De linkerkolom toont verkeer of media afhankelijk van het scherm.",
        "De middenkolom toont de kaart en helderheidsregeling.",
        "De rechterkolom toont versnelling, batterijniveau en weer.",
      ],
    },
    media: {
      title: "Media en muziek",
      points: [
        "Tik op de muziekkaart om de speler uit te klappen en knoppen te gebruiken.",
        "Gebruik afspelen/pauze en overslaan om van nummer te wisselen.",
        "Toetsenbord: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R wisselt versnelling tijdens het rijden.",
        "Open deze pagina in Chrome voor de beste ondersteuning van sneltoetsen en helderheid.",
        "De compacte muziekkaart sluit aan op andere kaarten in de onderste rij.",
      ],
    },
    brightness: {
      title: "Helderheid en klimaat",
      points: [
        "Automatische helderheid past zich aan als schermhelderheid beschikbaar is.",
        "Is het scherm donker, dan kan de automatische modus de leesbaarheid verbeteren.",
        "In handmatige modus stelt u de helderheid in met +/−.",
        "Onderste kaarten blijven uitgelijnd voor een stabiele lay-out.",
      ],
    },
    navigation: {
      title: "Navigatie en kaart",
      points: [
        "Stel op het kaartscherm de bestemming in via de zoekbalk.",
        "Tik op nabije laadstations of verkeersmeldingen voor routecontext.",
        "De kaart is uitgelijnd met het versnellingspaneel in de bovenste rij.",
      ],
    },
    phone: {
      title: "Telefoon koppelen en instellingen",
      points: [
        "Scan de QR-code om uw telefoon automatisch te koppelen.",
        "Wijzig weergavetaal, thema en lettergrootte in dit paneel.",
        "Gebruik dit gebied om bediening te bekijken en voorkeuren bij te werken.",
      ],
    },
  },
  sv: {
    home: {
      title: "Startinstrumentpanel",
      points: [
        "Vänster kolumn visar trafik eller media beroende på skärmen.",
        "Mittenkolumnen visar kartan och ljusstyrkereglering.",
        "Höger kolumn visar växel, batterinivå och väder.",
      ],
    },
    media: {
      title: "Media och musik",
      points: [
        "Tryck på musikkortet för att expandera spelaren och använda kontroller.",
        "Använd spela/pausa och hoppa för att byta spår.",
        "Tangentbord: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R byter växel under körning.",
        "Öppna denna sida i Chrome för bäst stöd för kortkommandon och ljusstyrka.",
        "Det kompakta musikkortet linjerar med övriga kort i nedre raden.",
      ],
    },
    brightness: {
      title: "Ljusstyrka och klimat",
      points: [
        "Automatisk ljusstyrka justeras när skärmljusdata finns.",
        "Om skärmen är mörk kan automatiskt läge förbättra läsbarheten.",
        "I manuellt läge justerar du med +/−.",
        "Nedre kort förblir linjerade för stabil layout.",
      ],
    },
    navigation: {
      title: "Navigation och karta",
      points: [
        "På kartskärmen anger du destination i sökfältet.",
        "Tryck på närliggande laddstationer eller trafikvarningar för ruttcontext.",
        "Kartan linjerar med växelpanelet i övre raden.",
      ],
    },
    phone: {
      title: "Telefonparkoppling och inställningar",
      points: [
        "Skanna QR-koden för att länka telefonen automatiskt.",
        "Ändra visningsspråk, tema och teckenstorlek i denna panel.",
        "Använd detta område för att granska kontroller och uppdatera inställningar.",
      ],
    },
  },
  pl: {
    home: {
      title: "Panel główny",
      points: [
        "Lewa kolumna pokazuje ruch lub multimedia w zależności od ekranu.",
        "Środkowa kolumna pokazuje mapę i sterowanie jasnością.",
        "Prawa kolumna pokazuje bieg, poziom baterii i pogodę.",
      ],
    },
    media: {
      title: "Media i muzyka",
      points: [
        "Dotknij karty muzyki, aby rozwinąć odtwarzacz i użyć przycisków.",
        "Odtwórz/wstrzymaj i pomiń zmieniają utwór.",
        "Klawiatura: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R zmienia bieg podczas jazdy.",
        "Otwórz tę stronę w Chrome, aby uzyskać najlepsze skróty i jasność.",
        "Kompaktowa karta muzyki wyrównuje się z innymi w dolnym rzędzie.",
      ],
    },
    brightness: {
      title: "Jasność i klimat",
      points: [
        "Automatyczna jasność działa, gdy dostępne są dane o jasności ekranu.",
        "Przy przyciemnionym ekranie tryb auto może poprawić czytelność.",
        "W trybie ręcznym regulujesz jasność przyciskami +/−.",
        "Dolne karty pozostają wyrównane dla stabilnego układu.",
      ],
    },
    navigation: {
      title: "Nawigacja i mapa",
      points: [
        "Na ekranie mapy ustaw cel w pasku wyszukiwania.",
        "Dotknij pobliskich stacji ładowania lub alertów drogowych dla kontekstu trasy.",
        "Mapa jest wyrównana z panelem biegów w górnym rzędzie.",
      ],
    },
    phone: {
      title: "Parowanie telefonu i ustawienia",
      points: [
        "Zeskanuj kod QR, aby automatycznie połączyć telefon.",
        "Zmień język wyświetlania, motyw i rozmiar czcionki w tym panelu.",
        "Użyj tego obszaru, aby przejrzeć sterowanie i zaktualizować preferencje.",
      ],
    },
  },
  uk: {
    home: {
      title: "Головна панель",
      points: [
        "Ліва колонка показує рух або медіа залежно від екрана.",
        "Центральна колонка — карта та керування яскравістю.",
        "Права колонка — передача, заряд акумулятора та погода.",
      ],
    },
    media: {
      title: "Медіа та музика",
      points: [
        "Торкніться картки музики, щоб розгорнути плеєр і керування.",
        "Відтворення/пауза та пропуск змінюють треки.",
        "Клавіатура: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R — зміна передачі під час руху.",
        "Відкрийте сторінку в Chrome для найкращої підтримки яскравості та гарячих клавіш.",
        "Компактна картка музики вирівняна з іншими в нижньому ряді.",
      ],
    },
    brightness: {
      title: "Яскравість і клімат",
      points: [
        "Автояскравість працює за наявності даних про яскравість екрана.",
        "Якщо екран темний, авто може покращити читабельність.",
        "У ручному режимі яскравість налаштовується кнопками +/−.",
        "Нижні картки залишаються вирівняними для стабільної верстки.",
      ],
    },
    navigation: {
      title: "Навігація та карта",
      points: [
        "На екрані карти задайте пункт призначення в рядку пошуку.",
        "Торкніться зарядних станцій або попереджень про рух для контексту маршруту.",
        "Карта вирівняна з панеллю передач у верхньому ряді.",
      ],
    },
    phone: {
      title: "Підключення телефону та налаштування",
      points: [
        "Відскануйте QR-код для автоматичного зв’язку телефону.",
        "Змініть мову інтерфейсу, тему та розмір шрифту в цій панелі.",
        "Використовуйте цю зону для перегляду керування та оновлення параметрів.",
      ],
    },
  },
  fa: {
    home: {
      title: "داشبورد خانه",
      points: [
        "ستون چپ بسته به صفحه، ترافیک یا رسانه را نشان می‌دهد.",
        "ستون وسط نقشه و کنترل روشنایی را نشان می‌دهد.",
        "ستون راست دنده، سطح باتری و آب‌وهوا را نشان می‌دهد.",
      ],
    },
    media: {
      title: "رسانه و موسیقی",
      points: [
        "روی کارت موسیقی بزنید تا پخش‌کننده باز شود و کنترل‌ها را ببینید.",
        "پخش/توقف موقت و رد کردن برای عوض کردن آهنگ.",
        "صفحه‌کلید: هنگام رانندگی Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R دنده را عوض می‌کند.",
        "این صفحه را در Chrome باز کنید تا بهترین پشتیبانی میانبر و روشنایی را داشته باشید.",
        "کارت موسیقی فشرده با کارت‌های ردیف پایین هم‌تراز است.",
      ],
    },
    brightness: {
      title: "روشنایی و اقلیم",
      points: [
        "روشنایی خودکار وقتی داده روشنایی صفحه موجود است تنظیم می‌شود.",
        "اگر صفحه تاریک باشد، حالت خودکار خوانایی را بهتر می‌کند.",
        "در حالت دستی با دکمه‌های +/− روشنایی را تنظیم کنید.",
        "کارت‌های پایین برای چیدمان پایدار هم‌تراز می‌مانند.",
      ],
    },
    navigation: {
      title: "مسیریابی و نقشه",
      points: [
        "در صفحه نقشه با نوار جستجو مقصد را تنظیم کنید.",
        "ایستگاه‌های شارژ نزدیک یا هشدارهای ترافیک را برای زمینه مسیر لمس کنید.",
        "نقشه با پنل دنده در ردیف بالا هم‌تراز است.",
      ],
    },
    phone: {
      title: "جفت‌سازی تلفن و تنظیمات",
      points: [
        "کد QR را اسکن کنید تا تلفن به‌صورت خودکار پیوند شود.",
        "زبان نمایش، تم و اندازه فونت را در این پنل تغییر دهید.",
        "از این ناحیه برای مرور کنترل‌ها و به‌روزرسانی ترجیحات استفاده کنید.",
      ],
    },
  },
  bn: {
    home: {
      title: "হোম ড্যাশবোর্ড",
      points: [
        "বাম কলাম স্ক্রিন অনুযায়ী ট্রাফিক বা মিডিয়া দেখায়।",
        "মাঝের কলাম মানচিত্র ও উজ্জ্বলতা নিয়ন্ত্রণ দেখায়।",
        "ডান কলাম গিয়ার, ব্যাটারি স্তর ও আবহাওয়া দেখায়।",
      ],
    },
    media: {
      title: "মিডিয়া ও সঙ্গীত",
      points: [
        "প্লেয়ার খুলতে ও নিয়ন্ত্রণ ব্যবহার করতে সঙ্গীত কার্ডে ট্যাপ করুন।",
        "ট্র্যাক বদলাতে চালান/বিরতি ও এড়িয়ে যান ব্যবহার করুন।",
        "কীবোর্ড: ড্রাইভিংয়ের সময় Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R গিয়ার বদলায়।",
        "শর্টকাট ও উজ্জ্বলতার সেরা সমর্থনের জন্য এই পৃষ্ঠা Chrome এ খুলুন।",
        "কমপ্যাক্ট সঙ্গীত কার্ড নিচের সারির অন্যান্য কার্ডের সাথে সারিবদ্ধ।",
      ],
    },
    brightness: {
      title: "উজ্জ্বলতা ও জলবায়ু",
      points: [
        "স্ক্রিন উজ্জ্বলতার তথ্য থাকলে স্বয়ংক্রিয় উজ্জ্বলতা মিলিয়ে নেয়।",
        "স্ক্রিন অন্ধকার হলে স্বয়ংক্রিয় মোড পাঠযোগ্যতা বাড়াতে পারে।",
        "ম্যানুয়াল মোডে +/− বাটনে উজ্জ্বলতা ঠিক করুন।",
        "নিচের কার্ডগুলো স্থিতিশীল লেআউটের জন্য সারিবদ্ধ থাকে।",
      ],
    },
    navigation: {
      title: "ন্যাভিগেশন ও মানচিত্র",
      points: [
        "মানচিত্র স্ক্রিনে সার্চ বারে গন্তব্য সেট করুন।",
        "রুটের প্রসঙ্গের জন্য কাছের চার্জিং স্টেশন বা ট্রাফিক সতর্কতায় ট্যাপ করুন।",
        "মানচিত্র উপরের সারিতে গিয়ার প্যানেলের সাথে সারিবদ্ধ।",
      ],
    },
    phone: {
      title: "ফোন পেয়ারিং ও সেটিংস",
      points: [
        "QR স্ক্যান করে ফোন স্বয়ংক্রিয়ভাবে লিঙ্ক করুন।",
        "এই প্যানেলে ভাষা, থিম ও ফন্ট সাইজ বদলান।",
        "নিয়ন্ত্রণ দেখতে ও পছন্দ আপডেট করতে এই এলাকা ব্যবহার করুন।",
      ],
    },
  },
  ur: {
    home: {
      title: "ہوم ڈیش بورڈ",
      points: [
        "بایاں کالم اسکرین کے مطابق ٹریفک یا میڈیا دکھاتا ہے۔",
        "درمیانی کالم نقشہ اور چمک کنٹرول دکھاتا ہے۔",
        "دایاں کالم گیئر، بیٹری کی سطح اور موسم دکھاتا ہے۔",
      ],
    },
    media: {
      title: "میڈیا اور موسیقی",
      points: [
        "پلیئر کھولنے اور کنٹرول کے لیے موسیقی کارڈ پر ٹیپ کریں۔",
        "ٹریک بدلنے کے لیے چلائیں/روکیں اور اگلا استعمال کریں۔",
        "کی بورڈ: ڈرائیونگ میں Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R گیئر بدلتا ہے۔",
        "شارٹ کٹ اور چمک کے بہترین سپورٹ کے لیے یہ صفحہ Chrome میں کھولیں۔",
        "چھوٹا موسیقی کارڈ نیچی قطار میں دوسرے کارڈز کے ساتھ ہم آہنگ ہے۔",
      ],
    },
    brightness: {
      title: "چمک اور موسم",
      points: [
        "اسکرین چمک کا ڈیٹا ملنے پر خودکار چمک ایڈجسٹ ہوتی ہے۔",
        "اسکرین مدھم ہو تو خودکار موڈ پڑھنے میں آسانی دے سکتا ہے۔",
        "دستی موڈ میں +/− بٹن سے چمک سیٹ کریں۔",
        "نیچے کے کارڈ مستحکم لے آؤٹ کے لیے ہم آہنگ رہتے ہیں۔",
      ],
    },
    navigation: {
      title: "نیویگیشن اور نقشہ",
      points: [
        "نقشے کی اسکرین پر سرچ بار سے منزل مقرر کریں۔",
        "روٹ کے لیے قریبی چارجنگ اسٹیشن یا ٹریفک الرٹس پر ٹیپ کریں۔",
        "نقشہ اوپری قطار میں گیئر پینل کے ساتھ ہم آہنگ ہے۔",
      ],
    },
    phone: {
      title: "فون جوڑنا اور ترتیبات",
      points: [
        "QR اسکین کریں تاکہ فون خودکار منسلک ہو۔",
        "اس پینل میں ڈسپلے زبان، تھیم اور فونٹ سائز بدلیں۔",
        "کنٹرول دیکھنے اور ترجیحات اپ ڈیٹ کرنے کے لیے یہ علاقہ استعمال کریں۔",
      ],
    },
  },
  fil: {
    home: {
      title: "Dashboard ng home",
      points: [
        "Ang kaliwang column ay nagpapakita ng trapiko o media depende sa screen.",
        "Ang gitnang column ay mapa at mga kontrol ng liwanag.",
        "Ang kanang column ay gear, antas ng baterya, at panahon.",
      ],
    },
    media: {
      title: "Media at musika",
      points: [
        "I-tap ang music card para buksan ang player at gamitin ang mga kontrol.",
        "Gamitin ang play/pause at skip para palitan ang track.",
        "Keyboard: Ctrl+P / Ctrl+N / Ctrl+D / Ctrl+R para magpalit ng gear habang nagmamaneho.",
        "Buksan ang pahinang ito sa Chrome para sa pinakamahusay na shortcut at suporta sa liwanag.",
        "Ang compact na music card ay nakahanay sa iba pang card sa ibabang hilera.",
      ],
    },
    brightness: {
      title: "Liwanag at klima",
      points: [
        "Awtomatikong liwanag kapag may datos ng liwanag ng screen.",
        "Kung madilim ang screen, maaaring pagbutihin ng auto mode ang pagbabasa.",
        "Sa manual mode ay iayos ang liwanag gamit ang +/−.",
        "Nakahanay ang mga card sa ibaba para sa matatag na layout.",
      ],
    },
    navigation: {
      title: "Navigation at mapa",
      points: [
        "Sa screen ng mapa, gamitin ang search bar para itakda ang destinasyon.",
        "I-tap ang malapit na charging station o traffic alert para sa konteksto ng ruta.",
        "Nakahanay ang mapa sa gear panel sa itaas na hilera.",
      ],
    },
    phone: {
      title: "Pag-pares ng telepono at mga setting",
      points: [
        "I-scan ang QR code para awtomatikong i-link ang telepono.",
        "Baguhin ang wika ng display, tema, at laki ng font sa panel na ito.",
        "Gamitin ang lugar na ito para suriin ang mga kontrol at i-update ang mga kagustuhan.",
      ],
    },
  },
};

/** Localized manual card chrome (title / teaser / hint / Chrome tip) for locales merged from English. */
export const USER_MANUAL_UI_BY_LANG: Record<
  string,
  {
    userManualTitle: string;
    userManualTeaser: string;
    userManualHint: string;
    userManualChrome: string;
  }
> = {
  id: {
    userManualTitle: "Panduan pengguna",
    userManualTeaser:
      "Ketuk untuk melihat panduan lengkap. Mencakup layout dashboard, media, kecerahan, navigasi, dan pemasangan ponsel.",
    userManualHint:
      "Ketuk kartu musik untuk membuka playlist. Gunakan Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D untuk ganti gigi, dan atur kecerahan ke Auto atau Manual di sini.",
    userManualChrome:
      "Buka halaman ini di Chrome untuk dukungan pintasan keyboard dan kecerahan terbaik.",
  },
  th: {
    userManualTitle: "คู่มือการใช้งาน",
    userManualTeaser:
      "แตะเพื่อดูคู่มือฉบับเต็ม ครอบคลุมเลย์เอาต์แดชบอร์ด สื่อและเพลง ความสว่าง การนำทาง และการเชื่อมต่อโทรศัพท์",
    userManualHint:
      "แตะการ์ดเพลงเพื่อเปิดเพลย์ลิสต์ ใช้ Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D เพื่อเปลี่ยนเกียร์ และตั้งความสว่างเป็นอัตโนมัติหรือปรับเองที่นี่",
    userManualChrome: "เปิดหน้านี้ใน Chrome เพื่อรองรับปุ่มลัดและความสว่างที่ดีที่สุด",
  },
  vi: {
    userManualTitle: "Hướng dẫn sử dụng",
    userManualTeaser:
      "Chạm để xem hướng dẫn đầy đủ: bố cục bảng điều khiển, phương tiện, độ sáng, dẫn đường và ghép điện thoại.",
    userManualHint:
      "Chạm thẻ nhạc để mở danh sách phát. Dùng Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D để đổi số, và đặt độ sáng Tự động hoặc Thủ công tại đây.",
    userManualChrome: "Mở trang này trong Chrome để hỗ trợ phím tắt và độ sáng tốt nhất.",
  },
  ko: {
    userManualTitle: "사용 설명서",
    userManualTeaser:
      "탭하면 전체 설명서를 볼 수 있습니다. 대시보드 레이아웃, 미디어, 밝기, 내비게이션, 휴대폰 연결을 안내합니다.",
    userManualHint:
      "음악 카드를 탭해 재생목록을 엽니다. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D 로 기어를 바꾸고 여기서 밝기를 자동 또는 수동으로 설정하세요.",
    userManualChrome: "단축키와 밝기 지원을 위해 이 페이지는 Chrome에서 여세요.",
  },
  hi: {
    userManualTitle: "उपयोगकर्ता मैनुअल",
    userManualTeaser:
      "पूरा मैनुअल देखने के लिए टैप करें। डैशबोर्ड लेआउट, मीडिया, चमक, नेविगेशन और फ़ोन पेयरिंग शामिल है।",
    userManualHint:
      "प्लेलिस्ट के लिए संगीत कार्ड टैप करें। गियर बदलने के लिए Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D और चमक यहाँ ऑटो या मैनुअल सेट करें।",
    userManualChrome: "बेहतर शॉर्टकट और चमक के लिए Chrome में यह पेज खोलें।",
  },
  ar: {
    userManualTitle: "دليل المستخدم",
    userManualTeaser:
      "اضغط لعرض الدليل الكامل: تخطيط لوحة التحكم، الوسائط، السطوع، الملاحة وربط الهاتف.",
    userManualHint:
      "اضغط على بطاقة الموسيقى لفتح قائمة التشغيل. استخدم Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D لتغيير الغيار واضبط السطوع تلقائياً أو يدوياً هنا.",
    userManualChrome: "افتح هذه الصفحة في Chrome لأفضل دعم للاختصارات والسطوع.",
  },
  ru: {
    userManualTitle: "Руководство пользователя",
    userManualTeaser:
      "Нажмите, чтобы открыть полное руководство: макет панели, медиа, яркость, навигация и сопряжение телефона.",
    userManualHint:
      "Нажмите на карточку музыки для плейлиста. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D — смена передачи; яркость — Авто или Вручную здесь.",
    userManualChrome: "Откройте страницу в Chrome для лучшей поддержки горячих клавиш и яркости.",
  },
  ta: {
    userManualTitle: "பயனர் கையேடு",
    userManualTeaser:
      "முழு கையேட்டைக் காண தட்டவும்: டாஷ்போர்டு அமைப்பு, ஊடகம், பிரகாசம், வழிசெலுத்தல், தொலைபேசி இணைப்பு.",
    userManualHint:
      "பிளேலிஸ்டுக்கு இசை அட்டையைத் தட்டவும். Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D கியர் மாற்றம்; பிரகாசம் தானாக/கைமுறை இங்கே.",
    userManualChrome: "குறுக்குவழி மற்றும் பிரகாசத்திற்கு Chrome இல் இப்பக்கத்தைத் திறக்கவும்.",
  },
  es: {
    userManualTitle: "Manual del usuario",
    userManualTeaser:
      "Toca para ver el manual completo: diseño del panel, multimedia, brillo, navegación y emparejamiento del teléfono.",
    userManualHint:
      "Toca la tarjeta de música para la lista de reproducción. Usa Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D para el cambio y el brillo Auto/Manual aquí.",
    userManualChrome: "Abre esta página en Chrome para mejores atajos y brillo.",
  },
  de: {
    userManualTitle: "Benutzerhandbuch",
    userManualTeaser:
      "Tippen Sie für das vollständige Handbuch: Dashboard-Layout, Medien, Helligkeit, Navigation und Telefonkoppelung.",
    userManualHint:
      "Musik-Karte für Wiedergabeliste tippen. Mit Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D den Gang wechseln und Helligkeit hier auf Auto oder Manuell.",
    userManualChrome: "Seite in Chrome öffnen für die beste Tastenkürzel- und Helligkeitsunterstützung.",
  },
  fr: {
    userManualTitle: "Manuel d’utilisation",
    userManualTeaser:
      "Touchez pour le manuel complet : disposition du tableau de bord, médias, luminosité, navigation et appairage du téléphone.",
    userManualHint:
      "Touchez la carte musique pour la playlist. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D pour la vitesse et réglage luminosité Auto/Manuel ici.",
    userManualChrome: "Ouvrez cette page dans Chrome pour les raccourcis et la luminosité.",
  },
  it: {
    userManualTitle: "Manuale utente",
    userManualTeaser:
      "Tocca per il manuale completo: layout della dashboard, media, luminosità, navigazione e accoppiamento telefono.",
    userManualHint:
      "Tocca la scheda musica per la playlist. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D per la marcia e luminosità Auto/Manuale qui.",
    userManualChrome: "Apri questa pagina in Chrome per scorciatoie e luminosità ottimali.",
  },
  pt: {
    userManualTitle: "Manual do utilizador",
    userManualTeaser:
      "Toque para ver o manual completo: layout do painel, multimédia, brilho, navegação e emparelhamento do telefone.",
    userManualHint:
      "Toque no cartão de música para a playlist. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D para a mudança e brilho Auto/Manual aqui.",
    userManualChrome: "Abra esta página no Chrome para melhores atalhos e brilho.",
  },
  tr: {
    userManualTitle: "Kullanım kılavuzu",
    userManualTeaser:
      "Tam kılavuzu görmek için dokunun: gösterge düzeni, medya, parlaklık, navigasyon ve telefon eşleştirme.",
    userManualHint:
      "Çalma listesi için müzik kartına dokunun. Vites için Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D ve parlaklığı burada Oto/Manuel ayarlayın.",
    userManualChrome: "Kısayol ve parlaklık için bu sayfayı Chrome’da açın.",
  },
  nl: {
    userManualTitle: "Gebruikershandleiding",
    userManualTeaser:
      "Tik voor de volledige handleiding: dashboardindeling, media, helderheid, navigatie en telefoonkoppeling.",
    userManualHint:
      "Tik op de muziekkaart voor de afspeellijst. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D voor versnelling en helderheid Auto/Handmatig hier.",
    userManualChrome: "Open deze pagina in Chrome voor de beste sneltoetsen en helderheid.",
  },
  sv: {
    userManualTitle: "Användarhandbok",
    userManualTeaser:
      "Tryck för full handbok: instrumentlayout, media, ljusstyrka, navigering och telefonparkoppling.",
    userManualHint:
      "Tryck på musikkortet för spellistan. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D för växel och ljusstyrka Auto/Manuell här.",
    userManualChrome: "Öppna sidan i Chrome för bäst kortkommandon och ljusstyrka.",
  },
  pl: {
    userManualTitle: "Instrukcja obsługi",
    userManualTeaser:
      "Dotknij, aby zobaczyć pełną instrukcję: układ pulpitu, multimedia, jasność, nawigacja i parowanie telefonu.",
    userManualHint:
      "Dotknij karty muzyki, by otworzyć playlistę. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D zmienia bieg; jasność Auto/Ręcznie tutaj.",
    userManualChrome: "Otwórz tę stronę w Chrome dla najlepszych skrótów i jasności.",
  },
  uk: {
    userManualTitle: "Посібник користувача",
    userManualTeaser:
      "Натисніть для повного посібника: макет панелі, медіа, яскравість, навігація та підключення телефону.",
    userManualHint:
      "Торкніться картки музики для плейлиста. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D — передача; яскравість Авто/Вручну тут.",
    userManualChrome: "Відкрийте сторінку в Chrome для найкращих гарячих клавіш і яскравості.",
  },
  fa: {
    userManualTitle: "راهنمای کاربر",
    userManualTeaser:
      "برای دیدن راهنمای کامل ضربه بزنید: چیدمان داشبورد، رسانه، روشنایی، مسیریابی و اتصال تلفن.",
    userManualHint:
      "روی کارت موسیقی برای پلی‌لیست بزنید. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D برای دنده و روشنایی خودکار/دستی اینجا.",
    userManualChrome: "این صفحه را در Chrome باز کنید تا میانبر و روشنایی بهتر شود.",
  },
  bn: {
    userManualTitle: "ব্যবহারকারীর ম্যানুয়াল",
    userManualTeaser:
      "সম্পূর্ণ ম্যানুয়াল দেখতে ট্যাপ করুন: ড্যাশবোর্ড, মিডিয়া, উজ্জ্বলতা, ন্যাভিগেশন এবং ফোন পেয়ারিং।",
    userManualHint:
      "প্লেলিস্টের জন্য সঙ্গীত কার্ডে ট্যাপ করুন। গিয়ারের জন্য Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D এবং উজ্জ্বলতা অটো/ম্যানুয়াল এখানে।",
    userManualChrome: "শর্টকাট ও উজ্জ্বলতার জন্য Chrome এ এই পৃষ্ঠা খুলুন।",
  },
  ur: {
    userManualTitle: "صارف دستی",
    userManualTeaser:
      "مکمل دستی دیکھنے کیلئے ٹیپ کریں: ڈیش بورڈ، میڈیا، چمک، نیویگیشن اور فون جوڑنا۔",
    userManualHint:
      "پلے لسٹ کیلئے موسیقی کارڈ پر ٹیپ کریں۔ گیئر کیلئے Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D اور چمک آٹو/مینول یہاں۔",
    userManualChrome: "شارٹ کٹ اور چمک کیلئے Chrome میں یہ صفحہ کھولیں۔",
  },
  fil: {
    userManualTitle: "Manwal ng gumagamit",
    userManualTeaser:
      "I-tap para sa buong manwal: layout ng dashboard, media, liwanag, navigation, at pag-link ng telepono.",
    userManualHint:
      "I-tap ang music card para sa playlist. Ctrl+P / Ctrl+R / Ctrl+N / Ctrl+D para sa gear, at liwanag Auto/Manual dito.",
    userManualChrome: "Buksan ang pahinang ito sa Chrome para sa pinakamahusay na shortcut at suporta sa liwanag.",
  },
};

export function applyLocalizedUserManuals(resources: Record<string, { translation: Record<string, unknown> }>) {
  for (const [lng, manual] of Object.entries(USER_MANUAL_BY_LANG)) {
    const tr = resources[lng]?.translation;
    if (!tr) continue;
    if (!tr.settings) tr.settings = {};
    const st = tr.settings as Record<string, unknown>;
    st.manual = structuredClone(manual);
    const ui = USER_MANUAL_UI_BY_LANG[lng];
    if (ui) Object.assign(st, ui);
  }
}
