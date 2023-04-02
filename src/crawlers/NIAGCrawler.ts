import got from 'got';

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

  static async download(dataPageLink: string, outDir?: string): Promise<string> {
    if (outDir != null) {
      // save file
    }
    return got(dataPageLink, {
      http2: true,
    }).text();
  }
}
