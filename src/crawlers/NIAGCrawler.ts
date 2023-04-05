import got from 'got';
import path from 'path';
import { writeFileSync } from 'fs';
import HistoryResultPage from './HistoryResultPage';

import { staticImplements } from '../utilities';
import BaseCrawler from './BaseCrawler';

/**
 * This class is for downloading accident data of TYC.
 */
@staticImplements<BaseCrawler>()
export default class NIAGCrawler {
  private static readonly baseURI = 'https://data.tycg.gov.tw';

  static async downloadAll(outDir: string): Promise<void[]> {
    // fs.mkdirSync(outDir, { recursive: true });
    if (outDir != null) {
      // save files
    }
    return [];
  }

  static async downloadYear(
    yearOfSite: number,
    yearOfResult?: number,
    outDir?: string,
  ): Promise<string[]> {
    const siteLinks: Record<number, string> = {
      2022: 'https://111nug.ntsu.edu.tw/public/history_result.aspx',
    };
    const link = siteLinks[yearOfSite];
    if (link == null) {
      throw Error(
        `Only these values of yearOfSite are support: ${Object.keys(siteLinks).join(', ')}`,
      );
    }

    const seenPages: boolean[] = [];
    // There are 10 child pages at once at most, so we can simply use recurance and
    // not implement PromisePool.
    const crawlPages = async (waitingPages: HistoryResultPage[]) => Promise.all(
      waitingPages.map(async (page, index) => {
        if (seenPages[page.pageIndex()!]) {
          return;
        }
        seenPages[page.pageIndex()!] = true;
        console.log(`crawling page: ${page.pageIndex()}`);
        if (outDir != null) {
          writeFileSync(
            path.join(outDir, `${yearOfResult || 'all'}-from_${yearOfSite}-${page.pageIndex()}.html`),
            await page.content(),
          );
        }
        // We can get the most child pages which are not seen from the last page.
        if (index === waitingPages.length - 1) {
          await crawlPages(await page.childPages());
        }
      }),
    );
    const firstPage = new HistoryResultPage(link, { year: yearOfResult });
    await crawlPages(await firstPage.childPages());

    return [];
  }

  static async download(dataPageLink: string, outDir?: string): Promise<string> {
    if (outDir != null) {
      // save file
    }
    return got(dataPageLink, {
      http2: true,
    }).text();
  }
}
