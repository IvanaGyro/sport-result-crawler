/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import path from 'path';
import fs from 'fs';
import NIAGrawler from './src/crawlers/NIAGCrawler';
import NIAGParser from './src/parsers/NIAGParser';
import CSVExporter from './src/exporters/CSVExporter';
import BigQueryExporter from './src/exporters/BigQueryExporter';
import NTUMarathonCrawler from './src/crawlers/NTUMarathonCrawler';
import NTUMarathonParser from './src/parsers/NTUMarathonParser';

import * as luxon from 'luxon';


// NIAGrawler.downloadYear(2022, 2021, dataDir);
// NIAGrawler.downloadYear(2022, undefined, dataDir);

const dataDir = 'data';
const outputsDir = 'outputs';

async function getNIAGData() {
  const content = await NIAGrawler.download(
    'https://111nug.ntsu.edu.tw/Public/Race/Report_Score.aspx?id=1046',
  );
  const records = await new NIAGParser().parse(content, false);
  // BigQueryExporter.export(records);
  CSVExporter.export(`${outputsDir}/400-f.csv`, records);
}
// getNIAGData();

async function parseAndExportNIAGHistoryResults() {
  const parser = new NIAGParser();
  const dirPath = path.join(dataDir, 'NIAG-from_2022');
  const files = fs.readdirSync(dirPath);
  const results = await Promise.all(
    files.slice(400, 500).map(async (filename) => {
      const html = fs.readFileSync(path.join(dirPath, filename), 'utf8');
      return parser.parseHistoryResults(html);
    }),
  );
  await BigQueryExporter.export(results.flat());
}
parseAndExportNIAGHistoryResults();

async function crawlNTUMarathon() {
  await NTUMarathonCrawler.downloadAll(path.join(dataDir, 'ntu_2022_marathon'));
}
// crawlNTUMarathon();

function parseNTUMarathon() {
  const parser = new NTUMarathonParser();
  const dirPath = path.join(dataDir, 'ntu_2022_marathon');
  const files = fs.readdirSync(dirPath);
  try {
    files.forEach(async (filename) => {
      const results = await parser.parse(fs.readFileSync(path.join(dirPath, filename), 'utf8'));
      console.log(results);
    });
  } catch {
    //
  }
}
// parseNTUMarathon();
