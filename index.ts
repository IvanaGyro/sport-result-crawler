/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import util from 'util';

import TYCCrawler from './src/crawlers/TYCCrawler';
import TYCParser from './src/parsers/TYCParser';
import TPEParser from './src/parsers/TPEParser';
import { ShapeOfFields, generateShapeOfFields } from './src/tools/shapeOfFields';
import CSVExporter from './src/exporters/CSVExporter';

const dataDir = 'data';
const outputsDir = 'outputs';

async function downloadTYCData() {
  return TYCCrawler.downloadAll(dataDir);
}

async function parseAndExportTYCDate() {
  const allCases = await Promise.all([
    new TYCParser(`${dataDir}/tyc/101.csv`).parse(),
    new TYCParser(`${dataDir}/tyc/102.csv`).parse(),
    new TYCParser(`${dataDir}/tyc/traffic_accident_103.csv`).parse(),
    new TYCParser(`${dataDir}/tyc/traffic_accident_104.csv`).parse(),
    new TYCParser(`${dataDir}/tyc/traffic_accident_105.csv`).parse(),
    // not support yet
    // new TYCParser(`${dataDir}/tyc/traffic106_10809_fix.csv`).parse(),
    // new TYCParser(`${dataDir}/tyc/traffic109_fix.csv`).parse(),
    // new TYCParser(`${dataDir}/tyc/traffic11011_fix.csv`).parse(),
  ]);

  CSVExporter.export(
    `${outputsDir}/tyc/tyc-2012_2016.csv`,
    ([] as typeof allCases[0]).concat(...allCases),
    /* partyNumber= */ 2,
  );
}

async function parseAndExportTPEDate() {
  const allCases = await Promise.all([
    new TPEParser(`${dataDir}/tpe/hackathon/105-A1_A4.csv`).parse(true),
    new TPEParser(`${dataDir}/tpe/hackathon/106-A1_A4.csv`).parse(true),
    new TPEParser(`${dataDir}/tpe/hackathon/107-A1_A4.csv`).parse(true),
    new TPEParser(`${dataDir}/tpe/hackathon/108-A1_A4.csv`).parse(true),
    new TPEParser(`${dataDir}/tpe/hackathon/109-A1_A4.csv`).parse(true),
  ]);

  CSVExporter.export(
    `${outputsDir}/tpe/tpe-2016_2020.csv`,
    ([] as typeof allCases[0]).concat(...allCases),
  );
}

async function generateTYCShapeOfFields() {
  const outDir = `${outputsDir}/tyc/`;
  const excludedFields = new Set([
    '村里',
    '鄰',
    '街道',
    '段',
    '巷',
    '弄',
    '號',
    '公尺處',
    '街道1',
    '段1',
    '側',
    '附近',
    '道路',
    '公里',
    '公尺處1',
    '向',
    '車道',
    '平交道',
    '公里1',
    '公尺處2',
    '附近1',
  ]);

  const shapeOfFields: ShapeOfFields = {};

  await generateShapeOfFields(`${outDir}101.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${outDir}102.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${outDir}traffic_accident_103.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${outDir}traffic_accident_104.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${outDir}traffic_accident_105.csv`, excludedFields, shapeOfFields);
  console.log(util.inspect(shapeOfFields, { showHidden: false, depth: null, colors: true }));
}

async function generateTPEShapeOfFields() {
  const tpeDataDir = `${dataDir}/tpe/`;
  const excludedFields = new Set([
    '編號',
    '發生時間',
    '肇事地點',
    '案號',
    '路段一',
    '路段一段',
    '巷',
    '弄',
    '號',
    '路段二',
    '路段二段',
    '路口',
    '路段', // `路段一` + `路段一段` + '段'
    '路段2', // `路段二` + `路段二段` + '段'
    'X',
    'Y',
    'OccurAddr1_12',
    'OccurAddr2_5',
    'OccurAddr1_9_1(號)',
    '巷(岔路)',
    '弄(岔路)',
    '號(岔路)',
    '位置(岔路)',
    '事後報案日',
    'BirthdayYear',
    'BirthdayMonth',
    'BirthdayDay',
    '執勤時段',
    '雙分',
    '件數', // == '案號'?
    'PoliceStation',
    '肇因研判O', // 肇因詳細中文敘述
  ]);

  const shapeOfFields: ShapeOfFields = {};

  await generateShapeOfFields(`${tpeDataDir}hackathon/105-A1_A4.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${tpeDataDir}hackathon/106-A1_A4.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${tpeDataDir}hackathon/107-A1_A4.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${tpeDataDir}hackathon/108-A1_A4.csv`, excludedFields, shapeOfFields);
  await generateShapeOfFields(`${tpeDataDir}hackathon/109-A1_A4.csv`, excludedFields, shapeOfFields);
  // console.log(util.inspect(shapeOfFields, { showHidden: false, depth: null, colors: true }));
  console.log(JSON.stringify(shapeOfFields, null, 2));
}

// generateTPEShapeOfFields();
parseAndExportTPEDate();
