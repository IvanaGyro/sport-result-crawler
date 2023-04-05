import * as cheerio from 'cheerio';
import * as luxon from 'luxon';
import shortUUID from 'short-uuid';
import HTMLParser from './HTMLParser';
import AthleteResult, { Gender, Country } from '../AthleteResult';
import SportEvent, {
  Game, Sport, EventType, Category, Round,
} from '../SportEvent';

export default class NIAGParser extends HTMLParser {
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public async parse(source: string, verify: boolean): Promise<AthleteResult[]> {
    const sportMapping: { [key: string]: Sport } = {
      '400公尺': Sport.FIELD_AND_TRACK,
    };
    const eventMapping: { [key: string]: EventType } = {
      '400公尺': EventType.RUN_400_METRES,
    };
    const roundMapping: { [key: string]: Round } = {
      預賽: Round.PRELIMINARY,
      準決賽: Round.SEMI_FINAL,
      決賽: Round.FINAL,
    };
    const $ = cheerio.load(source);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const title = $('h1').text();
    const infoTable = $('table')[0];
    const recordTable = $('table')[1];

    const eventInfo = $('td:nth-child(2)', infoTable).text();
    const result = /(一般|公開)(女生組|男生組)([^ ]+) (預賽|準決賽|決賽) /.exec(eventInfo);
    if (result == null) {
      throw Error(`Unexpected eventInfo: ${eventInfo}`);
    }
    result.shift();
    const [division, category, eventType, round] = result;

    const dateInfo = $('td:nth-child(3)', infoTable).text();
    const dateRegex = /(\d+)\/(\d+)\/(\d+) (\d+):(\d+) /.exec(dateInfo);
    if (dateRegex == null) {
      throw Error(`Unexpected dateInfo: ${dateInfo}`);
    }
    dateRegex.shift();
    const [year, month, day, hour, minute] = dateRegex;
    const eventDate = luxon.DateTime.fromObject(
      {
        year: Number(year) + 1911,
        month: Number(month),
        day: Number(day),
        hour: Number(hour),
        minute: Number(minute),
      },
      {
        zone: 'Asia/Taipei',
      },
    );

    const event = new SportEvent({
      id: shortUUID.generate(),
      game: Game.TAIWAN_INTERCOLLEGIATE_GAMES,
      sport: sportMapping[eventType],
      event: eventMapping[eventType],
      category: category === '女生組' ? Category.FEMALE : Category.MALE,
      division,
      round: roundMapping[round],
      date: eventDate,
    });

    const headers = $('tr:nth-child(1) > td', recordTable)
      // eslint-disable-next-line func-names
      .map(function () {
        return $(this).text().replace(/\s+/gu, '');
      })
      .get();
    const validHeaders = ['單位', '姓名', '成績', '名次', '備註'].every((key) => headers.includes(key));
    if (!validHeaders) {
      throw Error(`Invalid headers: ${headers}`);
    }
    return (
      $('tr', recordTable)
        .slice(1)
        // eslint-disable-next-line func-names
        .map(function () {
          const row: Record<string, string> = {};
          $('td', this).each((i, elm) => {
            row[headers[i]] = $(elm).text().replace(/\s+/gu, '');
          });
          if (row['備註'] === 'DNS') {
            return null;
          }
          const scoreString = row['成績'];
          const scoreRegex = /((\d+):)?(\d+):(\d+(\.\d+)?)/.exec(scoreString);
          if (scoreRegex == null) {
            throw new Error(`Unexpected score: ${scoreString}`);
          }
          const hours = scoreRegex[1] || 0;
          const minutes = scoreRegex[3] || 0;
          const seconds = scoreRegex[4] || 0;
          const rawName = row['姓名'];
          const name = /\d+([^\d]+)/.exec(rawName)?.[1];
          if (name == null) {
            throw Error(`Unexpected name: ${rawName}`);
          }
          return new AthleteResult({
            id: shortUUID.generate(),
            event,
            name,
            gender: category === '女生組' ? Gender.FEMALE : Gender.MALE,
            isTrans: false,
            country: Country.TAIWAN,
            institution: row['單位'],
            rank: Number(row['名次']),
            score: Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds),
          });
        })
        .toArray()
        .filter((el) => el != null)
    );
  }
}
