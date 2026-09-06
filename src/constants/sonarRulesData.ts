export interface SonarRuleDetail {
  id: string;
  name: string;
  category: 'Naming' | 'Architecture' | 'Type Safety' | 'Maintainability' | 'Clean Code';
  severity: 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR';
  summary: string;
  explanation: string;
  badCode: string;
  goodCode: string;
  dartLintEquivalent: string;
}

export const SONAR_RULES_LIST: SonarRuleDetail[] = [
  {
    id: 'dart:S101',
    name: 'Class, enum, and typedef names should follow UpperCamelCase',
    category: 'Naming',
    severity: 'MAJOR',
    summary: 'ชื่อของ Class, Enum, Extension และ Typedef ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่ และใช้ UpperCamelCase เสมอ',
    explanation: 'SonarQube และ Dart Style Guide กำหนดให้ Type identifiers ใช้ PascalCase เพื่อแยกความแตกต่างระหว่าง Type และ Instance variables อย่างชัดเจน',
    badCode: `// ❌ Non-Compliant
class user_profile { ... }
class orderResponse { ... }
enum payment_status { pending, success }`,
    goodCode: `// ✅ Compliant
class UserProfile { ... }
class OrderResponse { ... }
enum PaymentStatus { pending, success }`,
    dartLintEquivalent: 'camel_case_types',
  },
  {
    id: 'dart:S117',
    name: 'Field, parameter, and variable names should follow lowerCamelCase',
    category: 'Naming',
    severity: 'MAJOR',
    summary: 'ชื่อตัวแปร, Field, Parameter, Method และ Function ต้องขึ้นต้นด้วยตัวพิมพ์เล็ก และใช้ lowerCamelCase โดยไม่มีเครื่องหมาย _ นำหน้าใน public API',
    explanation: 'การใช้ snake_case ในตัวแปรของ Dart ขัดกับมาตรฐานสากลและทำให้เกิด Lint Warning ใน CI/CD Quality Gate',
    badCode: `// ❌ Non-Compliant
class User {
  final int user_id;
  final String First_Name;
  User({required this.user_id, required this.First_Name});
}`,
    goodCode: `// ✅ Compliant
class User {
  final int userId;
  final String firstName;
  const User({required this.userId, required this.firstName});
}`,
    dartLintEquivalent: 'non_constant_identifier_names',
  },
  {
    id: 'dart:S1104',
    name: 'Constructors of immutable classes should be declared const',
    category: 'Architecture',
    severity: 'MINOR',
    summary: 'เมื่อ Class มี Field ทุกตัวเป็น final ควรประกาศ Constructor ให้เป็น const',
    explanation: 'Flutter Engine จะทำ Compile-time Constant Caching สำหรับ const objects ช่วยประหยัด Memory และลดการ Rebuild ซ้ำซ้อนของ Widget Tree',
    badCode: `// ❌ Non-Compliant
class AppConfig {
  final String baseUrl;
  final int timeout;
  AppConfig({required this.baseUrl, required this.timeout});
}`,
    goodCode: `// ✅ Compliant
@immutable
class AppConfig {
  final String baseUrl;
  final int timeout;
  const AppConfig({required this.baseUrl, required this.timeout});
}`,
    dartLintEquivalent: 'prefer_const_constructors',
  },
  {
    id: 'dart:S1206',
    name: 'Both == and hashCode should be overridden together',
    category: 'Clean Code',
    severity: 'CRITICAL',
    summary: 'หากมีการ Override operator == ต้อง Override getter hashCode เสมอ โดยใช้ Object.hash()',
    explanation: 'หาก Override เพียงตัวใดตัวหนึ่ง คลาสจะไม่สามารถทำงานได้อย่างถูกต้องใน Set, Map หรือ State Management (เช่น Bloc/Riverpod) และใน Dart 3 แนะนำให้ใช้ Object.hash(...) แทน bitwise XOR เพื่อป้องกัน Hash Collision',
    badCode: `// ❌ Non-Compliant (Missing hashCode or using old bitwise XOR)
class Item {
  final String id;
  const Item({required this.id});
  @override
  bool operator ==(Object other) => other is Item && other.id == id;
  // Missing hashCode!
}`,
    goodCode: `// ✅ Compliant (Dart 3 Standard)
class Item {
  final String id;
  const Item({required this.id});

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Item && other.id == id;
  }

  @override
  int get hashCode => Object.hash(id);
}`,
    dartLintEquivalent: 'hash_and_equals',
  },
  {
    id: 'dart:S1905',
    name: 'Avoid unsafe direct number casting from dynamic JSON',
    category: 'Type Safety',
    severity: 'CRITICAL',
    summary: 'หลีกเลี่ยงการ cast `json["price"] as double` ตรงๆ ให้ใช้ `(json["price"] as num?)?.toDouble()` แทน',
    explanation: 'REST API Backend มักส่งตัวเลข integer เช่น 100 มาแทน float 100.0 ซึ่งใน Dart runtime การทำ `100 as double` จะโยน TypeError Crash ทันที การแปลงผ่าน num ปลอดภัย 100%',
    badCode: `// ❌ Non-Compliant (Crashes if backend sends 100 instead of 100.0)
factory Product.fromJson(Map<String, dynamic> json) {
  return Product(
    price: json['price'] as double,
  );
}`,
    goodCode: `// ✅ Compliant (Safely handles both int and double)
factory Product.fromJson(Map<String, dynamic> json) {
  return Product(
    price: (json['price'] as num?)?.toDouble() ?? 0.0,
  );
}`,
    dartLintEquivalent: 'avoid_dynamic_calls',
  },
];
