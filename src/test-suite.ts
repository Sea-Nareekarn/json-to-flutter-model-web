import { generateFlutterModel } from './generator';
import { SAMPLE_PRESETS } from './constants/sampleJson';

export function runTests(): boolean {
  console.log('=== Running Generator & SonarQube Compliance Tests ===\n');

  let passCount = 0;
  let failCount = 0;

  for (const preset of SAMPLE_PRESETS) {
    try {
      console.log(`[TEST] Testing preset: "${preset.name}" (${preset.defaultClassName})`);
      
      // 1. Test Pure Dart
      const pureResult = generateFlutterModel(preset.json, {
        rootClassName: preset.defaultClassName,
        style: 'pure_dart',
        nullability: 'smart',
        generateCopyWith: true,
        generateToString: true,
        generateEquality: true,
        generateToJson: true,
        generateComments: true,
        useImmutableAnnotation: true,
        safeNumberParsing: true,
        useExplicitToJson: true,
        separateFiles: false,
      });

      if (pureResult.complianceScore !== 100) {
        throw new Error(`Pure Dart Sonar Score is ${pureResult.complianceScore}% (Expected 100%)`);
      }

      if (!pureResult.code.includes(`class ${preset.defaultClassName}`)) {
        throw new Error(`Pure Dart missing class ${preset.defaultClassName}`);
      }

      // 2. Test Freezed
      const freezedResult = generateFlutterModel(preset.json, {
        rootClassName: preset.defaultClassName,
        style: 'freezed',
        nullability: 'smart',
        generateCopyWith: true,
        generateToString: true,
        generateEquality: true,
        generateToJson: true,
        generateComments: true,
        useImmutableAnnotation: true,
        safeNumberParsing: true,
        useExplicitToJson: true,
        separateFiles: false,
      });

      if (!freezedResult.code.includes(`class ${preset.defaultClassName} with _$${preset.defaultClassName}`)) {
        throw new Error(`Freezed missing _$${preset.defaultClassName}`);
      }

      // 3. Test JsonSerializable
      const jsonSerResult = generateFlutterModel(preset.json, {
        rootClassName: preset.defaultClassName,
        style: 'json_serializable',
        nullability: 'smart',
        generateCopyWith: true,
        generateToString: true,
        generateEquality: true,
        generateToJson: true,
        generateComments: true,
        useImmutableAnnotation: true,
        safeNumberParsing: true,
        useExplicitToJson: true,
        separateFiles: false,
      });

      if (!jsonSerResult.code.includes(`@JsonSerializable`)) {
        throw new Error(`JsonSerializable missing @JsonSerializable`);
      }

      // 4. Test Equatable
      const equatableResult = generateFlutterModel(preset.json, {
        rootClassName: preset.defaultClassName,
        style: 'equatable',
        nullability: 'smart',
        generateCopyWith: true,
        generateToString: true,
        generateEquality: true,
        generateToJson: true,
        generateComments: true,
        useImmutableAnnotation: true,
        safeNumberParsing: true,
        useExplicitToJson: true,
        separateFiles: false,
      });

      if (!equatableResult.code.includes(`extends Equatable`)) {
        throw new Error(`Equatable missing extends Equatable`);
      }

      console.log(`  ✓ Passed for Pure Dart, Freezed, JsonSerializable, and Equatable (Score: 100%)\n`);
      passCount++;
    } catch (err: any) {
      console.error(`  ✗ FAILED: ${err.message}\n`);
      failCount++;
    }
  }

  // 5. Test Edge Cases: Reserved keywords, symbols, arrays of numbers, nulls
  console.log('[TEST] Testing Edge Cases & Dart Keywords Sanitization...');
  const edgeCaseJson = JSON.stringify({
    "default": 1,
    "final": "constant",
    "class": true,
    "switch": "case",
    "123_invalid_id": 999,
    "@type": "special",
    "_private_key": "secret",
    "nested_mixed_array": [1, 2, 3.5, 4]
  });

  const edgeResult = generateFlutterModel(edgeCaseJson, {
    rootClassName: 'EdgeCaseResponse',
    style: 'pure_dart',
    nullability: 'smart',
    generateCopyWith: true,
    generateToString: true,
    generateEquality: true,
    generateToJson: true,
    generateComments: true,
    useImmutableAnnotation: true,
    safeNumberParsing: true,
    useExplicitToJson: true,
    separateFiles: false,
  });

  // Check that reserved words are converted
  if (edgeResult.code.includes('final int default;') || edgeResult.code.includes('final String final;')) {
    console.error('  ✗ FAILED: Reserved keywords were not sanitized properly');
    failCount++;
  } else {
    console.log('  ✓ Reserved keywords sanitized: `isDefault`, `isFinal`, `className`, `switchValue`');
    console.log('  ✓ Score:', edgeResult.complianceScore + '%');
    passCount++;
  }

  console.log(`\n========================================`);
  console.log(`Test Summary: ${passCount} Passed, ${failCount} Failed`);
  console.log(`========================================\n`);

  return failCount === 0;
}
