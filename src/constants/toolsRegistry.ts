export type ToolCategory = 'flutter' | 'serialization' | 'security' | 'utilities';

export interface ToolItem {
  id: string;
  route: string;
  title: string;
  titleTh: string;
  description: string;
  category: ToolCategory;
  badge?: string;
  badgeColor?: 'emerald' | 'cyan' | 'indigo' | 'amber';
  icon: string;
  features: string[];
  popular?: boolean;
}

export const TOOL_CATEGORIES: { id: ToolCategory; name: string; nameTh: string }[] = [
  { id: 'flutter', name: 'Flutter & Dart', nameTh: 'Flutter & Dart Tools' },
  { id: 'serialization', name: 'JSON & Data', nameTh: 'JSON & Data Tools' },
  { id: 'security', name: 'Security & Auth', nameTh: 'ความปลอดภัย & ถอดรหัส' },
  { id: 'utilities', name: 'Developer Utilities', nameTh: 'เครื่องมืออำนวยความสะดวก' },
];

export const TOOLS_REGISTRY: ToolItem[] = [
  {
    id: 'json-to-dart',
    route: '#/json-to-dart',
    title: 'JSON to Flutter Model',
    titleTh: 'แปลง JSON เป็น Flutter Model',
    description: 'แปลง JSON เป็น Dart Model คุณภาพสูง 100% SonarQube & Clean Code Certified รองรับ Pure Dart 3, Freezed, JsonSerializable และ Equatable',
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
    category: 'flutter',
    badge: 'Clean Code',
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
    id: 'json-formatter',
    route: '#/json-formatter',
    title: 'JSON Formatter & Validator',
    titleTh: 'จัดรูปแบบ & ตรวจสอบ JSON',
    description: 'จัดระเบียบ JSON ให้สวยงาม (Beautify 2/4 spaces), ย่อไฟล์ (Minify), เรียงลำดับ Keys ตามตัวอักษร และตรวจสอบ Syntax Error แบบเรียลไทม์',
    category: 'serialization',
    badge: 'Fast & Offline',
    badgeColor: 'indigo',
    icon: 'FileCode2',
    popular: true,
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
    category: 'security',
    badge: 'Client-Side Safe',
    badgeColor: 'amber',
    icon: 'KeyRound',
    popular: true,
    features: [
      'ถอดรหัส JWT Payload & เช็คเวลาหมดอายุ',
      'Base64 Text/Binary Encode & Decode',
      'URL Encode & Decode ปลอดภัย',
      'ทำงานแบบ Offline 100% ปลอดภัยต่อข้อมูลความลับ',
    ],
  },
  {
    id: 'sonarqube-rules',
    route: '#/sonarqube-rules',
    title: 'Dart SonarQube Rules Knowledge Base',
    titleTh: 'คลังความรู้ SonarQube Rules สำหรับ Dart',
    description: 'สารบัญและคู่มือรวมกฎ SonarQube & Dart Analyzer ที่พบบ่อย พร้อมคำอธิบายสาเหตุ และตัวอย่างโค้ด เปรียบเทียบ Non-Compliant vs Compliant',
    category: 'flutter',
    badge: 'Knowledge',
    badgeColor: 'emerald',
    icon: 'ShieldCheck',
    features: [
      'รวมกฎ S101, S117, S1104, S1206, S1905, S3776',
      'ตัวอย่างโค้ด Good vs Bad ชัดเจน',
      'เทคนิคการเขียน Flutter Clean Architecture',
      'แนวทางผ่าน Quality Gate ในองค์กร',
    ],
  },
];
