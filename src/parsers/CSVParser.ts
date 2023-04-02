import csv from 'csv-parser';
import readline from 'readline';
import fs from 'fs';

import BaseParser from './BaseParser';

export default abstract class CSVParser extends BaseParser {
  protected async startStream(filePath: string): Promise<void> {
    if (this.isParsing) {
      throw new Error(`Parser is still parsing. file path:${filePath}`);
    }
    this.isParsing = true;
    this.curLine_ = 0;
    const inStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: inStream,
    });
    this.csvParser = csv();
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

  protected csvParser: csv.CsvParser = csv();

  private curLine_: number = 0;

  private isParsing: boolean = false;
}
