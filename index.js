/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import NIAGrawler from './src/crawlers/NIAGCrawler';
import NIAGParser from './src/parsers/NIAGParser';
import CSVExporter from './src/exporters/CSVExporter';
const dataDir = 'data';
const outputsDir = 'outputs';
async function getNIAGData() {
    const content = await NIAGrawler.download('https://111nug.ntsu.edu.tw/Public/Race/Report_Score.aspx?id=1046');
    const records = await new NIAGParser().parse(content, false);
    CSVExporter.export(`${outputsDir}/400-f.csv`, records);
}
getNIAGData();
