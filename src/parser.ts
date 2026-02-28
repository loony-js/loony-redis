export class RESPParser {
  private buffer: Buffer = Buffer.alloc(0);

  push(chunk: Buffer) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    const responses: any[] = [];

    while (true) {
      const result = this.parseValue();
      if (result === undefined) break;
      responses.push(result);
    }

    return responses;
  }

  private parseValue(): any | undefined {
    if (this.buffer.length === 0) return undefined;

    const type = this.buffer[0];

    switch (type) {
      case 43: // +
        return this.parseSimpleString();
      case 45: // -
        return this.parseError();
      case 58: // :
        return this.parseInteger();
      case 36: // $
        return this.parseBulkString();
      case 42: // *
        return this.parseArray();
      default:
        throw new Error("Unknown RESP type");
    }
  }

  private readLine(): Buffer | undefined {
    const idx = this.buffer.indexOf("\r\n");
    if (idx === -1) return undefined;

    const line = this.buffer.subarray(0, idx);
    this.buffer = this.buffer.subarray(idx + 2);
    return line;
  }

  private parseSimpleString() {
    const snapshot = this.buffer;
    const line = this.readLine();
    if (!line) {
      this.buffer = snapshot;
      return undefined;
    }
    return line.subarray(1).toString();
  }

  private parseError() {
    const snapshot = this.buffer;
    const line = this.readLine();
    if (!line) {
      this.buffer = snapshot;
      return undefined;
    }
    return new Error(line.subarray(1).toString());
  }

  private parseInteger() {
    const snapshot = this.buffer;
    const line = this.readLine();
    if (!line) {
      this.buffer = snapshot;
      return undefined;
    }
    return Number(line.subarray(1).toString());
  }

  private parseBulkString() {
    const snapshot = this.buffer;

    const header = this.readLine();
    if (!header) {
      this.buffer = snapshot;
      return undefined;
    }

    const length = Number(header.subarray(1).toString());

    if (length === -1) return null;

    if (this.buffer.length < length + 2) {
      this.buffer = snapshot;
      return undefined;
    }

    const value = this.buffer.subarray(0, length);
    const crlf = this.buffer.subarray(length, length + 2);

    if (crlf[0] !== 13 || crlf[1] !== 10) {
      throw new Error("Invalid bulk string termination");
    }

    this.buffer = this.buffer.subarray(length + 2);
    return value; // Return Buffer (binary safe)
  }

  private parseArray() {
    const snapshot = this.buffer;

    const header = this.readLine();
    if (!header) {
      this.buffer = snapshot;
      return undefined;
    }

    const count = Number(header.subarray(1).toString());

    if (count === -1) return null;

    const arr = [];

    for (let i = 0; i < count; i++) {
      const value = this.parseValue();
      if (value === undefined) {
        this.buffer = snapshot;
        return undefined;
      }
      arr.push(value);
    }

    return arr;
  }
}
