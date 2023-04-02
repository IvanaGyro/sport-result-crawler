import fs from 'fs';
import stream from 'stream';
import util from 'util';

import cheerio from 'cheerio';
import got from 'got';

import { staticImplements } from '../utilities';
import BaseCrawler from './BaseCrawler';

/**
 * This class is for downloading accident data of TYC.
 */
@staticImplements<BaseCrawler>()
export default class TYCCrawler {
  private static readonly baseURI = 'https://data.tycg.gov.tw';

  static async downloadAll(outDir: string): Promise<void[]> {
    fs.mkdirSync(outDir, { recursive: true });

    const data = await got(
      `${TYCCrawler.baseURI}/opendata/datalist/search?page=0&organize=380130000C&allText=桃園市交通事故資料表`,
      {
        http2: true,
      },
    ).text();

    const $ = cheerio.load(data);
    const dataPageLinks = $('li.list-group-item').map((_, el) => $('a', el).first().attr('href'));

    return Promise.all(dataPageLinks.map((_, link) => TYCCrawler.downloadCSV(link, outDir)));
  }

  private static async downloadCSV(dataPageLink: string, outDir: string): Promise<void> {
    const page = await got(`${TYCCrawler.baseURI}${dataPageLink}`, {
      http2: true,
    }).text();

    const $page = cheerio.load(page);

    const downloadLinkElement = $page("a[title$='.csv'][href*='/download?']");
    const downloadLink = downloadLinkElement.attr('href');
    const filename = downloadLinkElement.attr('title');

    const pipeline = util.promisify(stream.pipeline);
    // eslint-disable-next-line no-console
    console.log(`downloading ${filename}`);
    return pipeline(
      got.stream(`${TYCCrawler.baseURI}${downloadLink}`),
      fs.createWriteStream(`${outDir}${filename}`),
    );
  }
}
