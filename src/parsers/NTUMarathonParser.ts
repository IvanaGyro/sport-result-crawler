/* eslint-disable class-methods-use-this */
import * as cheerio from 'cheerio';
import * as luxon from 'luxon';
import shortUUID from 'short-uuid';
import HTMLParser from './HTMLParser';
import AthleteResult, { Gender, Country } from '../AthleteResult';
import SportEvent, {
  Game, Sport, Category, FieldAndTrackEvent,
} from '../SportEvent';

export default class NTUMarathonParser extends HTMLParser {
  private static parseScore(scoreString: string): number {
    const scoreRegex = /((\d+):)?(\d+):(\d+(\.\d+)?)/.exec(scoreString);
    if (scoreRegex == null) {
      throw new Error(`Unexpected score: ${scoreString}`);
    }
    const hours = scoreRegex[2] || 0;
    const minutes = scoreRegex[3] || 0;
    const seconds = scoreRegex[4] || 0;
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public async parse(html: string): Promise<AthleteResult[]> {
    const $ = cheerio.load(html);

    // 分組排名
    const rankString = $('.rankcard-content-top + div > div:last-child > p:last-child')
      .text()
      .trim();
    if (rankString === '—') {
      // The athlete didn't participate.
      return [];
    }
    if (!/^\d+\/\d+$/.test(rankString)) {
      throw new Error(`Unexpected rank: ${rankString}`);
    }
    const rank = Number(rankString.split('/')[0]);

    // date
    const dateString = $('.contest-date').text().trim(); // 2023-04-08 (六)
    let date = luxon.DateTime.fromFormat(dateString.split(' ')[0], 'yyyy-MM-dd', {
      zone: 'Asia/Taipei',
    });
    date = date.set({ hour: 8, minute: 50 });

    // name, category, gender
    const nameElement = $('h1')[0];
    const name = $(nameElement).text().trim();
    const titleCard = nameElement.parent?.parent;
    const categoryString = $('div:last-child > span:nth-child(2)', titleCard).text().trim();
    const category = categoryString === '女子組' ? Category.FEMALE : Category.MALE;
    const genderString = $('div:last-child > span:nth-child(3)', titleCard).text().trim();
    const gender = genderString === '女' ? Gender.FEMALE : Gender.MALE;

    // isTrans, division
    // Athletes were divided into three groups based on their expected completion time.
    // The group is coded as `division` here.
    const athleteNoString = $(':scope > div:nth-child(2)', titleCard).text().trim();
    const athleteNo = Number(athleteNoString);
    const isTrans = athleteNo === 3268;
    let division;
    if (
      (athleteNo >= 3001 && athleteNo <= 3064) // female
      || (athleteNo >= 1001 && athleteNo <= 1292) // male
    ) {
      division = '25 分以下';
    } else if ((athleteNo >= 3065 && athleteNo <= 3340) // female
    || (athleteNo >= 1293 && athleteNo <= 1853) // male
    ) {
      division = '25-35 分';
    } else if ((athleteNo >= 3341 && athleteNo <= 3960) // female
    || (athleteNo >= 1854 && athleteNo <= 2493) // male
    ) {
      division = '35 分以上';
    } else {
      throw new Error(`Unexpected athlete No.: ${athleteNoString}`);
    }

    // 個人時間
    const scoreString = $('.rankcard-content-top > div:last-child > p:last-child').text().trim();
    const score = NTUMarathonParser.parseScore(scoreString);

    const event = new SportEvent({
      id: shortUUID.generate(),
      game: Game.NTU_MARATHON,
      sport: Sport.FIELD_AND_TRACK,
      event: FieldAndTrackEvent.LONG_DISTANCE_5000M,
      category,
      division,
      date,
    });

    return [
      new AthleteResult({
        id: shortUUID.generate(),
        event,
        name,
        gender,
        isTrans,
        country: Country.TAIWAN,
        rank,
        score,
      }),
    ];
  }
}
