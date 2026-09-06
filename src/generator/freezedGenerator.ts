import { GeneratorOptions, ParsedClass, ParsedProperty } from '../types';
import { toSnakeCase } from './naming';

export class FreezedGenerator {
  constructor(private options: GeneratorOptions) {}

  public generate(parsedClasses: ParsedClass[]): string {
    const lines: string[] = [];
    const rootName = this.options.rootClassName || 'model';
    const fileName = toSnakeCase(rootName);

    if (this.options.generateComments) {
      lines.push('// ==============================================================================');
      lines.push('// GENERATED CODE - FREEZED & SONARQUBE COMPLIANT');
      lines.push('// Run `dart run build_runner build --delete-conflicting-outputs` to generate parts');
      lines.push('// ==============================================================================');
      lines.push('');
    }

    lines.push("import 'package:freezed_annotation/freezed_annotation.dart';");
    lines.push('');
    lines.push(`part '${fileName}.freezed.dart';`);
    lines.push(`part '${fileName}.g.dart';`);
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
    const fileName = toSnakeCase(cls.className);

    lines.push("import 'package:freezed_annotation/freezed_annotation.dart';");
    lines.push('');
    lines.push(`part '${fileName}.freezed.dart';`);
    lines.push(`part '${fileName}.g.dart';`);
    lines.push('');
    lines.push(this.generateClass(cls));

    return lines.join('\n');
  }

  private generateClass(cls: ParsedClass): string {
    const lines: string[] = [];

    lines.push('@freezed');
    lines.push(`class ${cls.className} with _$${cls.className} {`);
    lines.push(`  const factory ${cls.className}({`);

    for (const prop of cls.properties) {
      const typeStr = this.getTypeString(prop);
      const jsonKeyAnnotation = prop.jsonKey !== prop.dartFieldName ? `@JsonKey(name: '${prop.jsonKey}') ` : '';
      const prefix = (prop.isNullable || prop.dartType === 'dynamic') ? '' : 'required ';
      
      lines.push(`    ${jsonKeyAnnotation}${prefix}${typeStr} ${prop.dartFieldName},`);
    }

    lines.push(`  }) = _${cls.className};`);
    lines.push('');
    lines.push(`  factory ${cls.className}.fromJson(Map<String, dynamic> json) => _$${cls.className}FromJson(json);`);
    lines.push('}');

    return lines.join('\n');
  }

  private getTypeString(prop: ParsedProperty): string {
    if (prop.dartType === 'dynamic') return 'dynamic';
    if (prop.isNullable) return `${prop.dartType}?`;
    return prop.dartType;
  }
}
