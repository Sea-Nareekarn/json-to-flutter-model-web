export type PlatformType = 'mobile' | 'web' | 'shared';
export type ToolCategory = 'flutter' | 'nextjs' | 'serialization' | 'security' | 'utilities';

export interface ToolItem {
  id: string;
  route: string;
  title: string;
  titleTh: string;
  description: string;
  platform: PlatformType;
  category: ToolCategory;
  badge?: string;
  badgeColor?: 'emerald' | 'cyan' | 'indigo' | 'amber' | 'violet';
  icon: string;
  features: string[];
  popular?: boolean;
}

export const PLATFORMS: { id: PlatformType | 'all'; name: string; nameTh: string; icon: string }[] = [
  { id: 'all', name: 'All Tools', nameTh: 'เครื่องมือทั้งหมด', icon: 'Layers' },
  { id: 'mobile', name: 'Mobile (Flutter)', nameTh: '📱 Mobile (Flutter)', icon: 'Smartphone' },
  { id: 'web', name: 'Web (Next.js)', nameTh: '🌐 Web (Next.js & React)', icon: 'Globe' },
  { id: 'shared', name: 'General Utilities', nameTh: '🛠️ เครื่องมือทั่วไป', icon: 'Wrench' },
];

export const TOOLS_REGISTRY: ToolItem[] = [
  // ==================== MOBILE (FLUTTER) TOOLS ====================
  {
    id: 'sonar-linter',
    route: '#/sonar-linter',
    title: 'SonarQube Code Checker & Linter',
    titleTh: 'เช็คโค้ด & แสดง SonarQube Issues รายบรรทัด',
    description: 'วางโค้ด Dart / Flutter เพื่อตรวจจับและวิเคราะห์ Code Smells, Bugs และ Warnings ของ SonarQube แบบรายบรรทัด พร้อมคำแนะนำวิธีแก้และ Auto-Fix',
    platform: 'mobile',
    category: 'flutter',
    badge: 'Line-by-Line Inspector',
    badgeColor: 'emerald',
    icon: 'ShieldCheck',
    popular: true,
    features: [
      'ตรวจจับ Issues แบบรายบรรทัด (Line-by-Line Gutter)',
      'ครอบคลุมกฎ S101, S117, S1104, S1206, S1905, S1186',
      'Quality Gate Score คำนวณความสอดคล้องแบบ Real-time',
      'ปุ่ม Auto-Fix ช่วยแก้ไขโค้ดที่ผิดให้อัตโนมัติในคลิกเดียว',
    ],
  },
  {
    id: 'json-to-dart',
    route: '#/json-to-dart',
    title: 'JSON to Flutter Model',
    titleTh: 'แปลง JSON เป็น Flutter Model',
    description: 'แปลง JSON เป็น Dart Model คุณภาพสูง 100% SonarQube & Clean Code Certified รองรับ Pure Dart 3, Freezed, JsonSerializable และ Equatable',
    platform: 'mobile',
    category: 'flutter',
    badge: 'SonarQube 100%',
    badgeColor: 'emerald',
    icon: 'Zap',
    popular: true,
    features: [
      'SonarQube Rules S101, S117, S1104, S1206',
      'Dart 3 Null-Safety & const constructor',
      'Safe num? casting ป้องกัน Runtime Error',
      'รองรับ Freezed & JsonSerializable',
    ],
  },
  {
    id: 'flutter-assets',
    route: '#/flutter-assets',
    title: 'Flutter Colors & Assets Generator',
    titleTh: 'สร้าง AppColors & AppAssets',
    description: 'แปลงรหัสสี HEX / RGB / Palette และ Asset Paths ให้เป็น Dart Class สำเร็จรูป (`AppColors`, `AppAssets`) ไร้ข้อผิดพลาดจากการพิมพ์ String ผิด',
    platform: 'mobile',
    category: 'flutter',
    badge: 'Flutter Clean Code',
    badgeColor: 'cyan',
    icon: 'Palette',
    popular: true,
    features: [
      'สร้าง static const Color สำหรับ Flutter',
      'รองรับ HEX (#1B74E4), Color(0xFF...)',
      'สร้าง AppAssets คลาสสำหรับ images/svgs',
      'คัดลอกโค้ด Dart ได้ทันทีในคลิกเดียว',
    ],
  },
  {
    id: 'sonarqube-rules',
    route: '#/sonarqube-rules',
    title: 'Dart SonarQube Rules Knowledge Base',
    titleTh: 'คลังความรู้ SonarQube Rules สำหรับ Dart',
    description: 'สารบัญและคู่มือรวมกฎ SonarQube & Dart Analyzer ที่พบบ่อย พร้อมคำอธิบายสาเหตุ และตัวอย่างโค้ด เปรียบเทียบ Non-Compliant vs Compliant',
    platform: 'mobile',
    category: 'flutter',
    badge: 'Mobile Guide',
    badgeColor: 'emerald',
    icon: 'ShieldCheck',
    features: [
      'รวมกฎ S101, S117, S1104, S1206, S1905, S3776',
      'ตัวอย่างโค้ด Good vs Bad ชัดเจน',
      'เทคนิคการเขียน Flutter Clean Architecture',
      'แนวทางผ่าน Quality Gate ในองค์กร',
    ],
  },

  // ==================== WEB (NEXT.JS) TOOLS ====================
  {
    id: 'json-to-typescript',
    route: '#/json-to-typescript',
    title: 'JSON to TypeScript & Zod Schema',
    titleTh: 'แปลง JSON เป็น TypeScript & Zod',
    description: 'แปลง JSON เป็น TypeScript Interface / Type และ Zod Validation Schema สำหรับ Next.js App Router, Server Actions และ API Routes',
    platform: 'web',
    category: 'nextjs',
    badge: 'Next.js 15 Ready',
    badgeColor: 'violet',
    icon: 'Code2',
    popular: true,
    features: [
      'สร้าง TypeScript Interfaces แบบ Strict Type',
      'สร้าง Zod Schema (`z.object({...})`) อัตโนมัติ',
      'รองรับ Nested Objects และ Array types',
      'เหมาะสำหรับ Next.js Server Actions & API',
    ],
  },
  {
    id: 'nextjs-tailwind',
    route: '#/nextjs-tailwind',
    title: 'Tailwind CSS & Theme Generator',
    titleTh: 'สร้าง Tailwind Theme & Color Tokens',
    description: 'แปลง Color Palette เป็น config ใน `tailwind.config.ts` และ CSS Variables (`:root { --primary: ... }`) สำหรับ Next.js โปรเจกต์',
    platform: 'web',
    category: 'nextjs',
    badge: 'Tailwind v3/v4',
    badgeColor: 'cyan',
    icon: 'Brush',
    popular: true,
    features: [
      'สร้าง tailwind.config.ts theme.colors',
      'สร้าง CSS Variables (:root theme)',
      'รองรับ HEX, HSL, RGB palette',
      'คัดลอกใส่ Next.js ได้ทันที',
    ],
  },
  {
    id: 'svg-to-react',
    route: '#/svg-to-react',
    title: 'SVG to Next.js / React JSX Component',
    titleTh: 'แปลง SVG เป็น React/Next.js Component',
    description: 'แปลงโค้ด SVG ดิบให้กลายเป็น React / Next.js Component (JSX/TSX) ปรับขนาด สี (currentColor) และรองรับ props SVGAttributes',
    platform: 'web',
    category: 'nextjs',
    badge: 'React & TSX',
    badgeColor: 'indigo',
    icon: 'FileCode2',
    features: [
      'แปลง attributes (class->className, kebab-case->camelCase)',
      'รองรับ TypeScript Props interface',
      'ตั้งค่า currentColor สำหรับ dynamic icons',
      'พร้อม Import ใช้งานใน Next.js',
    ],
  },

  // ==================== SHARED UTILITIES ====================
  {
    id: 'json-formatter',
    route: '#/json-formatter',
    title: 'JSON Formatter & Validator',
    titleTh: 'จัดรูปแบบ & ตรวจสอบ JSON',
    description: 'จัดระเบียบ JSON ให้สวยงาม (Beautify 2/4 spaces), ย่อไฟล์ (Minify), เรียงลำดับ Keys ตามตัวอักษร และตรวจสอบ Syntax Error แบบเรียลไทม์',
    platform: 'shared',
    category: 'serialization',
    badge: 'Fast & Offline',
    badgeColor: 'indigo',
    icon: 'FileCode2',
    features: [
      'Beautify & Minify รวดเร็ว',
      'Alphabetical Key Sorting',
      'ตรวจจับ Error พร้อมชี้บรรทัดและคอลัมน์',
      'คำนวณขนาดและสถิติตัวแปร',
    ],
  },
  {
    id: 'jwt-decoder',
    route: '#/jwt-decoder',
    title: 'JWT, Base64 & URL Hub',
    titleTh: 'ถอดรหัส JWT & แปลง Base64',
    description: 'เครื่องมือถอดรหัส JSON Web Token (JWT Header, Payload, Expiration Date), แปลง Base64 Encode/Decode และ URL Encode/Decode ในที่เดียว',
    platform: 'shared',
    category: 'security',
    badge: 'Client-Side Safe',
    badgeColor: 'amber',
    icon: 'KeyRound',
    features: [
      'ถอดรหัส JWT Payload & เช็คเวลาหมดอายุ',
      'Base64 Text/Binary Encode & Decode',
      'URL Encode & Decode ปลอดภัย',
      'ทำงานแบบ Offline 100% ปลอดภัยต่อข้อมูลความลับ',
    ],
  },
];
