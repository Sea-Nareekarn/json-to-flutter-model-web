export type IssueSeverity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';

export interface SonarIssue {
  id: string;
  lineNumber: number;
  column?: number;
  severity: IssueSeverity;
  ruleId: string;
  ruleName: string;
  title: string;
  message: string;
  explanation: string;
  offendingText: string;
  suggestedFix?: string;
  category: 'Naming' | 'Architecture' | 'Type Safety' | 'Clean Code' | 'Maintainability';
}

export interface LintReport {
  issues: SonarIssue[];
  totalIssues: number;
  blockerCount: number;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  infoCount: number;
  complianceScore: number;
  qualityGate: 'PASSED' | 'FAILED';
  linesCount: number;
}

export class SonarDartLinter {
  public static analyze(code: string): LintReport {
    const lines = code.split('\n');
    const issues: SonarIssue[] = [];

    let hasEqualsOverride = false;
    let equalsLine = -1;
    let hasHashCodeOverride = false;
    let currentClassName = '';
    let classFields: { name: string; isFinal: boolean; line: number }[] = [];
    let classHasConstConstructor = false;
    let classHasNonConstConstructor = false;
    let nonConstConstructorLine = -1;

    for (let i = 0; i < lines.length; i++) {
      const lineNum = i + 1;
      const line = lines[i];
      const trimmed = line.trim();

      // Skip empty or comment-only lines for general checks
      if (!trimmed || trimmed.startsWith('//') && !trimmed.includes('TODO') && !trimmed.includes('FIXME')) {
        continue;
      }

      // 1. dart:S1135 - TODO / FIXME Comments
      if (trimmed.includes('// TODO') || trimmed.includes('// FIXME') || trimmed.includes('//TODO') || trimmed.includes('//FIXME')) {
        issues.push({
          id: `todo-${lineNum}`,
          lineNumber: lineNum,
          severity: 'INFO',
          ruleId: 'dart:S1135',
          ruleName: 'todo_comments',
          category: 'Maintainability',
          title: 'Complete the task associated with this TODO comment',
          message: 'พบ TODO / FIXME comment ที่ค้างอยู่ในโค้ด',
          explanation: 'SonarQube แนะนำให้จัดการงานที่ค้างไว้หรือเปิด Issue ติดตามใน Project Backlog แทนการทิ้ง TODO ในโค้ด',
          offendingText: trimmed,
        });
      }

      // 2. Class Declaration & dart:S101 (camel_case_types)
      const classMatch = line.match(/\bclass\s+([a-zA-Z0-9_$]+)/);
      if (classMatch) {
        currentClassName = classMatch[1];
        classFields = [];
        classHasConstConstructor = false;
        classHasNonConstConstructor = false;
        nonConstConstructorLine = -1;

        // Check if class name is not UpperCamelCase (starts with lowercase or has underscores)
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(currentClassName)) {
          const suggested = currentClassName
            .replace(/^_+/, '')
            .replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
            .replace(/^[a-z]/, (c) => c.toUpperCase());

          issues.push({
            id: `class-naming-${lineNum}`,
            lineNumber: lineNum,
            severity: 'MAJOR',
            ruleId: 'dart:S101',
            ruleName: 'camel_case_types',
            category: 'Naming',
            title: 'Class names should follow UpperCamelCase convention',
            message: `ชื่อคลาส "${currentClassName}" ไม่ถูกต้องตามเกณฑ์ UpperCamelCase`,
            explanation: `SonarQube และ Dart Style Guide กำหนดให้ชื่อ Class ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่และไม่มี underscore`,
            offendingText: classMatch[0],
            suggestedFix: `class ${suggested}`,
          });
        }
      }

      // Enum Declaration & dart:S101
      const enumMatch = line.match(/\benum\s+([a-zA-Z0-9_$]+)/);
      if (enumMatch) {
        const enumName = enumMatch[1];
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(enumName)) {
          const suggested = enumName
            .replace(/^_+/, '')
            .replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
            .replace(/^[a-z]/, (c) => c.toUpperCase());

          issues.push({
            id: `enum-naming-${lineNum}`,
            lineNumber: lineNum,
            severity: 'MAJOR',
            ruleId: 'dart:S101',
            ruleName: 'camel_case_types',
            category: 'Naming',
            title: 'Enum names should follow UpperCamelCase convention',
            message: `ชื่อ Enum "${enumName}" ไม่ถูกต้องตามเกณฑ์ UpperCamelCase`,
            explanation: 'ชื่อ Enum ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่และใช้ UpperCamelCase เสมอ',
            offendingText: enumMatch[0],
            suggestedFix: `enum ${suggested}`,
          });
        }
      }

      // 3. Field & Variable Declaration: dart:S117 (non_constant_identifier_names)
      // Matches fields like: final int user_id; or String First_Name; or var is_done = true;
      const fieldRegex = /\b(?:final|var|const|[A-Z][a-zA-Z0-9_<>?]*|int\??|double\??|String\??|bool\??)\s+([a-zA-Z0-9_$]+)\s*(?:=|;|,|\))/g;
      let match: RegExpExecArray | null;
      while ((match = fieldRegex.exec(line)) !== null) {
        const varName = match[1];
        // Ignore keywords, special overrides, constructor declarations, or UPPER_CASE constants
        if (
          varName === 'fromJson' ||
          varName === 'toJson' ||
          varName === 'copyWith' ||
          varName === 'toString' ||
          varName === currentClassName ||
          /^[A-Z0-9_]+$/.test(varName) // Constants like MY_CONST are allowed by some rules
        ) {
          continue;
        }

        // Check if field has snake_case or starts with uppercase or has symbols
        if (!/^[a-z][a-zA-Z0-9]*$/.test(varName)) {
          const suggested = varName
            .replace(/^_+/, '')
            .replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase())
            .replace(/^[A-Z]/, (c) => c.toLowerCase());

          issues.push({
            id: `field-naming-${lineNum}-${match.index}`,
            lineNumber: lineNum,
            column: match.index + 1,
            severity: 'MAJOR',
            ruleId: 'dart:S117',
            ruleName: 'non_constant_identifier_names',
            category: 'Naming',
            title: 'Variable and field names should follow lowerCamelCase',
            message: `ชื่อตัวแปร "${varName}" ไม่ตรงตามมาตรฐาน lowerCamelCase`,
            explanation: `SonarQube ห้ามใช้ snake_case หรือตัวพิมพ์ใหญ่นำหน้าในตัวแปร/ฟิลด์`,
            offendingText: varName,
            suggestedFix: suggested,
          });
        }
      }

      // Track fields for immutability check
      if (currentClassName && /^\s*(?:final\s+|var\s+|[A-Z][a-zA-Z0-9_<>?]*\s+|int\s+|double\s+|String\s+|bool\s+)([a-zA-Z0-9_$]+)\s*;/i.test(line)) {
        const isFinal = line.includes('final ') || line.includes('const ');
        const nameMatch = line.match(/([a-zA-Z0-9_$]+)\s*;/);
        if (nameMatch) {
          classFields.push({ name: nameMatch[1], isFinal, line: lineNum });
        }
      }

      // 4. Constructor Checks (const vs non-const)
      if (currentClassName) {
        const constConstRegex = new RegExp(`\\bconst\\s+${currentClassName}\\s*\\(`);
        const nonConstConstRegex = new RegExp(`^\\s*${currentClassName}\\s*\\(`);
        if (constConstRegex.test(line)) {
          classHasConstConstructor = true;
        } else if (nonConstConstRegex.test(line)) {
          classHasNonConstConstructor = true;
          nonConstConstructorLine = lineNum;
        }
      }

      // 5. dart:S1905 - Unsafe direct number casting (e.g. `json['price'] as double` or `as int`)
      const unsafeDoubleCast = line.match(/json\s*\[[^\]]+\]\s+as\s+double\b/);
      if (unsafeDoubleCast) {
        issues.push({
          id: `unsafe-cast-double-${lineNum}`,
          lineNumber: lineNum,
          severity: 'CRITICAL',
          ruleId: 'dart:S1905',
          ruleName: 'avoid_unsafe_number_cast',
          category: 'Type Safety',
          title: 'Unsafe direct cast to double will crash if JSON number is integer',
          message: 'การแปลง `as double` ตรงๆ จะทำให้แอพแครช (TypeError) เมื่อ Backend ส่งเลขจำนวนเต็ม',
          explanation: 'ใน Dart การ cast integer `100 as double` จะเกิด Runtime Exception แนะนำให้ใช้ `(json["..."] as num?)?.toDouble() ?? 0.0` แทน',
          offendingText: unsafeDoubleCast[0],
          suggestedFix: unsafeDoubleCast[0].replace(/as\s+double/, 'as num?)?.toDouble() ?? 0.0').replace(/^json/, '(json'),
        });
      }

      const unsafeIntCast = line.match(/json\s*\[[^\]]+\]\s+as\s+int\b/);
      if (unsafeIntCast) {
        issues.push({
          id: `unsafe-cast-int-${lineNum}`,
          lineNumber: lineNum,
          severity: 'CRITICAL',
          ruleId: 'dart:S1905',
          ruleName: 'avoid_unsafe_number_cast',
          category: 'Type Safety',
          title: 'Unsafe direct cast to int from JSON dynamic',
          message: 'การแปลง `as int` ตรงๆ เสี่ยงต่อ runtime crash หาก API ส่ง float มา',
          explanation: 'แนะนำให้ใช้ `(json["..."] as num?)?.toInt() ?? 0` เพื่อรองรับทั้งเลขทศนิยมและจำนวนเต็ม',
          offendingText: unsafeIntCast[0],
          suggestedFix: unsafeIntCast[0].replace(/as\s+int/, 'as num?)?.toInt() ?? 0').replace(/^json/, '(json'),
        });
      }

      // 6. dart:S1206 - == and hashCode paired overrides
      if (line.includes('bool operator ==(') || line.includes('bool operator==(')) {
        hasEqualsOverride = true;
        equalsLine = lineNum;
      }
      if (line.includes('int get hashCode') || line.includes('int get hashCode=>') || line.includes('int get hashCode =>')) {
        hasHashCodeOverride = true;
      }

      // Bitwise XOR in hashCode detection
      if (line.includes('hashCode') && line.includes(' ^ ')) {
        issues.push({
          id: `bitwise-hash-${lineNum}`,
          lineNumber: lineNum,
          severity: 'MAJOR',
          ruleId: 'dart:S1206B',
          ruleName: 'avoid_bitwise_hash_collisions',
          category: 'Clean Code',
          title: 'Avoid bitwise XOR (^) for hashCode in Dart 3',
          message: 'การใช้ `a.hashCode ^ b.hashCode` มีโอกาสเกิด Hash Collision สูง',
          explanation: 'ใน Dart 3 แนะนำให้ใช้ `Object.hash(a, b)` หรือ `Object.hashAll([...])` ที่มีอัลกอริทึมกระจายตัวเลขสม่ำเสมอกว่า',
          offendingText: trimmed,
          suggestedFix: 'Object.hash(...)',
        });
      }

      // 7. dart:S1186 - Empty Methods
      if (/\{\s*\}\s*$/.test(trimmed) && !trimmed.includes('class ') && !trimmed.includes('enum ')) {
        if (!trimmed.includes('//') && !trimmed.includes('const ')) {
          issues.push({
            id: `empty-method-${lineNum}`,
            lineNumber: lineNum,
            severity: 'MINOR',
            ruleId: 'dart:S1186',
            ruleName: 'empty_methods',
            category: 'Maintainability',
            title: 'Methods should not be empty',
            message: 'พบ Method หรือ Callback ว่างเปล่า `{}` โดยไม่มีคำอธิบาย',
            explanation: 'หากตั้งใจให้ว่างเปล่า ควรใส่ Comment เช่น `// Intentionally empty` หรือโยน `UnimplementedError()`',
            offendingText: trimmed,
          });
        }
      }

      // 8. dart:S107 - Avoid excessive positional parameters
      const methodParamMatch = line.match(/\(([^)]{60,})\)/);
      if (methodParamMatch && !methodParamMatch[1].includes('{')) {
        const paramCount = methodParamMatch[1].split(',').length;
        if (paramCount >= 5) {
          issues.push({
            id: `excessive-params-${lineNum}`,
            lineNumber: lineNum,
            severity: 'MINOR',
            ruleId: 'dart:S107',
            ruleName: 'avoid_excessive_positional_parameters',
            category: 'Maintainability',
            title: 'Avoid methods with excessive positional parameters (> 4)',
            message: `พบ Method/Constructor มี positional parameters ถึง ${paramCount} ตัว`,
            explanation: 'SonarQube แนะนำให้ใช้ Named Parameters `{ required this.param }` เพื่อให้อ่านง่ายและลดข้อผิดพลาดจากการสลับตำแหน่งค่า',
            offendingText: methodParamMatch[0],
          });
        }
      }
    }

    // Post-loop checks:
    // dart:S1206: If == is overridden but hashCode is missing
    if (hasEqualsOverride && !hasHashCodeOverride && equalsLine > 0) {
      issues.push({
        id: `missing-hashcode-${equalsLine}`,
        lineNumber: equalsLine,
        severity: 'CRITICAL',
        ruleId: 'dart:S1206',
        ruleName: 'hash_and_equals',
        category: 'Clean Code',
        title: 'Override hashCode whenever operator == is overridden',
        message: 'มีการ Override `operator ==` แต่ไม่มีการ Override `hashCode`',
        explanation: 'คลาสนี้จะไม่สามารถทำงานได้อย่างถูกต้องใน Set, Map หรือ State Management (Bloc/Riverpod) เนื่องจากขาด hashCode ที่สอดคล้องกัน',
        offendingText: 'bool operator ==(Object other)',
        suggestedFix: '@override\n  int get hashCode => Object.hash(...);',
      });
    }

    // dart:S1104: If class has all final fields and non-const constructor
    if (classFields.length > 0 && classFields.every((f) => f.isFinal) && classHasNonConstConstructor && !classHasConstConstructor && nonConstConstructorLine > 0) {
      issues.push({
        id: `prefer-const-${nonConstConstructorLine}`,
        lineNumber: nonConstConstructorLine,
        severity: 'MINOR',
        ruleId: 'dart:S1104',
        ruleName: 'prefer_const_constructors',
        category: 'Architecture',
        title: 'Constructors of classes with all final fields should be const',
        message: `Constructor ของคลาส "${currentClassName}" ควรประกาศเป็น const`,
        explanation: 'เมื่อ Field ทุกตัวเป็น final การใส่ `const` ช่วยให้ Flutter Cache อ็อบเจกต์ในหน่วยความจำและลดการ Rebuild โดยไม่จำเป็น',
        offendingText: `${currentClassName}(`,
        suggestedFix: `const ${currentClassName}(`,
      });
    }

    // Calculate metrics
    const blockerCount = issues.filter((i) => i.severity === 'BLOCKER').length;
    const criticalCount = issues.filter((i) => i.severity === 'CRITICAL').length;
    const majorCount = issues.filter((i) => i.severity === 'MAJOR').length;
    const minorCount = issues.filter((i) => i.severity === 'MINOR').length;
    const infoCount = issues.filter((i) => i.severity === 'INFO').length;

    // Penalty scoring
    let penalty = blockerCount * 25 + criticalCount * 15 + majorCount * 8 + minorCount * 3 + infoCount * 1;
    const complianceScore = Math.max(0, Math.min(100, 100 - penalty));
    const qualityGate = complianceScore >= 80 && blockerCount === 0 && criticalCount === 0 ? 'PASSED' : 'FAILED';

    return {
      issues,
      totalIssues: issues.length,
      blockerCount,
      criticalCount,
      majorCount,
      minorCount,
      infoCount,
      complianceScore,
      qualityGate,
      linesCount: lines.length,
    };
  }

  /**
   * Automatically refactors and cleans common SonarQube violations in Dart code
   */
  public static autoFix(code: string): string {
    let fixed = code;

    // 1. Fix snake_case class names (class user_profile -> class UserProfile)
    fixed = fixed.replace(/\bclass\s+([a-z0-9_]+)\b/g, (_, name) => {
      const pascal = name
        .replace(/^_+/, '')
        .replace(/_([a-z0-9])/g, (_: string, c: string) => c.toUpperCase())
        .replace(/^[a-z]/, (c: string) => c.toUpperCase());
      return `class ${pascal}`;
    });

    // 2. Fix snake_case variable names
    fixed = fixed.replace(/\b(final\s+|int\s+|double\s+|String\s+|bool\s+|var\s+)([a-z0-9]+_[a-z0-9_]+)\b/g, (_, type, name) => {
      const camel = name
        .replace(/^_+/, '')
        .replace(/_([a-z0-9])/g, (_: string, c: string) => c.toUpperCase());
      return `${type}${camel}`;
    });

    // 3. Fix unsafe double casts: json['x'] as double -> (json['x'] as num?)?.toDouble() ?? 0.0
    fixed = fixed.replace(/json\s*\[(['"][^'"]+['"])\]\s+as\s+double\b/g, '(json[$1] as num?)?.toDouble() ?? 0.0');

    // 4. Fix unsafe int casts: json['x'] as int -> (json['x'] as num?)?.toInt() ?? 0
    fixed = fixed.replace(/json\s*\[(['"][^'"]+['"])\]\s+as\s+int\b/g, '(json[$1] as num?)?.toInt() ?? 0');

    return fixed;
  }
}
