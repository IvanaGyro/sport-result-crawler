var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TYCCrawler_1;
import fs from 'fs';
import stream from 'stream';
import util from 'util';
import cheerio from 'cheerio';
import got from 'got';
import { staticImplements } from '../utilities';
/**
 * This class is for downloading accident data of TYC.
 */
let TYCCrawler = TYCCrawler_1 = class TYCCrawler {
    static async downloadAll(outDir) {
        fs.mkdirSync(outDir, { recursive: true });
        const data = await got(`${TYCCrawler_1.baseURI}/opendata/datalist/search?page=0&organize=380130000C&allText=桃園市交通事故資料表`, {
            http2: true,
        }).text();
        const $ = cheerio.load(data);
        const dataPageLinks = $('li.list-group-item').map((_, el) => $('a', el).first().attr('href'));
        return Promise.all(dataPageLinks.map((_, link) => TYCCrawler_1.downloadCSV(link, outDir)));
    }
    static async downloadCSV(dataPageLink, outDir) {
        const page = await got(`${TYCCrawler_1.baseURI}${dataPageLink}`, {
            http2: true,
        }).text();
        const $page = cheerio.load(page);
        const downloadLinkElement = $page("a[title$='.csv'][href*='/download?']");
        const downloadLink = downloadLinkElement.attr('href');
        const filename = downloadLinkElement.attr('title');
        const pipeline = util.promisify(stream.pipeline);
        // eslint-disable-next-line no-console
        console.log(`downloading ${filename}`);
        return pipeline(got.stream(`${TYCCrawler_1.baseURI}${downloadLink}`), fs.createWriteStream(`${outDir}${filename}`));
    }
};
TYCCrawler.baseURI = 'https://data.tycg.gov.tw';
TYCCrawler = TYCCrawler_1 = __decorate([
    staticImplements()
], TYCCrawler);
export default TYCCrawler;
