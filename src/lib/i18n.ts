import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.about": "About",
      "nav.gallery": "Gallery", 
      "nav.vendors": "Vendors",
      "nav.contact": "Contact",
      "nav.wine": "Wine Staircase",
      "nav.lounge": "Lounge",
      "nav.virtualTour": "3D Tour",
      "nav.events": "Events",
      
      // Hero Section
      "hero.title": "ODE Food Hall",
      "hero.subtitle": "ODE to Origins. Taste the Journey.",
      "hero.description": "",
      "hero.location": "",
      "hero.bookExperience": "START YOUR TASTE QUEST",
      "hero.exploreMenu": "Taste Compass 2.0", 
      "hero.wineTasting": "Wine & Light Staircase",
      "hero.virtualTour": "3D Virtual Tour",
      "hero.scrollToExplore": "Scroll to explore",
      "hero.cards.earth": "Tri Hita Karana: harmony with nature",
      "hero.cards.journey": "GastroVillage — Roots & Routes",
      "hero.cards.night": "Wine & Light Staircase",
      "hero.cards.bali": "70%+ local ingredients",
      
      // About Section
      "about.philosophy": "Philosophy",
      "about.description": "Back to Origin. Forward to Yourself. Farm → Kitchen → Your Table. Local farmers grow it. Our chefs cook it the same day. You taste real Bali—nothing extra, just fresh.",
      "about.concepts.earth.description": "Tri Hita Karana philosophy: harmony with nature, spiritual world and community",
      "about.concepts.journey.description": "GastroVillage – Roots & Routes of Taste. Exploring 8 taste sectors",
      "about.concepts.night.description": "Space transformation at sunset: wine staircase, sunset terrace",
      "about.concepts.bali.description": "Deep immersion in Balinese culture: 70%+ local ingredients",
      "about.concepts.compass.description": "8 taste sectors: from fermentation to umami, from spices to zero-waste",
      "about.concepts.lab.description": "Nothing artificial. Just ODE. Molecular mixology without alcohol with local herbs",
      "about.cta.title": "\"Taste real. Feel home.\"",
      "about.cta.description": "Ready for a journey through 8 taste sectors? Start your Taste Quest today.",
      
      // Contact Section
      "contact.title": "Contact",
      "contact.description": "Contact us for table reservations, event organization or any questions",
      "contact.address": "Address",
      "contact.phone": "Phone",
      "contact.email": "Email",
      "contact.hours": "Hours",
      "contact.form.name": "Name",
      "contact.form.email": "Email",
      "contact.form.phone": "Phone",
      "contact.form.message": "Message",
      "contact.form.send": "Send Message",
      "contact.form.success": "Message Sent",
      "contact.form.successDesc": "We will contact you shortly.",
      "contact.form.error": "Error",
      "contact.form.errorDesc": "Failed to send message. Please try again later.",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.close": "Close",
      
      
      // Menu
      "menu.title": "Our Culinary Menu",
      
      // Order
      "order.title": "Order Online",
      
      // Partnership
      "partnership.title": "Breakfast for Villas & BnBs",
      "partnership.description": "Breakfast service for villas and hotels"
    }
  },
  zh: {
    translation: {
      // Navigation
      "nav.home": "首页",
      "nav.about": "关于我们",
      "nav.gallery": "画廊", 
      "nav.vendors": "美食角",
      "nav.contact": "联系我们",
      "nav.wine": "葡萄酒楼梯",
      "nav.lounge": "休息室",
      "nav.virtualTour": "3D游览",
      "nav.events": "活动",
      
      // Hero Section
      "hero.title": "ODE美食广场",
      "hero.subtitle": "ODE致敬起源。品味旅程。",
      "hero.description": "\"回归本源。向前成就自我。\"在人工的世界里，ODE回归真实。",
      "hero.location": "乌布，巴厘岛 | 开业：2025年12月1日 | 1,800平方米",
      "hero.bookExperience": "开始您的味觉探索",
      "hero.exploreMenu": "味觉指南针2.0",
      "hero.wineTasting": "酒与光楼梯",
      "hero.virtualTour": "3D虚拟游览",
      "hero.scrollToExplore": "滚动探索",
      "hero.cards.earth": "Tri Hita Karana：与自然和谐",
      "hero.cards.journey": "美食村庄——根源与路线",
      "hero.cards.night": "酒与光楼梯",
      "hero.cards.bali": "70%以上本地食材",
      
      // About Section
      "about.philosophy": "哲学",
      "about.description": "回归本源。向前成就自我。农场 → 厨房 → 您的餐桌。当地农民种植。我们的厨师当天烹饪。您品尝真正的巴厘岛——没有多余，只有新鲜。",
      "about.concepts.earth.description": "Tri Hita Karana哲学：与自然、精神世界和社区和谐",
      "about.concepts.journey.description": "美食村庄——味觉的根源与路线。探索8个味觉扇区",
      "about.concepts.night.description": "空间随日落转变：酒楼梯，日落露台",
      "about.concepts.bali.description": "深度沉浸巴厘文化：70%以上本地食材",
      "about.concepts.compass.description": "8个味觉扇区：从发酵到鲜味，从香料到零浪费",
      "about.concepts.lab.description": "无人工添加。只有ODE。本地草药分子调酒学不含酒精",
      "about.cta.title": "\"品味真实。感受家的温暖。\"",
      "about.cta.description": "准备好踏上8个味觉扇区的旅程吗？今天就开始您的味觉探索。",
      
      // Contact Section
      "contact.title": "联系我们",
      "contact.description": "联系我们预订桌位、组织活动或任何问题",
      "contact.address": "地址",
      "contact.phone": "电话",
      "contact.email": "邮箱",
      "contact.hours": "营业时间",
      "contact.form.name": "姓名",
      "contact.form.email": "邮箱",
      "contact.form.phone": "电话",
      "contact.form.message": "信息",
      "contact.form.send": "发送信息",
      "contact.form.success": "信息已发送",
      "contact.form.successDesc": "我们将很快与您联系。",
      "contact.form.error": "错误",
      "contact.form.errorDesc": "发送信息失败。请稍后再试。",
      
      // Common
      "common.loading": "加载中...",
      "common.error": "错误",
      "common.close": "关闭",
      
      
      // Menu
      "menu.title": "我们的美食菜单",
      
      // Order
      "order.title": "在线订餐",
      
      // Partnership
      "partnership.title": "别墅和B&B早餐服务",
      "partnership.description": "为别墅和酒店提供早餐服务"
    }
  },
  es: {
    translation: {
      // Navigation
      "nav.home": "Inicio",
      "nav.about": "Acerca de",
      "nav.gallery": "Galería",
      "nav.vendors": "Vendedores",
      "nav.contact": "Contacto",
      "nav.wine": "Escalera de Vinos",
      "nav.lounge": "Salón",
      "nav.virtualTour": "Tour 3D",
      "nav.events": "Eventos",
      
      // Hero Section
      "hero.title": "ODE FOOD HALL GASTRO VILLAGE UBUD",
      "hero.subtitle": "ODE a los Orígenes. Saborea el Viaje.",
      "hero.description": "\"De Vuelta al Origen. Hacia Ti Mismo.\" En un mundo artificial, ODE devuelve lo que es real.",
      "hero.location": "Ubud, Bali | Apertura: 1 de diciembre de 2025 | 1,800 m²",
      "hero.bookExperience": "COMIENZA TU BÚSQUEDA DEL SABOR",
      "hero.exploreMenu": "Brújula del Sabor 2.0",
      "hero.wineTasting": "Escalera de Vino y Luz",
      "hero.virtualTour": "Tour Virtual 3D",
      "hero.scrollToExplore": "Desplázate para explorar",
      "hero.cards.earth": "Tri Hita Karana: armonía con la naturaleza",
      "hero.cards.journey": "GastroVillage — Raíces y Rutas",
      "hero.cards.night": "Escalera de Vino y Luz",
      "hero.cards.bali": "70%+ ingredientes locales",
      
      // About Section
      "about.philosophy": "Filosofía",
      "about.description": "De Vuelta al Origen. Hacia Ti Mismo. Granja → Cocina → Tu Mesa. Los agricultores locales lo cultivan. Nuestros chefs lo cocinan el mismo día. Pruebas el verdadero Bali—nada extra, solo fresco.",
      "about.concepts.earth.description": "Filosofía Tri Hita Karana: armonía con la naturaleza, mundo espiritual y comunidad",
      "about.concepts.journey.description": "GastroVillage – Raíces y Rutas del Sabor. Explorando 8 sectores del sabor",
      "about.concepts.night.description": "Transformación del espacio al atardecer: escalera de vino, terraza del atardecer",
      "about.concepts.bali.description": "Inmersión profunda en la cultura balinesa: 70%+ ingredientes locales",
      "about.concepts.compass.description": "8 sectores del sabor: desde la fermentación hasta el umami, desde las especias hasta el desperdicio cero",
      "about.concepts.lab.description": "Nada artificial. Solo ODE. Mixología molecular sin alcohol con hierbas locales",
      "about.cta.title": "\"Saborea lo real. Siéntete en casa.\"",
      "about.cta.description": "¿Listo para un viaje a través de 8 sectores del sabor? Comienza tu Búsqueda del Sabor hoy.",
      
      // Contact Section
      "contact.title": "Contacto",
      "contact.description": "Contáctanos para reservas de mesa, organización de eventos o cualquier pregunta",
      "contact.address": "Dirección",
      "contact.phone": "Teléfono",
      "contact.email": "Email",
      "contact.hours": "Horarios",
      "contact.form.name": "Nombre",
      "contact.form.email": "Email",
      "contact.form.phone": "Teléfono",
      "contact.form.message": "Mensaje",
      "contact.form.send": "Enviar Mensaje",
      "contact.form.success": "Mensaje Enviado",
      "contact.form.successDesc": "Te contactaremos pronto.",
      "contact.form.error": "Error",
      "contact.form.errorDesc": "Error al enviar mensaje. Inténtalo más tarde.",
      
      // Common
      "common.loading": "Cargando...",
      "common.error": "Error",
      "common.close": "Cerrar",
      
      
      // Menu
      "menu.title": "Nuestro Menú Culinario",
      
      // Order
      "order.title": "Pedido en Línea",
      
      // Partnership
      "partnership.title": "Desayuno para Villas & B&Bs",
      "partnership.description": "Servicio de desayuno para villas y hoteles"
    }
  },
  de: {
    translation: {
      // Navigation
      "nav.home": "Startseite",
      "nav.about": "Über uns",
      "nav.gallery": "Galerie",
      "nav.vendors": "Anbieter",
      "nav.contact": "Kontakt",
      "nav.wine": "Weintreppe",
      "nav.lounge": "Lounge",
      "nav.virtualTour": "3D Tour",
      "nav.events": "Veranstaltungen",
      
      // Hero Section
      "hero.title": "ODE FOOD HALL GASTRO VILLAGE UBUD",
      "hero.subtitle": "ODE an die Ursprünge. Schmecke die Reise.",
      "hero.description": "\"Zurück zum Ursprung. Vorwärts zu Dir Selbst.\" In einer Welt des Künstlichen kehrt ODE zum Echten zurück.",
      "hero.location": "Ubud, Bali | Eröffnung: 1. Dezember 2025 | 1,800 m²",
      "hero.bookExperience": "STARTE DEINE GESCHMACKSQUEST",
      "hero.exploreMenu": "Geschmackskompass 2.0",
      "hero.wineTasting": "Wein- und Lichttreppe",
      "hero.virtualTour": "3D Virtuelle Tour",
      "hero.scrollToExplore": "Scrollen zum Erkunden",
      "hero.cards.earth": "Tri Hita Karana: Harmonie mit der Natur",
      "hero.cards.journey": "GastroDorf — Wurzeln und Wege",
      "hero.cards.night": "Wein- und Lichttreppe",
      "hero.cards.bali": "70%+ lokale Zutaten",
      
      // About Section
      "about.philosophy": "Philosophie",
      "about.description": "Zurück zum Ursprung. Vorwärts zu Dir Selbst. Bauernhof → Küche → Dein Tisch. Lokale Bauern bauen es an. Unsere Köche kochen es am selben Tag. Du schmeckst das echte Bali—nichts extra, nur frisch.",
      "about.concepts.earth.description": "Tri Hita Karana Philosophie: Harmonie mit Natur, spiritueller Welt und Gemeinschaft",
      "about.concepts.journey.description": "GastroDorf – Wurzeln und Wege des Geschmacks. Erkundung von 8 Geschmackssektoren",
      "about.concepts.night.description": "Raumtransformation bei Sonnenuntergang: Weintreppe, Sonnenuntergangsterrasse",
      "about.concepts.bali.description": "Tiefe Eintauchung in die balinesische Kultur: 70%+ lokale Zutaten",
      "about.concepts.compass.description": "8 Geschmackssektoren: von Fermentation zu Umami, von Gewürzen zu Zero-Waste",
      "about.concepts.lab.description": "Nichts Künstliches. Nur ODE. Molekulare Mixologie ohne Alkohol mit lokalen Kräutern",
      "about.cta.title": "\"Schmecke das Echte. Fühle dich zu Hause.\"",
      "about.cta.description": "Bereit für eine Reise durch 8 Geschmackssektoren? Starte deine Geschmacksquest heute.",
      
      // Contact Section
      "contact.title": "Kontakt",
      "contact.description": "Kontaktiere uns für Tischreservierungen, Eventorganisation oder Fragen",
      "contact.address": "Adresse",
      "contact.phone": "Telefon",
      "contact.email": "Email",
      "contact.hours": "Öffnungszeiten",
      "contact.form.name": "Name",
      "contact.form.email": "Email",
      "contact.form.phone": "Telefon",
      "contact.form.message": "Nachricht",
      "contact.form.send": "Nachricht Senden",
      "contact.form.success": "Nachricht Gesendet",
      "contact.form.successDesc": "Wir werden uns bald bei Ihnen melden.",
      "contact.form.error": "Fehler",
      "contact.form.errorDesc": "Nachricht konnte nicht gesendet werden. Versuchen Sie es später.",
      
      // Common
      "common.loading": "Laden...",
      "common.error": "Fehler",
      "common.close": "Schließen",
      
      
      // Menu
      "menu.title": "Unser Kulinarisches Menü",
      
      // Order
      "order.title": "Online Bestellen",
      
      // Partnership
      "partnership.title": "Frühstück für Villen & B&Bs",
      "partnership.description": "Frühstücksservice für Villen und Hotels"
    }
  },
  id: {
    translation: {
      // Navigation
      "nav.home": "Beranda",
      "nav.about": "Tentang",
      "nav.gallery": "Galeri",
      "nav.vendors": "Vendor",
      "nav.contact": "Kontak",
      "nav.wine": "Wine Staircase",
      "nav.lounge": "Lounge",
      "nav.virtualTour": "Tur 3D",
      "nav.events": "Acara",
      
      // Hero Section
      "hero.title": "ODE FOOD HALL GASTRO VILLAGE UBUD",
      "hero.subtitle": "ODE untuk Asal-usul. Rasakan Perjalanan.",
      "hero.description": "\"Kembali ke Asal. Maju ke Dirimu.\" Di dunia yang artifisial, ODE mengembalikan yang asli.",
      "hero.location": "Ubud, Bali | Pembukaan: 1 Desember 2025 | 1,800 m²",
      "hero.bookExperience": "MULAI PENCARIAN RASA ANDA",
      "hero.exploreMenu": "Kompas Rasa 2.0",
      "hero.wineTasting": "Wine & Light Staircase",
      "hero.virtualTour": "Tur Virtual 3D",
      "hero.scrollToExplore": "Gulir untuk menjelajah",
      "hero.cards.earth": "Tri Hita Karana: keharmonisan dengan alam",
      "hero.cards.journey": "GastroVillage — Akar & Rute",
      "hero.cards.night": "Wine & Light Staircase",
      "hero.cards.bali": "70%+ bahan lokal",
      
      // About Section
      "about.philosophy": "Filosofi",
      "about.description": "Kembali ke Asal. Maju ke Dirimu. Ladang → Dapur → Meja Anda. Petani lokal menanamnya. Koki kami memasaknya di hari yang sama. Anda merasakan Bali yang asli—tidak ada yang berlebihan, hanya segar.",
      "about.concepts.earth.description": "Filosofi Tri Hita Karana: keharmonisan dengan alam, dunia spiritual dan komunitas",
      "about.concepts.journey.description": "GastroVillage – Akar & Rute Rasa. Menjelajahi 8 sektor rasa",
      "about.concepts.night.description": "Transformasi ruang saat matahari terbenam: tangga wine, teras sunset",
      "about.concepts.bali.description": "Penyelaman mendalam dalam budaya Bali: 70%+ bahan lokal",
      "about.concepts.compass.description": "8 sektor rasa: dari fermentasi hingga umami, dari rempah hingga zero-waste",
      "about.concepts.lab.description": "Tidak ada yang artifisial. Hanya ODE. Mixologi molekuler tanpa alkohol dengan herbal lokal",
      "about.cta.title": "\"Rasakan yang asli. Rasakan rumah.\"",
      "about.cta.description": "Siap untuk perjalanan melalui 8 sektor rasa? Mulai Pencarian Rasa Anda hari ini.",
      
      // Contact Section
      "contact.title": "Kontak",
      "contact.description": "Hubungi kami untuk reservasi meja, organisasi acara atau pertanyaan apa pun",
      "contact.address": "Alamat",
      "contact.phone": "Telepon",
      "contact.email": "Email",
      "contact.hours": "Jam Buka",
      "contact.form.name": "Nama",
      "contact.form.email": "Email",
      "contact.form.phone": "Telepon",
      "contact.form.message": "Pesan",
      "contact.form.send": "Kirim Pesan",
      "contact.form.success": "Pesan Terkirim",
      "contact.form.successDesc": "Kami akan menghubungi Anda segera.",
      "contact.form.error": "Error",
      "contact.form.errorDesc": "Gagal mengirim pesan. Coba lagi nanti.",
      
      // Common
      "common.loading": "Memuat...",
      "common.error": "Error",
      "common.close": "Tutup",
      
      
      // Menu
      "menu.title": "Menu Kuliner Kami",
      
      // Order
      "order.title": "Pesan Online",
      
      // Partnership
      "partnership.title": "Sarapan untuk Villa & B&B",
      "partnership.description": "Layanan sarapan untuk villa dan hotel"
    }
  },
  ms: {
    translation: {
      // Navigation
      "nav.home": "Laman Utama",
      "nav.about": "Mengenai",
      "nav.gallery": "Galeri",
      "nav.vendors": "Vendor",
      "nav.contact": "Hubungi",
      "nav.wine": "Tangga Wain",
      "nav.lounge": "Lounge",
      "nav.virtualTour": "Lawatan 3D",
      "nav.events": "Acara",
      
      // Hero Section
      "hero.title": "ODE FOOD HALL GASTRO VILLAGE UBUD",
      "hero.subtitle": "ODE kepada Asal-usul. Rasa Perjalanan.",
      "hero.description": "\"Kembali ke Asal. Maju ke Diri.\" Di dunia yang tiruan, ODE mengembalikan yang asli.",
      "hero.location": "Ubud, Bali | Pembukaan: 1 Disember 2025 | 1,800 m²",
      "hero.bookExperience": "MULA PENCARIAN RASA ANDA",
      "hero.exploreMenu": "Kompas Rasa 2.0",
      "hero.wineTasting": "Tangga Wain & Cahaya",
      "hero.virtualTour": "Lawatan Virtual 3D",
      "hero.scrollToExplore": "Tatal untuk meneroka",
      "hero.cards.earth": "Tri Hita Karana: keharmonian dengan alam",
      "hero.cards.journey": "GastroVillage — Akar & Laluan",
      "hero.cards.night": "Tangga Wain & Cahaya",
      "hero.cards.bali": "70%+ ramuan tempatan",
      
      // About Section
      "about.philosophy": "Falsafah",
      "about.description": "Kembali ke Asal. Maju ke Diri. Ladang → Dapur → Meja Anda. Petani tempatan menanamnya. Tukang masak kami memasaknya pada hari yang sama. Anda merasai Bali yang asli—tiada yang berlebihan, hanya segar.",
      "about.concepts.earth.description": "Falsafah Tri Hita Karana: keharmonian dengan alam, dunia spiritual dan komuniti",
      "about.concepts.journey.description": "GastroVillage – Akar & Laluan Rasa. Meneroka 8 sektor rasa",
      "about.concepts.night.description": "Transformasi ruang semasa matahari terbenam: tangga wain, teres sunset",
      "about.concepts.bali.description": "Penyelaman mendalam dalam budaya Bali: 70%+ ramuan tempatan",
      "about.concepts.compass.description": "8 sektor rasa: dari penapaian hingga umami, dari rempah hingga sifar sisa",
      "about.concepts.lab.description": "Tiada yang tiruan. Hanya ODE. Mixologi molekul tanpa alkohol dengan herba tempatan",
      "about.cta.title": "\"Rasa yang asli. Rasa rumah.\"",
      "about.cta.description": "Bersedia untuk perjalanan melalui 8 sektor rasa? Mula Pencarian Rasa Anda hari ini.",
      
      // Contact Section
      "contact.title": "Hubungi",
      "contact.description": "Hubungi kami untuk tempahan meja, organisasi acara atau sebarang pertanyaan",
      "contact.address": "Alamat",
      "contact.phone": "Telefon",
      "contact.email": "Email",
      "contact.hours": "Waktu Operasi",
      "contact.form.name": "Nama",
      "contact.form.email": "Email",
      "contact.form.phone": "Telefon",
      "contact.form.message": "Mesej",
      "contact.form.send": "Hantar Mesej",
      "contact.form.success": "Mesej Dihantar",
      "contact.form.successDesc": "Kami akan menghubungi anda tidak lama lagi.",
      "contact.form.error": "Ralat",
      "contact.form.errorDesc": "Gagal menghantar mesej. Cuba lagi kemudian.",
      
      // Common
      "common.loading": "Memuatkan...",
      "common.error": "Ralat",
      "common.close": "Tutup",
      
      
      // Menu
      "menu.title": "Menu Kulinari Kami",
      
      // Order
      "order.title": "Tempah Dalam Talian",
      
      // Partnership
      "partnership.title": "Sarapan untuk Villa & B&B",
      "partnership.description": "Perkhidmatan sarapan untuk villa dan hotel"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'es', 'de', 'id', 'ms'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;