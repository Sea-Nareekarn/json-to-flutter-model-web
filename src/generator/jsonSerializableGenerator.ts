import { GeneratorOptions, ParsedClass, ParsedProperty } from '../types';
import { toSnakeCase } from './naming';

export class JsonSerializableGenerator {
  constructor(private options: GeneratorOptions) {}

  public generate(parsedClasses: ParsedClass[]): string {
    const lines: string[] = [];
    const rootName = this.options.rootClassName || 'model';
    const fileName = toSnakeCase(rootName);

    if (this.options.generateComments) {
      lines.push('// ==============================================================================');
      lines.push('// GENERATED CODE - JSON_SERIALIZABLE & SONARQUBE COMPLIANT');
      lines.push('// Run `dart run build_runner build --delete-conflicting-outputs` to generate parts');
      lines.push('// ==============================================================================');
      lines.push('');
    }

    lines.push("import 'package:json_annotation/json_annotation.dart';");
    lines.push('');
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

    lines.push("import 'package:json_annotation/json_annotation.dart';");
    lines.push('');
    lines.push(`part '${fileName}.g.dart';`);
    lines.push('');
    lines.push(this.generateClass(cls));

    return lines.join('\n');
  }

  private generateClass(cls: ParsedClass): string {
    const lines: string[] = [];
    const explicitToJson = this.options.useExplicitToJson ? '(explicitToJson: true)' : '';

    lines.push(`@JsonSerializable${explicitToJson}`);
    lines.push(`class ${cls.className} {`);

    // Fields
    for (const prop of cls.properties) {
      const typeStr = this.getTypeString(prop);
      if (prop.jsonKey !== prop.dartFieldName) {
        lines.push(`  @JsonKey(name: '${prop.jsonKey}')`);
      }
      lines.push(`  final ${typeStr} ${prop.dartFieldName};`);
      lines.push('');
    }

    // Constructor
    lines.push(this.generateConstructor(cls));
    lines.push('');

    // fromJson
    lines.push(`  factory ${cls.className}.fromJson(Map<String, dynamic> json) => _$${cls.className}FromJson(json);`);
    lines.push('');

    // toJson
    lines.push(`  Map<String, dynamic> toJson() => _$${cls.className}ToJson(this);`);

    if (this.options.generateCopyWith) {
      lines.push('');
      lines.push(this.generateCopyWith(cls));
    }

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
