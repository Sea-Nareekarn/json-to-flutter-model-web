export type ModelStyle = 'pure_dart' | 'freezed' | 'json_serializable' | 'equatable';

export type NullabilityMode = 'nullable' | 'non_nullable' | 'smart';

export interface GeneratorOptions {
  rootClassName: string;
  style: ModelStyle;
  nullability: NullabilityMode;
  generateCopyWith: boolean;
  generateToString: boolean;
  generateEquality: boolean;
  generateToJson: boolean;
  generateComments: boolean;
  useImmutableAnnotation: boolean;
  safeNumberParsing: boolean;
  useExplicitToJson: boolean;
  separateFiles: boolean;
}

export interface ParsedProperty {
  jsonKey: string;
  dartFieldName: string;
  dartType: string;
  isNullable: boolean;
  isList: boolean;
  isObject: boolean;
  isMap: boolean;
  isDateTime: boolean;
  isPrimitiveList: boolean;
  isObjectList: boolean;
  nestedClassName?: string;
  listElementType?: string;
  originalValue: unknown;
}

export interface ParsedClass {
  className: string;
  properties: ParsedProperty[];
  originalSample?: Record<string, unknown>;
  isRootArray?: boolean;
}

export interface GeneratedFile {
  fileName: string;
  className: string;
  content: string;
}

export interface SonarRuleResult {
  ruleId: string;
  ruleName: string;
  category: 'Naming' | 'Architecture' | 'Type Safety' | 'Maintainability' | 'Clean Code';
  severity: 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
  status: 'passed' | 'warning';
  title: string;
  description: string;
  explanation: string;
}

export interface GenerationResult {
  code: string;
  classes: ParsedClass[];
  files: GeneratedFile[];
  sonarResults: SonarRuleResult[];
  complianceScore: number;
}
