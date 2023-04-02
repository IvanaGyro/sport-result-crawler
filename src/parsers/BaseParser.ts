import csv from 'csv-parser';
import readline from 'readline';
import fs from 'fs';

import Case from '../Case';

export default abstract class BaseParser {
  public constructor(protected filePath_: string) {}

  public abstract parse(verify: boolean): Promise<Case[]>;

  protected async startStream(): Promise<void> {
    if (this.isParsing) {
      throw new Error(`Parser is still parsing. file path:${this.filePath}`);
    }
    this.isParsing = true;
    this.curLine_ = 0;
    const inStream = fs.createReadStream(this.filePath);
    const rl = readline.createInterface({
      input: inStream,
    });
    // eslint-disable-next-line no-restricted-syntax
    for await (const line of rl) {
      this.curLine_ += 1;
      this.csvParser.write(line);
      this.csvParser.write('\n');
    }
    this.isParsing = false;
  }

  protected get curLine() {
    return this.curLine_;
  }

  public get filePath(): string {
    return this.filePath_;
  }

  public set filePath(filePath_: string) {
    if (this.isParsing) {
      throw new Error(`Parser is still parsing. file path:${this.filePath}`);
    }
    this.filePath_ = filePath_;
    this.csvParser = csv();
  }

  protected csvParser: csv.CsvParser = csv();

  private curLine_: number = 0;

  private isParsing: boolean = false;
}
