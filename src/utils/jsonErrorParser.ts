export interface JsonErrorInfo {
  message: string;
  thaiHint: string;
  line: number | null;
  column: number | null;
  position: number | null;
}

export function parseJsonError(errorMsg: string, jsonText: string): JsonErrorInfo {
  if (!errorMsg) {
    return { message: "", thaiHint: "", line: null, column: null, position: null };
  }

  let line: number | null = null;
  let col: number | null = null;
  let pos: number | null = null;

  // 1. Line & Column match (e.g. line 7 column 5)
  const lineColMatch = errorMsg.match(/line\s*(\d+)[,\s]+col(?:umn)?\s*(\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    col = parseInt(lineColMatch[2], 10);
  }

  // 2. Position match (e.g. position 135)
  const posMatch = errorMsg.match(/position\s*(\d+)/i);
  if (posMatch) {
    pos = parseInt(posMatch[1], 10);
  }

  // 3. Coordinate match (e.g. 7:5)
  if (line === null) {
    const coordMatch = errorMsg.match(/(\d+):(\d+)/);
    if (coordMatch) {
      line = parseInt(coordMatch[1], 10);
      col = parseInt(coordMatch[2], 10);
    }
  }

  // 4. Line only match (e.g. line 7)
  if (line === null) {
    const lineOnlyMatch = errorMsg.match(/line\s*(\d+)/i);
    if (lineOnlyMatch) {
      line = parseInt(lineOnlyMatch[1], 10);
    }
  }

  // If position is found, derive line and col
  if (pos !== null && pos >= 0 && jsonText) {
    const textBefore = jsonText.slice(0, pos);
    const lines = textBefore.split("\n");
    const calculatedLine = lines.length;
    const calculatedCol = lines[lines.length - 1].length + 1;

    if (line === null) line = calculatedLine;
    if (col === null) col = calculatedCol;
  }

  // If line & col are known but position is not, compute position
  if (pos === null && line !== null && jsonText) {
    const lines = jsonText.split("\n");
    let offset = 0;
    for (let i = 0; i < line - 1 && i < lines.length; i++) {
      offset += lines[i].length + 1;
    }
    offset += (col ? col - 1 : 0);
    pos = Math.min(offset, jsonText.length);
  }

  // Thai hint
  let thaiHint = "โปรดตรวจสอบความถูกต้องของไวยากรณ์ JSON";
  const lower = errorMsg.toLowerCase();

  if (lower.includes("expected ','") || lower.includes("expected colon") || lower.includes("after property value")) {
    thaiHint = "อาจลืมใส่เครื่องหมายจุลภาค (,) คั่นระหว่างฟิลด์ หรือลืมใส่เครื่องหมายโคลอน (:)";
  } else if (lower.includes("unexpected token }") || lower.includes("unexpected token ]")) {
    thaiHint = "อาจมีเครื่องหมายจุลภาค (,) เกินที่ตัวสุดท้ายก่อนปิดวงเล็บ (Trailing Comma) หรือวงเล็บปิดไม่ตรงคู่";
  } else if (lower.includes("unexpected token '") || lower.includes("single quote")) {
    thaiHint = "JSON รองรับเฉพาะเครื่องหมายคำพูดคู่ (\") เท่านั้น ห้ามใช้ Single quote";
  } else if (lower.includes("expected double-quoted") || lower.includes("unquoted")) {
    thaiHint = "ชื่อ Property (Key) ต้องครอบด้วยเครื่องหมายคำพูดคู่ (\") เสมอ";
  } else if (lower.includes("unexpected end of json") || lower.includes("unexpected end of data")) {
    thaiHint = "ข้อมูล JSON ยังไม่สมบูรณ์ หรือลืมปิดวงเล็บปีกกา/ก้ามปู (}, ])";
  } else if (lower.includes("unexpected token <")) {
    thaiHint = "ข้อความนี้ดูเหมือน HTML/XML ไม่ใช่ JSON ที่ถูกต้อง";
  } else if (line !== null) {
    thaiHint = "พบข้อผิดพลาดที่บรรทัด " + line + (col ? " คอลัมน์ " + col : "");
  }

  return {
    message: errorMsg,
    thaiHint,
    line,
    column: col,
    position: pos,
  };
}

export function attemptFixJson(raw: string): { fixed: string | null; success: boolean } {
  if (!raw.trim()) return { fixed: null, success: false };

  try {
    const parsed = JSON.parse(raw);
    return { fixed: JSON.stringify(parsed, null, 2), success: true };
  } catch {
    // try clean
  }

  let text = raw;

  // 1. Remove comments
  text = text.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "$1");

  // 2. Replace single-quoted strings and keys with double quotes
  text = text.replace(/'((?:\\.|[^'])*)'/g, (_, content: string) => {
    const unescaped = content.replace(/\\'/g, "'");
    const escaped = unescaped.replace(/"/g, '\\"');
    return '"' + escaped + '"';
  });

  // 3. Fix unquoted keys
  text = text.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

  // 4. Remove trailing commas
  text = text.replace(/,\s*([}\]])/g, "$1");

  try {
    const parsed = JSON.parse(text);
    return { fixed: JSON.stringify(parsed, null, 2), success: true };
  } catch {
    return { fixed: null, success: false };
  }
}
