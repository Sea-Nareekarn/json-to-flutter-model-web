# Flutter Model Generator (SonarQube Compliant) 🚀

เว็บแอปพลิเคชันสำหรับแปลง **JSON เป็น Flutter & Dart Models** ที่การันตีมาตรฐาน **Clean Code & SonarQube Compliance 100%** ไร้ Code Smells, Warnings และ Runtime Type Exceptions

---

## ✨ จุดเด่น & ฟีเจอร์หลัก (Key Features)

1. **SonarQube 100% Clean Code Certified**:
   - `dart:S101` (`camel_case_types`): ชื่อคลาสทั้งหมดเป็น `UpperCamelCase`
   - `dart:S117` (`non_constant_identifier_names`): ชื่อฟิลด์และตัวแปรทั้งหมดเป็น `lowerCamelCase`
   - `dart:S1104` (`prefer_const_constructors`): Constructor เป็น `const` พร้อม named parameters
   - `dart:S1206` (`hash_and_equals`): Override ทั้ง `operator ==` และ `hashCode` คู่กันด้วย `Object.hash(...)` ของ Dart 3
   - `dart:S1905` (`safe_number_and_type_casting`): Safe casting `(json['x'] as num?)?.toInt()` หรือ `?.toDouble()` ป้องกันกรณี Backend ส่ง float/int สลับกันจน App Crash
   - `dart:S107` (`avoid_excessive_parameters`): ใช้ named parameters `{ required this.x }` อ่านง่าย ไม่ซับซ้อน
   - ปลอดภัยต่อ Dart Reserved Keywords (แปลง `default`, `final`, `class`, `case`, `break`, `switch`, `return` ฯลฯ เป็นชื่อที่ถูกต้องอัตโนมัติ)

2. **รองรับ Model Style ยอดนิยม 4 รูปแบบ**:
   - **Pure Dart 3** (แนะนำ): ไม่ต้องติดตั้ง package เพิ่ม, Null-Safety 100%, มาพร้อม `fromJson`, `toJson`, `copyWith`, `toString`, `==`, `hashCode`
   - **Freezed (v2/v3)**: สำหรับโปรเจกต์ที่ใช้ Code Generation ด้วย `@freezed` + `@JsonKey`
   - **JsonSerializable**: รองรับ `@JsonSerializable(explicitToJson: true)` + `_$ModelFromJson`
   - **Equatable**: รองรับ `extends Equatable` พร้อม `props`

3. **Dual-Pane Modern IDE Layout**:
   - **Left Pane (JSON Input)**: Format Beautifier, Minifier, File Uploader, Error Banner พร้อมตัวอย่าง JSON สำเร็จรูป
   - **Right Pane (Dart Viewer)**: Syntax Highlighting, แท็บแยกไฟล์คลาสย่อย, ปุ่ม One-Click Copy, ปุ่ม Download `.dart` และ Download All as `.zip`
   - **SonarQube Quality Inspector Modal**: แสดงรายงานและคะแนน Audit ความสอดคล้องตามกฎ SonarQube แบบเรียลไทม์

---

## 🛠 วิธีเริ่มใช้งาน (Getting Started)

### 1. รันในโหมด Development
```bash
cd /Users/nareekarn/.gemini/antigravity/scratch/json-to-flutter-model-web
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

### 2. รัน Automated Test Suite
```bash
npm test
```

### 3. Build สำหรับ Production / Static Hosting
```bash
npm run build
npm run preview
```
ไฟล์ build ที่พร้อมใช้งานจะอยู่ในโฟลเดอร์ `dist/`

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
json-to-flutter-model-web/
├── src/
│   ├── generator/
│   │   ├── naming.ts               # Sanitization, CamelCase, Reserved words
│   │   ├── typeInference.ts        # Type inference engine & AST parser
│   │   ├── pureDartGenerator.ts    # Pure Dart 3 Generator
│   │   ├── freezedGenerator.ts     # Freezed Generator
│   │   ├── jsonSerializableGenerator.ts # JsonSerializable Generator
│   │   ├── equatableGenerator.ts   # Equatable Generator
│   │   ├── sonarAuditor.ts         # SonarQube static rule auditor
│   │   └── index.ts                # Main Generator entry point
│   ├── components/
│   │   ├── Navbar.tsx              # Top bar, preset picker, theme
│   │   ├── OptionsBar.tsx          # Model style, null safety, toggles
│   │   ├── JsonEditor.tsx          # JSON input with validation & actions
│   │   ├── DartViewer.tsx          # Dart code preview, copy, zip download
│   │   └── SonarModal.tsx          # SonarQube audit breakdown modal
│   ├── constants/
│   │   └── sampleJson.ts           # Realistic presets (E-Commerce, Auth, API, Edge Cases)
│   ├── types/
│   │   └── index.ts                # TypeScript Interfaces & Types
│   ├── test-suite.ts               # Automated verification test suite
│   ├── App.tsx                     # Main App container
│   ├── main.tsx                    # React DOM entry
│   └── index.css                   # Tailwind styles & Prism theme
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```
