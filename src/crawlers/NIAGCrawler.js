var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import got from 'got';
import { staticImplements } from '../utilities';
/**
 * This class is for downloading accident data of TYC.
 */
let NIAGCrawler = class NIAGCrawler {
    static async downloadAll(outDir) {
        // fs.mkdirSync(outDir, { recursive: true });
        if (outDir != null) {
            // save files
        }
        return [];
    }
    static async download(dataPageLink, outDir) {
        if (outDir != null) {
            // save file
        }
        return got(dataPageLink, {
            http2: true,
        }).text();
    }
};
NIAGCrawler.baseURI = 'https://data.tycg.gov.tw';
NIAGCrawler = __decorate([
    staticImplements()
], NIAGCrawler);
export default NIAGCrawler;
