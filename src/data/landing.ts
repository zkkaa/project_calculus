// ─────────────────────────────────────────────
//  DATA LANDING PAGE — SIGMA
//  Semua data statis untuk halaman utama
// ─────────────────────────────────────────────

export const SITE_NAME = 'Sigma'
export const SITE_TAGLINE = 'Platform Kalkulus Interaktif'
export const SITE_DESC =
  'platform pembelajaran kalkulus berbasis teknologi yang membantu pengguna memahami konsep secara lebih mudah dan interaktif.'

// ── NAVBAR LINKS (anchor ke section di landing page) ─────────────────
export const NAV_LINKS = [
  { label: 'Tentang',        href: '#tentang' },
  { label: 'Fitur',          href: '#fitur' },
  { label: 'Tim Pengembang', href: '#tim' },
]

// ── MENU HAMBURGER (navigasi ke halaman lain) ────────────────────────
export const HAMBURGER_MENU = [
  { label: 'Home',         href: '/',         icon: 'home' },
  { label: 'Materi',       href: '/materi',   icon: 'book' },
  { label: 'Latihan Soal', href: '/latihan',  icon: 'pencil' },
  { label: 'Games',        href: '/games',    icon: 'gamepad' },
]

// ── FEATURES / FITUR ─────────────────────────────────────────────────
export const FEATURES = [
  {
    icon: '📖',
    title: 'Materi',
    slug: '/materi',
    color: '#3b82f6',      // blue-500
    colorLight: '#eff6ff', // blue-50
    desc:
      'Pelajari konsep kalkulus secara mendalam — dari limit hingga integral — dengan visualisasi interaktif, rumus lengkap, dan grafik yang bisa kamu ubah sendiri.',
    tags: ['Turunan', 'Integral', 'Limit', 'Barisan & Deret'],
  },
  {
    icon: '✏️',
    title: 'Latihan',
    slug: '/latihan',
    color: '#10b981',      // emerald-500
    colorLight: '#ecfdf5', // emerald-50
    desc:
      'Uji kemampuanmu dengan 10 soal per topik bergaya kuis interaktif. Salah? Tenang — ada pembahasan lengkap untuk setiap soal.',
    tags: ['10 Soal/Topik', 'Pembahasan', 'Pilihan Ganda', 'Progress Tracker'],
  },
  {
    icon: '⚔️',
    title: 'Game',
    slug: '/games',
    color: '#8b5cf6',      // violet-500
    colorLight: '#f5f3ff', // violet-50
    desc:
      'Tantang temanmu dalam Kalkulus Duel! Siapa yang lebih dulu menjawab benar, dialah pemenang ronde. Real-time dan seru!',
    tags: ['Multiplayer', 'Real-time', 'Duel 1v1', 'Live Score'],
  },
]

// ── TOPIK MATERI ─────────────────────────────────────────────────────
export const TOPICS = [
  { title: 'Limit',            symbol: 'lim',   desc: 'Fondasi dari kalkulus — memahami nilai pendekatan fungsi.' },
  { title: 'Turunan',          symbol: "f'(x)", desc: 'Laju perubahan fungsi terhadap variabelnya.' },
  { title: 'Integral',         symbol: '∫',     desc: 'Penjumlahan kontinu dan luas di bawah kurva.' },
  { title: 'Barisan & Deret',  symbol: 'Σ',     desc: 'Pola angka dan konvergensi deret tak hingga.' },
  { title: 'Turunan Parsial',  symbol: '∂',     desc: 'Turunan fungsi multivariabel terhadap satu variabel.' },
  { title: 'Aplikasi',         symbol: '📈',    desc: 'Penerapan kalkulus dalam kehidupan nyata & teknik.' },
]

// ── QUOTE ─────────────────────────────────────────────────────────────
export const QUOTE = {
  text: 'Kalkulus mengajarkan bahwa setiap perubahan memiliki makna dan pola. Tidak semua hal bisa dipahami secara instan, karena proses adalah bagian penting dari hasil. Seperti dalam hidup, memahami langkah demi langkah akan membawa kita pada jawaban yang lebih jelas.',
}

// ── HOW IT WORKS ──────────────────────────────────────────────────────
export const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Pilih Topik',
    desc: 'Pilih materi kalkulus yang ingin kamu pelajari — turunan, integral, limit, dan lainnya.',
  },
  {
    num: '02',
    title: 'Pelajari & Latihan',
    desc: 'Baca materi interaktif lengkap dengan visualisasi grafik, lalu uji pemahaman dengan soal latihan.',
  },
  {
    num: '03',
    title: 'Tantang Temanmu',
    desc: 'Sudah paham? Ajak temanmu duel kalkulus! Siapa yang paling cepat dan tepat?',
  },
]

// ── STATS ─────────────────────────────────────────────────────────────
export const STATS = [
  { label: 'Topik Materi',  value: 6,  suffix: '' },
  { label: 'Soal Latihan',  value: 60, suffix: '+' },
  { label: 'Mode Game',     value: 1,  suffix: '' },
]

// ── TEAM MEMBERS ──────────────────────────────────────────────────────
export const MEMBERS = [
  {
    name: 'Muhammad Azka Fakhri Fairuz',
    npm: '257006111019',
    role: 'Lead Project · Designer · Full Stack Developer',
    emoji: '👑',
    isLead: true,
  },
  {
    name: 'Salma Fauziah',
    npm: '257006111020',
    role: 'Designer · Front-End Developer',
    emoji: '🎨',
    isLead: false,
  },
  {
    name: 'Aulia Syakhira Raina Hakim',
    npm: '257006111021',
    role: 'Designer · Front-End Developer',
    emoji: '✨',
    isLead: false,
  },
  {
    name: 'Wildan Nurohim',
    npm: '257006111026',
    role: 'Designer · Front-End Developer',
    emoji: '💻',
    isLead: false,
  },
  {
    name: 'Zaki Khoirullah',
    npm: '257006111028',
    role: 'Designer · Front-End Developer',
    emoji: '🚀',
    isLead: false,
  },
  {
    name: 'Natasya Ibnaty Salsabila',
    npm: '257006111033',
    role: 'Designer · Front-End Developer',
    emoji: '🌟',
    isLead: false,
  },
]

// ── FOOTER ────────────────────────────────────────────────────────────
export const FOOTER = {
  desc: 'platform pembelajaran kalkulus interaktif berbasis teknologi yang tidak membuatmu bosan belajar.',
  year: new Date().getFullYear(),
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  year: string;
  category: string;
  link: string;
}

export const projectsData: Project[] = [
  {
    id: 1,
    title: "Executive Spaces",
    description: "A modern workspace booking platform with real-time availability and seamless payment integration. Built with focus on user experience and performance.",
    image: "/gift/plenger2.webp",
    year: "2024",
    category: "Web App",
    link: "/projects/executive-spaces",
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    description: "Full-featured online store with advanced filtering, cart management, and secure checkout. Optimized for mobile shopping experience.",
    image: "/gift/plenger2.webp",
    year: "2024",
    category: "E-Commerce",
    link: "/projects/ecommerce",
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    description: "Real-time data visualization dashboard with interactive charts and customizable widgets. Designed for business intelligence.",
    image: "/gift/plenger2.webp",
    year: "2023",
    category: "Dashboard",
    link: "/projects/analytics",
  },
  {
    id: 4,
    title: "Social Media App",
    description: "Connect with friends and share moments. Features include real-time messaging, stories, and content recommendations.",
    image: "/gift/plenger2.webp",
    year: "2023",
    category: "Social",
    link: "/projects/social-app",
  },
  {
    id: 5,
    title: "Portfolio CMS",
    description: "Content management system for creative professionals. Drag-and-drop interface with powerful customization options.",
    image: "/gift/plenger2.webp",
    year: "2023",
    category: "CMS",
    link: "/projects/portfolio-cms",
  },
  {
    id: 6,
    title: "Fitness Tracker",
    description: "Track your workouts, nutrition, and progress. AI-powered recommendations and social features to keep you motivated.",
    image: "/gift/plenger2.webp",
    year: "2022",
    category: "Mobile App",
    link: "/projects/fitness-tracker",
  },
];

export const getProjectsByYear = (year: string) => 
  projectsData.filter(p => p.year === year);

export const getProjectsByCategory = (category: string) => 
  projectsData.filter(p => p.category === category);

export const getProjectById = (id: number) => 
  projectsData.find(p => p.id === id);

export const getAllCategories = () => {
  const categories = projectsData.map(p => p.category);
  return Array.from(new Set(categories));
};

export const getAllYears = () => {
  const years = projectsData.map(p => p.year);
  const uniqueYears = Array.from(new Set(years));
  return uniqueYears.sort((a, b) => parseInt(b) - parseInt(a));
};