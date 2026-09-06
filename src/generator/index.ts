import { GeneratedFile, GenerationResult, GeneratorOptions, ParsedClass } from '../types';
import { EquatableGenerator } from './equatableGenerator';
import { FreezedGenerator } from './freezedGenerator';
import { JsonSerializableGenerator } from './jsonSerializableGenerator';
import { toSnakeCase } from './naming';
import { PureDartGenerator } from './pureDartGenerator';
import { SonarAuditor } from './sonarAuditor';
import { JsonToAstParser } from './typeInference';

export function generateFlutterModel(jsonString: string, options: GeneratorOptions): GenerationResult {
  if (!jsonString.trim()) {
    throw new Error('กรุณากรอก JSON หรือเลือกตัวอย่าง Preset ก่อนทำการแปลง');
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(jsonString);
  } catch (err: unknown) {
    const error = err as Error;
    throw new Error(`JSON Format ไม่ถูกต้อง: ${error.message}`);
  }

  const parser = new JsonToAstParser(options);
  const classes: ParsedClass[] = parser.parse(parsedJson);

  if (classes.length === 0) {
    throw new Error('ไม่สามารถวิเคราะห์โครงสร้างข้อมูลจาก JSON ได้');
  }

  let code = '';
  const files: GeneratedFile[] = [];

  switch (options.style) {
    case 'freezed': {
      const generator = new FreezedGenerator(options);
      code = generator.generate(classes);
      for (const cls of classes) {
        files.push({
          fileName: `${toSnakeCase(cls.className)}.dart`,
          className: cls.className,
          content: generator.generateSingleClass(cls),
        });
      }
      break;
    }
    case 'json_serializable': {
      const generator = new JsonSerializableGenerator(options);
      code = generator.generate(classes);
      for (const cls of classes) {
        files.push({
          fileName: `${toSnakeCase(cls.className)}.dart`,
          className: cls.className,
          content: generator.generateSingleClass(cls),
        });
      }
      break;
    }
    case 'equatable': {
      const generator = new EquatableGenerator(options);
      code = generator.generate(classes);
      for (const cls of classes) {
        files.push({
          fileName: `${toSnakeCase(cls.className)}.dart`,
          className: cls.className,
          content: generator.generateSingleClass(cls),
        });
      }
      break;
    }
    case 'pure_dart':
    default: {
      const generator = new PureDartGenerator(options);
      code = generator.generate(classes);
      for (const cls of classes) {
        files.push({
          fileName: `${toSnakeCase(cls.className)}.dart`,
          className: cls.className,
          content: generator.generateSingleClass(cls),
        });
      }
      break;
    }
  }

  const { results: sonarResults, complianceScore } = SonarAuditor.audit(classes, options, code);

  return {
    code,
    classes,
    files,
    sonarResults,
    complianceScore,
  };
}

export * from './naming';
export * from './typeInference';
export * from './pureDartGenerator';
export * from './freezedGenerator';
export * from './jsonSerializableGenerator';
export * from './equatableGenerator';
export * from './sonarAuditor';
