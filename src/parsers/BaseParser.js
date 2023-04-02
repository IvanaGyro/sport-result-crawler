import csv from 'csv-parser';
import readline from 'readline';
import fs from 'fs';
export default class BaseParser {
    constructor(filePath_) {
        this.filePath_ = filePath_;
        this.csvParser = csv();
        this.curLine_ = 0;
        this.isParsing = false;
    }
    async startStream() {
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
    get curLine() {
        return this.curLine_;
    }
    get filePath() {
        return this.filePath_;
    }
    set filePath(filePath_) {
        if (this.isParsing) {
            throw new Error(`Parser is still parsing. file path:${this.filePath}`);
        }
        this.filePath_ = filePath_;
        this.csvParser = csv();
    }
}
