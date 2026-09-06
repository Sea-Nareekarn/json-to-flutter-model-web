import { GeneratorOptions, ParsedClass, ParsedProperty } from '../types';

export class EquatableGenerator {
  constructor(private options: GeneratorOptions) {}

  public generate(parsedClasses: ParsedClass[]): string {
    const lines: string[] = [];

    if (this.options.generateComments) {
      lines.push('// ==============================================================================');
      lines.push('// GENERATED CODE - EQUATABLE & SONARQUBE COMPLIANT');
      lines.push('// ==============================================================================');
      lines.push('');
    }

    lines.push("import 'package:equatable/equatable.dart';");
    lines.push('');

    for (let i = 0; i < parsedClasses.length; i++) {
      const cls = parsedClasses[i];
      lines.push(this.generateClass(cls));
      if (i < parsedClasses.length - 1) {
        lines.push('');
      }
    }

    return lines.join('\n');
  }

  public generateSingleClass(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push("import 'package:equatable/equatable.dart';");
    lines.push('');
    lines.push(this.generateClass(cls));
    return lines.join('\n');
  }

  private generateClass(cls: ParsedClass): string {
    const lines: string[] = [];

    lines.push(`class ${cls.className} extends Equatable {`);

    // 1. Fields
    for (const prop of cls.properties) {
      const typeStr = this.getTypeString(prop);
      lines.push(`  final ${typeStr} ${prop.dartFieldName};`);
    }

    if (cls.properties.length > 0) {
      lines.push('');
    }

    // 2. Const Constructor
    lines.push(this.generateConstructor(cls));

    // 3. fromJson factory
    lines.push('');
    lines.push(this.generateFromJson(cls));

    // 4. toJson method
    if (this.options.generateToJson) {
      lines.push('');
      lines.push(this.generateToJson(cls));
    }

    // 5. copyWith method
    if (this.options.generateCopyWith) {
      lines.push('');
      lines.push(this.generateCopyWith(cls));
    }

    // 6. Equatable props override
    lines.push('');
    lines.push('  @override');
    lines.push('  List<Object?> get props => [');
    for (const prop of cls.properties) {
      lines.push(`        ${prop.dartFieldName},`);
    }
    lines.push('      ];');

    lines.push('}');
    return lines.join('\n');
  }

  private getTypeString(prop: ParsedProperty): string {
    if (prop.dartType === 'dynamic') return 'dynamic';
    if (prop.isNullable) return `${prop.dartType}?`;
    return prop.dartType;
  }

  private generateConstructor(cls: ParsedClass): string {
    if (cls.properties.length === 0) {
      return `  const ${cls.className}();`;
    }

    const lines: string[] = [];
    lines.push(`  const ${cls.className}({`);

    for (const prop of cls.properties) {
      if (prop.isNullable || prop.dartType === 'dynamic') {
        lines.push(`    this.${prop.dartFieldName},`);
      } else {
        lines.push(`    required this.${prop.dartFieldName},`);
      }
    }

    lines.push('  });');
    return lines.join('\n');
  }

  private generateFromJson(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push(`  factory ${cls.className}.fromJson(Map<String, dynamic> json) {`);
    lines.push(`    return ${cls.className}(`);

    for (const prop of cls.properties) {
      const parseExpr = this.generateFieldParser(prop);
      lines.push(`      ${prop.dartFieldName}: ${parseExpr},`);
    }

    lines.push('    );');
    lines.push('  }');
    return lines.join('\n');
  }

  private generateFieldParser(prop: ParsedProperty): string {
    const key = `'${prop.jsonKey}'`;
    const isNullable = prop.isNullable;

    if (prop.dartType === 'dynamic') return `json[${key}]`;

    if (prop.dartType === 'String') {
      return isNullable ? `json[${key}]?.toString()` : `json[${key}]?.toString() ?? ''`;
    }

    if (prop.dartType === 'int') {
      if (this.options.safeNumberParsing) {
        return isNullable ? `(json[${key}] as num?)?.toInt()` : `(json[${key}] as num?)?.toInt() ?? 0`;
      }
      return isNullable ? `json[${key}] as int?` : `json[${key}] as int? ?? 0`;
    }

    if (prop.dartType === 'double') {
      return isNullable ? `(json[${key}] as num?)?.toDouble()` : `(json[${key}] as num?)?.toDouble() ?? 0.0`;
    }

    if (prop.dartType === 'bool') {
      return isNullable ? `json[${key}] as bool?` : `json[${key}] as bool? ?? false`;
    }

    if (prop.isDateTime) {
      return isNullable
        ? `json[${key}] != null ? DateTime.tryParse(json[${key}].toString()) : null`
        : `json[${key}] != null ? DateTime.tryParse(json[${key}].toString()) ?? DateTime.now() : DateTime.now()`;
    }

    if (prop.isObject && prop.nestedClassName) {
      const clsName = prop.nestedClassName;
      return isNullable
        ? `json[${key}] != null ? ${clsName}.fromJson(json[${key}] as Map<String, dynamic>) : null`
        : `${clsName}.fromJson(json[${key}] as Map<String, dynamic>)`;
    }

    if (prop.isList) {
      if (prop.isObjectList && prop.listElementType) {
        const elemCls = prop.listElementType;
        return isNullable
          ? `(json[${key}] as List<dynamic>?)?.map((e) => ${elemCls}.fromJson(e as Map<String, dynamic>)).toList()`
          : `(json[${key}] as List<dynamic>?)?.map((e) => ${elemCls}.fromJson(e as Map<String, dynamic>)).toList() ?? const []`;
      }

      if (prop.listElementType === 'String') {
        return isNullable
          ? `(json[${key}] as List<dynamic>?)?.map((e) => e.toString()).toList()`
          : `(json[${key}] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const []`;
      }

      if (prop.listElementType === 'int') {
        return isNullable
          ? `(json[${key}] as List<dynamic>?)?.map((e) => (e as num).toInt()).toList()`
          : `(json[${key}] as List<dynamic>?)?.map((e) => (e as num).toInt()).toList() ?? const []`;
      }

      if (prop.listElementType === 'double') {
        return isNullable
          ? `(json[${key}] as List<dynamic>?)?.map((e) => (e as num).toDouble()).toList()`
          : `(json[${key}] as List<dynamic>?)?.map((e) => (e as num).toDouble()).toList() ?? const []`;
      }

      if (prop.listElementType === 'bool') {
        return isNullable
          ? `(json[${key}] as List<dynamic>?)?.map((e) => e as bool).toList()`
          : `(json[${key}] as List<dynamic>?)?.map((e) => e as bool).toList() ?? const []`;
      }

      return isNullable
        ? `json[${key}] as List<dynamic>?`
        : `json[${key}] as List<dynamic>? ?? const []`;
    }

    return `json[${key}]`;
  }

  private generateToJson(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push('  Map<String, dynamic> toJson() {');
    lines.push('    return {');

    for (const prop of cls.properties) {
      const key = `'${prop.jsonKey}'`;
      const field = prop.dartFieldName;

      if (prop.isDateTime) {
        lines.push(`      ${key}: ${field}${prop.isNullable ? '?' : ''}.toIso8601String(),`);
      } else if (prop.isObject) {
        lines.push(`      ${key}: ${field}${prop.isNullable ? '?' : ''}.toJson(),`);
      } else if (prop.isList && prop.isObjectList) {
        lines.push(`      ${key}: ${field}${prop.isNullable ? '?' : ''}.map((e) => e.toJson()).toList(),`);
      } else {
        lines.push(`      ${key}: ${field},`);
      }
    }

    lines.push('    };');
    lines.push('  }');
    return lines.join('\n');
  }

  private generateCopyWith(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push(`  ${cls.className} copyWith({`);

    for (const prop of cls.properties) {
      const typeStr = prop.dartType === 'dynamic' ? 'dynamic' : `${prop.dartType}?`;
      lines.push(`    ${typeStr} ${prop.dartFieldName},`);
    }

    lines.push('  }) {');
    lines.push(`    return ${cls.className}(`);

    for (const prop of cls.properties) {
      lines.push(`      ${prop.dartFieldName}: ${prop.dartFieldName} ?? this.${prop.dartFieldName},`);
    }

    lines.push('    );');
    lines.push('  }');
    return lines.join('\n');
  }
}
