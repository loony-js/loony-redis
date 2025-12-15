export class RESPParser {
  constructor() {
    this.buffer = "";
    this.queue = [];
  }

  push(chunk) {
    this.buffer += chunk;
    return this.parse();
  }

  parse() {
    const responses = [];

    while (true) {
      const res = this.parseValue();
      if (res === null) break;
      responses.push(res);
    }

    return responses;
  }

  parseValue() {
    if (!this.buffer.length) return null;

    const type = this.buffer[0];

    if (type === "+") return this.parseSimpleString();
    if (type === "-") return this.parseError();
    if (type === ":") return this.parseInteger();
    if (type === "$") return this.parseBulkString();
    if (type === "*") return this.parseArray();

    throw new Error("Unknown RESP type");
  }

  readLine() {
    const idx = this.buffer.indexOf("\r\n");
    if (idx === -1) return null;
    const line = this.buffer.slice(0, idx);
    this.buffer = this.buffer.slice(idx + 2);
    return line;
  }

  parseSimpleString() {
    const line = this.readLine();
    if (line === null) return null;
    return line.slice(1);
  }

  parseError() {
    const line = this.readLine();
    if (line === null) return null;
    throw new Error(line.slice(1));
  }

  parseInteger() {
    const line = this.readLine();
    if (line === null) return null;
    return Number(line.slice(1));
  }

  parseBulkString() {
    const line = this.readLine();
    if (line === null) return null;

    const length = Number(line.slice(1));
    if (length === -1) return null;

    if (this.buffer.length < length + 2) return null;

    const value = this.buffer.slice(0, length);
    this.buffer = this.buffer.slice(length + 2);
    return value;
  }

  parseArray() {
    const line = this.readLine();
    if (line === null) return null;

    const count = Number(line.slice(1));
    const arr = [];

    for (let i = 0; i < count; i++) {
      const val = this.parseValue();
      if (val === null) return null;
      arr.push(val);
    }

    return arr;
  }
}
