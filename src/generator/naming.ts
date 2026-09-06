// Dart reserved keywords and built-in identifiers
const DART_RESERVED_KEYWORDS = new Set([
  'abstract', 'as', 'assert', 'async', 'await', 'base', 'break', 'case', 'catch',
  'class', 'const', 'continue', 'covariant', 'default', 'deferred', 'do', 'dynamic',
  'else', 'enum', 'export', 'extends', 'extension', 'external', 'factory', 'false',
  'final', 'finally', 'for', 'function', 'get', 'hide', 'if', 'implements', 'import',
  'in', 'interface', 'is', 'late', 'library', 'mixin', 'native', 'new', 'null',
  'of', 'on', 'operator', 'part', 'patch', 'required', 'rethrow', 'return', 'sealed',
  'set', 'show', 'static', 'super', 'switch', 'sync', 'this', 'throw', 'true',
  'try', 'typedef', 'var', 'void', 'when', 'with', 'yield'
]);

/**
 * Converts any string into a clean PascalCase (UpperCamelCase) identifier for Dart classes.
 * Complies strictly with SonarQube rule `camel_case_types` (dart:S101).
 */
export function toPascalCase(input: string): string {
  if (!input) return 'GeneratedModel';
  
  // Clean special characters and split by delimiters
  const words = input
    .replace(/^[^a-zA-Z0-9]+/, '') // Remove leading non-alphanumeric
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()) // kebab-case, snake_case
    .replace(/[^a-zA-Z0-9]/g, '');

  if (!words) return 'GeneratedModel';

  // Capitalize first character
  let result = words.charAt(0).toUpperCase() + words.slice(1);

  // If starts with a digit, prefix with 'Model'
  if (/^[0-9]/.test(result)) {
    result = `Model${result}`;
  }

  // Ensure reserved words are safeguarded
  if (DART_RESERVED_KEYWORDS.has(result.toLowerCase())) {
    result = `${result}Model`;
  }

  return result;
}

/**
 * Converts any JSON key into a clean lowerCamelCase identifier for Dart fields/variables.
 * Complies strictly with SonarQube rule `non_constant_identifier_names` (dart:S117)
 * and `no_leading_underscores_for_local_identifiers`.
 */
export function toCamelCase(input: string): string {
  if (!input) return 'field';

  // Clean leading symbols like @, $, _, #
  let cleanInput = input;
  if (cleanInput.startsWith('@')) {
    cleanInput = cleanInput.slice(1);
  } else if (cleanInput.startsWith('_')) {
    cleanInput = cleanInput.replace(/^_+/, '');
  } else if (cleanInput.startsWith('$')) {
    cleanInput = cleanInput.slice(1);
  }

  // Handle snake_case, kebab-case, space-separated, dot-separated
  let camel = cleanInput
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');

  if (!camel) {
    return 'value';
  }

  // Lowercase the first char
  camel = camel.charAt(0).toLowerCase() + camel.slice(1);

  // If starts with a digit, prefix with 'val'
  if (/^[0-9]/.test(camel)) {
    camel = `val${camel.charAt(0).toUpperCase() + camel.slice(1)}`;
  }

  // Handle Dart reserved keywords
  if (DART_RESERVED_KEYWORDS.has(camel)) {
    switch (camel) {
      case 'default':
        return 'isDefault';
      case 'final':
        return 'isFinal';
      case 'class':
        return 'className';
      case 'switch':
        return 'switchValue';
      case 'return':
        return 'returnValue';
      case 'case':
        return 'caseValue';
      case 'break':
        return 'breakValue';
      case 'new':
        return 'isNew';
      case 'set':
        return 'setValue';
      case 'get':
        return 'getValue';
      case 'enum':
        return 'enumType';
      case 'interface':
        return 'interfaceType';
      case 'super':
        return 'superValue';
      case 'this':
        return 'thisValue';
      case 'function':
        return 'functionValue';
      case 'required':
        return 'isRequired';
      case 'var':
        return 'varValue';
      case 'void':
        return 'voidValue';
      case 'null':
        return 'nullValue';
      case 'is':
        return 'isMatch';
      case 'in':
        return 'inValue';
      case 'as':
        return 'asValue';
      case 'do':
        return 'doAction';
      case 'try':
        return 'tryValue';
      case 'catch':
        return 'catchValue';
      case 'throw':
        return 'throwValue';
      default:
        return `${camel}Value`;
    }
  }

  return camel;
}

/**
 * Converts PascalCase to snake_case for standard Dart file naming conventions
 */
export function toSnakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}
