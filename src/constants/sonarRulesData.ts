export interface SonarRuleDetail {
  id: string;
  name: string;
  category: 'Naming' | 'Architecture' | 'Type Safety' | 'Maintainability' | 'Clean Code';
  severity: 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
  summary: string;
  explanation: string;
  badCode: string;
  goodCode: string;
  dartLintEquivalent: string;
}

export const FULL_ANALYSIS_OPTIONS_YAML = `linter:
  rules:
    prefer_single_quotes: true
    prefer_null_aware_operators: true
    always_declare_return_types: true
    always_put_control_body_on_new_line: false # ขัดกับ curly_braces_in_flow_control_structures
    always_put_required_named_parameters_first: true
    always_specify_types: true # ขัดกับ omit_local_variable_types
    always_use_package_imports: true
    annotate_overrides: true
    annotate_redeclares: true
    avoid_annotating_with_dynamic: true
    avoid_bool_literals_in_conditional_expressions: true
    avoid_catches_without_on_clauses: true
    avoid_catching_errors: true
    avoid_classes_with_only_static_members: true
    avoid_double_and_int_checks: true
    avoid_dynamic_calls: true
    avoid_empty_else: true
    avoid_equals_and_hash_code_on_mutable_classes: true
    avoid_escaping_inner_quotes: true
    avoid_field_initializers_in_const_classes: true
    avoid_final_parameters: false # ขัดกับ prefer_final_parameters
    avoid_function_literals_in_foreach_calls: true
    avoid_implementing_value_types: true
    avoid_init_to_null: true
    avoid_js_rounded_ints: true
    avoid_multiple_declarations_per_line: true
    avoid_null_checks_in_equality_operators: true
    avoid_positional_boolean_parameters: true
    avoid_print: true
    avoid_private_typedef_functions: true
    avoid_redundant_argument_values: true
    avoid_relative_lib_imports: true
    avoid_renaming_method_parameters: true
    avoid_return_types_on_setters: true
    avoid_returning_null_for_void: true
    avoid_returning_this: true
    avoid_setters_without_getters: true
    avoid_shadowing_type_parameters: true
    avoid_single_cascade_in_expression_statements: true
    avoid_slow_async_io: true
    avoid_type_to_string: true
    avoid_types_as_parameter_names: true
    avoid_types_on_closure_parameters: false # ขัดกับ always_specify_types
    avoid_unnecessary_containers: true
    avoid_unused_constructor_parameters: true
    avoid_void_async: true
    avoid_web_libraries_in_flutter: true
    await_only_futures: true
    camel_case_extensions: true
    camel_case_types: true
    cancel_subscriptions: true
    cascade_invocations: true
    cast_nullable_to_non_nullable: true
    close_sinks: true
    collection_methods_unrelated_type: true
    combinators_ordering: true
    comment_references: true
    conditional_uri_does_not_exist: true
    constant_identifier_names: true
    control_flow_in_finally: true
    curly_braces_in_flow_control_structures: true
    dangling_library_doc_comments: true
    depend_on_referenced_packages: true
    deprecated_consistency: true
    deprecated_member_use_from_same_package: true
    diagnostic_describe_all_properties: true
    directives_ordering: true
    discarded_futures: true
    do_not_use_environment: true
    document_ignores: true
    empty_catches: true
    empty_constructor_bodies: true
    empty_statements: true
    eol_at_end_of_file: true
    exhaustive_cases: true
    file_names: true
    flutter_style_todos: true
    hash_and_equals: true
    implementation_imports: true
    implicit_call_tearoffs: true
    implicit_reopen: true
    invalid_case_patterns: true
    invalid_runtime_check_with_js_interop_types: true
    join_return_with_assignment: true
    leading_newlines_in_multiline_strings: true
    library_annotations: true
    library_names: true
    library_prefixes: true
    library_private_types_in_public_api: true
    lines_longer_than_80_chars: true
    literal_only_boolean_expressions: true
    matching_super_parameters: true
    missing_code_block_language_in_doc_comment: true
    missing_whitespace_between_adjacent_strings: true
    no_adjacent_strings_in_list: true
    no_default_cases: true
    no_duplicate_case_values: true
    no_leading_underscores_for_library_prefixes: true
    no_leading_underscores_for_local_identifiers: true
    no_literal_bool_comparisons: true
    no_logic_in_create_state: true
    no_runtimeType_toString: true
    no_self_assignments: true
    no_wildcard_variable_uses: true
    non_constant_identifier_names: true
    noop_primitive_operations: true
    null_check_on_nullable_type_parameter: true
    null_closures: true
    omit_local_variable_types: false # ขัดกับ always_specify_types
    omit_obvious_local_variable_types: false # ขัดกับ always_specify_types
    one_member_abstracts: true
    only_throw_errors: true
    overridden_fields: true
    package_api_docs: true
    package_names: true
    package_prefixed_library_names: true
    parameter_assignments: true
    prefer_adjacent_string_concatenation: true
    prefer_asserts_in_initializer_lists: true
    prefer_asserts_with_message: true
    prefer_collection_literals: true
    prefer_conditional_assignment: true
    prefer_const_constructors: true
    prefer_const_constructors_in_immutables: true
    prefer_const_declarations: true
    prefer_const_literals_to_create_immutables: true
    prefer_constructors_over_static_methods: true
    prefer_contains: true
    prefer_expression_function_bodies: true
    prefer_final_fields: true
    prefer_final_in_for_each: true
    prefer_final_locals: true
    prefer_final_parameters: true # ขัดกับ avoid_final_parameters
    prefer_for_elements_to_map_fromIterable: true
    prefer_foreach: true
    prefer_function_declarations_over_variables: true
    prefer_generic_function_type_aliases: true
    prefer_if_elements_to_conditional_expressions: true
    prefer_if_null_operators: true
    prefer_initializing_formals: true
    prefer_inlined_adds: true
    prefer_int_literals: true
    prefer_interpolation_to_compose_strings: true
    prefer_is_empty: true
    prefer_is_not_empty: true
    prefer_is_not_operator: true
    prefer_iterable_whereType: true
    prefer_mixin: true
    prefer_null_aware_method_calls: true
    prefer_null_aware_operators: true
    prefer_relative_imports: false # ปิดไว้เพราะเปิด always_use_package_imports
    prefer_spread_collections: true
    prefer_typing_uninitialized_variables: true
    prefer_void_to_null: true
    provide_deprecation_message: true
    public_member_api_docs: true
    recursive_getters: true
    require_trailing_commas: true
    secure_pubspec_urls: true
    sized_box_for_whitespace: true
    sized_box_shrink_expand: true
    slash_for_doc_comments: true
    sort_child_properties_last: true
    sort_constructors_first: true
    sort_pub_dependencies: true
    sort_unnamed_constructors_first: true
    test_types_in_equals: true
    throw_in_finally: true
    tighten_type_of_initializing_formals: true
    type_annotate_public_apis: true
    type_init_formals: true
    type_literal_in_constant_pattern: true
    unawaited_futures: true
    unintended_html_in_doc_comment: true
    unnecessary_await_in_return: true
    unnecessary_brace_in_string_interps: true
    unnecessary_breaks: true
    unnecessary_const: true
    unnecessary_constructor_name: true
    unnecessary_final: false # ขัดกับ prefer_final_locals
    unnecessary_getters_setters: true
    unnecessary_lambdas: true
    unnecessary_late: true
    unnecessary_library_directive: true
    unnecessary_library_name: true
    unnecessary_new: true
    unnecessary_null_aware_assignments: true

analyzer:
  errors:
    unused_element: ignore
    deprecated_member_use_from_same_package: ignore
  plugins:
    - custom_lint
  exclude:
    - buid/** # Exclude the buid directory
    - .dart_tool/** # Exclude the .dart_tool directory
    - "**/*.g.dart" # exclude every file that have namge .g.dart
`;

export const SONAR_RULES_LIST: SonarRuleDetail[] = [
  // 1. Naming
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
    id: 'dart:S115',
    name: 'Constant names should follow lowerCamelCase or UPPER_SNAKE_CASE',
    category: 'Naming',
    severity: 'MINOR',
    summary: 'ชื่อค่าคงที่ const ควรตั้งชื่อตาม lowerCamelCase ตาม Dart 3 guidelines',
    explanation: 'Dart แนะนำให้ใช้ lowerCamelCase สำหรับ constants เช่น defaultTimeout แทน DEFAULT_TIMEOUT เพื่อความสอดคล้อง',
    badCode: `// ❌ Non-Compliant
const int DEFAULT_TIMEOUT_SECONDS = 30;`,
    goodCode: `// ✅ Compliant
const int defaultTimeoutSeconds = 30;`,
    dartLintEquivalent: 'constant_identifier_names',
  },
  {
    id: 'dart:S114',
    name: 'File names should follow lowercase_with_underscores (snake_case)',
    category: 'Naming',
    severity: 'MAJOR',
    summary: 'ชื่อไฟล์ Dart (.dart) ทั้งหมดต้องเป็นตัวพิมพ์เล็กคั่นด้วย underscore',
    explanation: 'ระบบปฏิบัติการบางตัว (Case-insensitive) เช่น macOS/Windows อาจทำให้ import ผิดพลาดบน Linux server หากใช้ตัวพิมพ์ใหญ่ในชื่อไฟล์',
    badCode: `// ❌ Non-Compliant: UserProfileResponse.dart, Order_Model.dart`,
    goodCode: `// ✅ Compliant: user_profile_response.dart, order_model.dart`,
    dartLintEquivalent: 'file_names',
  },

  // 2. Parameters & Variables (Strict Final Rules)
  {
    id: 'dart:S1185',
    name: 'Prefer final parameters across functions and methods',
    category: 'Clean Code',
    severity: 'MAJOR',
    summary: 'ใส่ final ให้กับ parameters ของ function, constructor, เมธอด และ lambda callbacks เสมอ',
    explanation: 'การกำหนด final ให้ parameter ป้องกันการ Reassign ค่าใน Function Body โดยไม่ตั้งใจ (Immutability Best Practice)',
    badCode: `// ❌ Non-Compliant
UserProfile userFromJson(String str) {
  return UserProfile.fromJson(jsonDecode(str));
}`,
    goodCode: `// ✅ Compliant
UserProfile userFromJson(final String str) =>
    UserProfile.fromJson(jsonDecode(str) as Map<String, dynamic>);`,
    dartLintEquivalent: 'prefer_final_parameters',
  },
  {
    id: 'dart:S1186',
    name: 'Prefer final for local variables that are not reassigned',
    category: 'Clean Code',
    severity: 'MINOR',
    summary: 'ใช้ final ประกาศตัวแปร local เสมอหากไม่มีการ Reassign ค่าใหม่',
    explanation: 'ช่วยให้ Compiler ทำ Optimization และทำให้ผู้อ่านโค้ดมั่นใจได้ว่าค่านั้นจะไม่เปลี่ยนแปลงระหว่างทาง',
    badCode: `// ❌ Non-Compliant
var result = calculateTotal(items);
return result;`,
    goodCode: `// ✅ Compliant
final double result = calculateTotal(items);
return result;`,
    dartLintEquivalent: 'prefer_final_locals',
  },
  {
    id: 'dart:S1187',
    name: 'Always declare return types on functions and methods',
    category: 'Type Safety',
    severity: 'MAJOR',
    summary: 'ระบุ Return Type ให้กับฟังก์ชันและเมธอดทุกตัวอย่างชัดเจนเสมอ',
    explanation: 'การละเว้น Return type ทำให้ Dart ทำ Type inference เป็น dynamic ซึ่งสูญเสีย Type Safety ใน compile-time',
    badCode: `// ❌ Non-Compliant
handlePayment(final String orderId) { ... }`,
    goodCode: `// ✅ Compliant
Future<bool> handlePayment(final String orderId) async { ... }`,
    dartLintEquivalent: 'always_declare_return_types',
  },

  // 3. Architecture & Immutability
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
    id: 'dart:S1105',
    name: 'Sort constructors first before fields and methods',
    category: 'Architecture',
    severity: 'INFO',
    summary: 'จัดวาง Constructor ไว้ด้านบนสุดของคลาสก่อน Field และ Method อื่นๆ',
    explanation: 'โครงสร้างคลาสที่เป็นระเบียบช่วยให้ทีมอ่าน Constructor Signature และ Factory Methods ได้ทันทีที่เปิดดูไฟล์',
    badCode: `// ❌ Non-Compliant (Methods defined before constructor)
class Item {
  void doSomething() {}
  final String id;
  Item(this.id);
}`,
    goodCode: `// ✅ Compliant
class Item {
  const Item({required this.id});
  factory Item.fromJson(...) => ...;
  final String id;
}`,
    dartLintEquivalent: 'sort_constructors_first',
  },

  // 4. Type Safety & Reliability
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
    summary: 'หลีกเลี่ยงการ cast \`json["price"] as double\` ตรงๆ ให้ใช้ \`(json["price"] as num?)?.toDouble()\` แทน',
    explanation: 'REST API Backend มักส่งตัวเลข integer เช่น 100 มาแทน float 100.0 ซึ่งใน Dart runtime การทำ \`100 as double\` จะโยน TypeError Crash ทันที การแปลงผ่าน num ปลอดภัย 100%',
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
