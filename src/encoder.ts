import { Buffer } from "buffer";

export function encodeCommand(command: string, args: any[] = []): Buffer {
  const parts = [command, ...args];

  const buffers: Buffer[] = [];
  buffers.push(Buffer.from(`*${parts.length}\r\n`));

  for (const part of parts) {
    if (part === undefined) {
      throw new Error("Redis argument cannot be undefined");
    }

    let value: Buffer;

    if (Buffer.isBuffer(part)) {
      value = part;
    } else {
      value = Buffer.from(String(part));
    }

    buffers.push(Buffer.from(`$${value.length}\r\n`));
    buffers.push(value);
    buffers.push(Buffer.from("\r\n"));
  }

  return Buffer.concat(buffers);
}
