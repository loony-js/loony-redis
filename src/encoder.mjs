export function encodeCommand(command, args = []) {
  const parts = [command, ...args].map(String);

  let result = `*${parts.length}\r\n`;
  for (const part of parts) {
    result += `$${Buffer.byteLength(part)}\r\n${part}\r\n`;
  }

  return result;
}
