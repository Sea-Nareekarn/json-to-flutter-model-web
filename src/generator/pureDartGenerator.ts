import { GeneratorOptions, ParsedClass, ParsedProperty } from '../types';
import { toCamelCase } from './naming';

export class PureDartGenerator {
  constructor(private options: GeneratorOptions) {}

  public generate(parsedClasses: ParsedClass[]): string {
    if (parsedClasses.length === 0) return '';

    const lines: string[] = [];
    const rootClass = parsedClasses[0];
    const isRootArray = !!rootClass.isRootArray;
    const rootVarName = toCamelCase(rootClass.className);

    // 1. Top-Level Documentation & Helper Comments
    lines.push('// To parse this JSON data, do');
    lines.push('//');
    lines.push(`//     final ${rootVarName} = ${rootVarName}FromJson(jsonString);`);
    lines.push('');
    lines.push("import 'dart:convert';");
    if (this.options.useImmutableAnnotation) {
      lines.push("import 'package:meta/meta.dart';");
    }
    lines.push('');

    // 2. Top-Level Helper Functions
    if (isRootArray) {
      lines.push(`List<${rootClass.className}> ${rootVarName}FromJson(`);
      lines.push('        final String str,) =>');
      lines.push(`    List<${rootClass.className}>.from((json.decode(str) as List<dynamic>).map((final dynamic x) => ${rootClass.className}.fromJson(x as Map<String, dynamic>)));`);
      lines.push('');
      lines.push(`String ${rootVarName}ToJson(`);
      lines.push(`        final List<${rootClass.className}> data,) =>`);
      lines.push(`    json.encode(List<dynamic>.from(data.map((final ${rootClass.className} x) => x.toJson())));`);
      lines.push('');
    } else {
      lines.push(`${rootClass.className} ${rootVarName}FromJson(`);
      lines.push('        final String str,) =>');
      lines.push(`    ${rootClass.className}.fromJson(json.decode(str) as Map<String, dynamic>);`);
      lines.push('');
      lines.push(`String ${rootVarName}ToJson(`);
      lines.push(`        final ${rootClass.className} data,) =>`);
      lines.push('    json.encode(data.toJson());');
      lines.push('');
    }

    // 3. Class Definitions
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
    lines.push("import 'dart:convert';");
    if (this.options.useImmutableAnnotation) {
      lines.push("import 'package:meta/meta.dart';");
    }
    lines.push('');
    lines.push(this.generateClass(cls));
    return lines.join('\n');
  }

  private generateClass(cls: ParsedClass): string {
    const lines: string[] = [];

    if (this.options.useImmutableAnnotation) {
      lines.push('@immutable');
    }

    lines.push(`class ${cls.className} {`);

    // 1. Constructor (at top of class)
    lines.push(this.generateConstructor(cls));

    // 2. Factory fromJson
    lines.push('');
    lines.push(this.generateFromJson(cls));

    // 3. Field Declarations (after fromJson)
    for (const prop of cls.properties) {
      const typeStr = this.getTypeString(prop);
      lines.push(`  final ${typeStr} ${prop.dartFieldName};`);
    }

    // 4. copyWith
    if (this.options.generateCopyWith && cls.properties.length > 0) {
      lines.push('');
      lines.push(this.generateCopyWith(cls));
    }

    // 5. toJson
    if (this.options.generateToJson) {
      lines.push('');
      lines.push(this.generateToJson(cls));
    }

    // 6. toString
    if (this.options.generateToString && cls.properties.length > 0) {
      lines.push('');
      lines.push(this.generateToString(cls));
    }

    // 7. operator == & hashCode
    if (this.options.generateEquality && cls.properties.length > 0) {
      lines.push('');
      lines.push(this.generateEquality(cls));
      lines.push('');
      lines.push(this.generateHashCode(cls));
    }

    lines.push('}');
    return lines.join('\n');
  }

  private getTypeString(prop: ParsedProperty): string {
    if (prop.dartType === 'dynamic') {
      return 'dynamic';
    }
    if (prop.isNullable || this.options.nullability !== 'non_nullable') {
      return `${prop.dartType}?`;
    }
    return prop.dartType;
  }

  private generateConstructor(cls: ParsedClass): string {
    if (cls.properties.length === 0) {
      return `  ${cls.className}();`;
    }

    const lines: string[] = [];
    lines.push(`  ${cls.className}({`);

    for (const prop of cls.properties) {
      if (this.options.nullability === 'non_nullable' && !prop.isNullable) {
        lines.push(`    required this.${prop.dartFieldName},`);
      } else {
        lines.push(`    this.${prop.dartFieldName},`);
      }
    }

    lines.push('  });');
    return lines.join('\n');
  }

  private generateFromJson(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push('  factory ' + cls.className + '.fromJson(');
    lines.push('    final Map<String, dynamic> json,');
    lines.push('  ) =>');
    lines.push(`      ${cls.className}(`);

    for (const prop of cls.properties) {
      const parseExpr = this.generateFieldParser(prop);
      lines.push(`        ${prop.dartFieldName}: ${parseExpr},`);
    }

    lines.push('      );');
    return lines.join('\n');
  }

  private generateFieldParser(prop: ParsedProperty): string {
    const key = `'${prop.jsonKey}'`;

    if (prop.dartType === 'dynamic') {
      return `json[${key}]`;
    }

    if (prop.dartType === 'bool') {
      return `json[${key}]`;
    }

    if (prop.dartType === 'String') {
      return `json[${key}]`;
    }

    if (prop.dartType === 'int') {
      return `json[${key}]`;
    }

    if (prop.dartType === 'double') {
      if (this.options.safeNumberParsing) {
        return `json[${key}] == null ? null : (json[${key}] as num).toDouble()`;
      }
      return `json[${key}]?.toDouble()`;
    }

    if (prop.isDateTime) {
      return `json[${key}] == null ? null : DateTime.tryParse(json[${key}].toString())`;
    }

    if (prop.isObject && prop.nestedClassName) {
      const clsName = prop.nestedClassName;
      return `json[${key}] == null ? null : ${clsName}.fromJson(json[${key}] as Map<String, dynamic>)`;
    }

    if (prop.isList) {
      if (prop.isObjectList && prop.listElementType) {
        const elemCls = prop.listElementType;
        return `json[${key}] == null\n` +
          `            ? <${elemCls}>[]\n` +
          `            : List<${elemCls}>.from(\n` +
          `                (json[${key}] as List<dynamic>)\n` +
          `                    .cast<Map<String, dynamic>>()\n` +
          `                    .map(${elemCls}.fromJson),\n` +
          `              )`;
      }

      if (prop.listElementType === 'String') {
        return `json[${key}] == null\n` +
          `            ? <String>[]\n` +
          `            : List<String>.from((json[${key}] as List<dynamic>).map((final dynamic x) => x.toString()))`;
      }

      if (prop.listElementType === 'int') {
        return `json[${key}] == null\n` +
          `            ? <int>[]\n` +
          `            : List<int>.from((json[${key}] as List<dynamic>).map((final dynamic x) => (x as num).toInt()))`;
      }

      if (prop.listElementType === 'double') {
        return `json[${key}] == null\n` +
          `            ? <double>[]\n` +
          `            : List<double>.from((json[${key}] as List<dynamic>).map((final dynamic x) => (x as num).toDouble()))`;
      }

      if (prop.listElementType === 'bool') {
        return `json[${key}] == null\n` +
          `            ? <bool>[]\n` +
          `            : List<bool>.from((json[${key}] as List<dynamic>).map((final dynamic x) => x as bool))`;
      }

      return `json[${key}] == null\n` +
        `            ? <dynamic>[]\n` +
        `            : List<dynamic>.from((json[${key}] as List<dynamic>).map((final dynamic x) => x))`;
    }

    return `json[${key}]`;
  }

  private generateCopyWith(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push(`  ${cls.className} copyWith({`);

    for (const prop of cls.properties) {
      const typeStr = this.getTypeString(prop);
      lines.push(`    final ${typeStr} ${prop.dartFieldName},`);
    }

    lines.push('  }) =>');
    lines.push(`      ${cls.className}(`);

    for (const prop of cls.properties) {
      lines.push(`        ${prop.dartFieldName}: ${prop.dartFieldName} ?? this.${prop.dartFieldName},`);
    }

    lines.push('      );');
    return lines.join('\n');
  }

  private generateToJson(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push('  Map<String, dynamic> toJson() => <String, dynamic>{');

    for (const prop of cls.properties) {
      const key = `'${prop.jsonKey}'`;
      const field = prop.dartFieldName;

      if (prop.isDateTime) {
        lines.push(`        ${key}: ${field}?.toIso8601String(),`);
      } else if (prop.isObject && prop.nestedClassName) {
        lines.push(`        ${key}: ${field}?.toJson(),`);
      } else if (prop.isList && prop.isObjectList && prop.listElementType) {
        const elemCls = prop.listElementType;
        lines.push(`        ${key}: ${field} == null`);
        lines.push('            ? <dynamic>[]');
        lines.push(`            : List<dynamic>.from(${field}!.map((final ${elemCls} x) => x.toJson())),`);
      } else if (prop.isList) {
        lines.push(`        ${key}: ${field} == null`);
        lines.push('            ? <dynamic>[]');
        lines.push(`            : List<dynamic>.from(${field}!.map((final dynamic x) => x)),`);
      } else {
        lines.push(`        ${key}: ${field},`);
      }
    }

    lines.push('      };');
    return lines.join('\n');
  }

  private generateToString(cls: ParsedClass): string {
    if (cls.properties.length === 0) {
      return `  @override\n  String toString() => '${cls.className}()';`;
    }

    const fieldStrings = cls.properties.map(p => `${p.dartFieldName}: \$${p.dartFieldName}`).join(', ');
    return `  @override\n  String toString() => '${cls.className}(${fieldStrings})';`;
  }

  private generateEquality(cls: ParsedClass): string {
    const lines: string[] = [];
    lines.push('  @override');
    lines.push('  bool operator ==(final Object other) {');
    lines.push('    if (identical(this, other)) return true;');
    lines.push('');
    lines.push(`    return other is ${cls.className}`);

    if (cls.properties.length === 0) {
      lines[lines.length - 1] += ';';
    } else {
      for (let i = 0; i < cls.properties.length; i++) {
        const prop = cls.properties[i];
        const isLast = i === cls.properties.length - 1;
        lines.push(`        && other.${prop.dartFieldName} == ${prop.dartFieldName}${isLast ? ';' : ''}`);
      }
    }

    lines.push('  }');
    return lines.join('\n');
  }

  private generateHashCode(cls: ParsedClass): string {
    if (cls.properties.length === 0) {
      return '  @override\n  int get hashCode => 0;';
    }

    if (cls.properties.length <= 20) {
      const fields = cls.properties.map(p => `        ${p.dartFieldName},`).join('\n');
      return `  @override\n  int get hashCode => Object.hash(\n${fields}\n      );`;
    }

    const fields = cls.properties.map(p => `        ${p.dartFieldName},`).join('\n');
    return `  @override\n  int get hashCode => Object.hashAll([\n${fields}\n      ]);`;
  }
}
