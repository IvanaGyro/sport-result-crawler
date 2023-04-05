import got from 'got';
import * as cheerio from 'cheerio';
import { CookieJar } from 'tough-cookie';

export default class HistoryResultPage {
  private url: string;

  // HTML content of the page
  private _content: string | undefined;

  private parentState: Record<string, string> | undefined;

  private parameters: Record<string, string | number | undefined>;

  private _pageIndex: number | undefined;

  private myState: Record<string, string> = {};

  private cookieJar: CookieJar | undefined;

  private $: cheerio.CheerioAPI | undefined;

  constructor(
    url: string,
    parameters?: Record<string, string | number | undefined>,
    parentState?: Record<string, string>,
    pageIndex?: number,
    cookieJar?: CookieJar,
  ) {
    this.url = url;
    this.parentState = parentState;
    this.parameters = parameters || {};
    this._pageIndex = pageIndex;
    this.cookieJar = cookieJar || new CookieJar();
  }

  private encodeParameters(): Record<string, string | number> {
    let year: number | undefined;
    if (this.parameters?.year != null) {
      year = Number(this.parameters.year) - 1911;
    }
    const encoded: Record<string, string | number> = {
      ctl00$ContentPlaceHolder1$DD_Race_07_Name: this.parameters?.sport || '',
      ctl00$ContentPlaceHolder1$DD_Meet_Year: year || '',
      ctl00$ContentPlaceHolder1$TB_Unit_Name: '',
      ctl00$ContentPlaceHolder1$TB_Player_Name: '',
      ctl00$ContentPlaceHolder1$TB_Race_00_Name: this.parameters?.eventType || '',
    };
    if (this.parameters?.page == null) {
      encoded.ctl00$ContentPlaceHolder1$Btn_Search = '查詢';
    } else {
      encoded.__EVENTTARGET = this.parameters?.eventTarget!;
      encoded.__EVENTARGUMENT = this.parameters?.page!;
    }
    return encoded;
  }

  private async crawl(): Promise<void> {
    if (this.parentState == null) {
      this._content = await got(this.url, {
        http2: true,
        cookieJar: this.cookieJar,
      }).text();
    } else {
      this._content = await got
        .post(this.url, {
          http2: true,
          cookieJar: this.cookieJar,
          form: {
            ...this.parentState,
            ...this.encodeParameters(),
          },
        })
        .text();
    }

    // assign myState
    this.$ = cheerio.load(this._content);
    ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__VIEWSTATEENCRYPTED', '__EVENTVALIDATION'].forEach(
      (id) => {
        const value = this.$!(`#${id}`).val();
        if (value == null || Array.isArray(value)) {
          throw Error(`Fail to get ${id}`);
        }
        this.myState[id] = value;
      },
    );
  }

  public async resultTable(): Promise<string> {
    if (this.$ == null) {
      await this.crawl();
    }
    return this.$!('#ctl00_ContentPlaceHolder1_GridView1').text();
  }

  public async childPages(): Promise<HistoryResultPage[]> {
    if (this.$ == null) {
      await this.crawl();
    }
    if (this.parentState == null) {
      return [
        new HistoryResultPage(
          this.url,
          this.parameters,
          this.myState,
          1,
          this.cookieJar,
        ),
      ];
    }
    return this.$!('a[href*="Page$"]')
      .map((_, elm) => {
        const href = this.$!(elm).attr('href');
        const eventParameters: Record<string, string> = {
          eventTarget: '',
          page: '',
        };
        let childPageIndex: number | undefined;
        if (href != null) {
          const result = /'(.*?)','(.*?)'/.exec(href);
          if (result == null) {
            throw Error(`Fail to parse the link of the child page: ${href}`);
          }
          [eventParameters.eventTarget, eventParameters.page] = result.slice(1);
          if (result[2].startsWith('Page$')) {
            childPageIndex = Number(result[2].substring(5));
          }
        }
        return new HistoryResultPage(
          this.url,
          {
            ...this.parameters,
            ...eventParameters,
          },
          this.myState,
          childPageIndex,
          this.cookieJar,
        );
      })
      .get();
  }

  public pageIndex(): number | undefined {
    return this._pageIndex;
  }

  public async content(): Promise<string> {
    if (this.$ == null) {
      await this.crawl();
    }
    return this._content!;
  }
}
