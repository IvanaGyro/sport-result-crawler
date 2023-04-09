import fs from 'fs';
import got from 'got';
import path from 'path';
import util from 'util';
import BaseCrawler from './BaseCrawler';

import { staticImplements } from '../utilities';

@staticImplements<BaseCrawler>()
export default class NTUMarathonCrawler {
  private static async downloadGroup(
    ourDir: string,
    baseURL: string,
    begin: number,
    end: number,
  ): Promise<string[]> {
    const writeFile = util.promisify(fs.writeFile);
    const downloadAndSavePage = async (athleteNo: number) => {
      const html = await got(`${baseURL}${athleteNo}`, {
        http2: true,
      }).text();
      await writeFile(path.join(ourDir, `${athleteNo}.html`), html);
      return html;
    };
    // Query 20 pages once at most because Node.js cannot handle too many
    // queries at the same time.
    const pages = [];
    for (let i = begin; i < end; i += 20) {
      const tasks = [];
      for (let athleteNo = i; athleteNo < Math.min(i + 20, end); athleteNo += 1) {
        tasks.push(downloadAndSavePage(athleteNo));
      }
      // eslint-disable-next-line no-await-in-loop
      pages.push(...(await Promise.all(tasks)));
    }
    return pages;
  }

  static async downloadAll(outDir: string): Promise<string[]> {
    fs.mkdirSync(outDir, { recursive: true });
    const girlResults = await NTUMarathonCrawler.downloadGroup(
      outDir,
      'https://www.bravelog.tw/athlete/472/00',
      3001,
      3961,
    );
    const boyResults = await NTUMarathonCrawler.downloadGroup(
      outDir,
      'https://www.bravelog.tw/athlete/471/00',
      1001,
      2440,
    );
    return [...girlResults, ...boyResults];
  }
}
