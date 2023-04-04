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

    let institutionIndex = -1;
    let nameIndex = -1;
    let scoreIndex = -1;
    let rankIndex = -1;
    let noteIndex = -1;
    const headers = $('tr:nth-child(1)', recordTable);
    $('td', headers).each((i, element) => {
      const text = $(element).text().trim();
      switch (text) {
        case '單  位': {
          institutionIndex = i;
          break;
        }
        case '姓  名': {
          nameIndex = i;
          break;
        }
        case '成  績': {
          scoreIndex = i;
          break;
        }
        case '名  次': {
          rankIndex = i;
          break;
        }
        case '備  註': {
          noteIndex = i;
          break;
        }
        default: {
          break;
        }
      }
    });

    return (
      $('tr', recordTable)
        .slice(1)
        // eslint-disable-next-line func-names
        .map(function () {
          const cells: cheerio.Cheerio<cheerio.Element> = $('td', this);
          if ($(cells[noteIndex]).text().trim() === 'DNS') {
            return null;
          }
          const scoreString = $(cells[scoreIndex]).text().trim();
          const scoreRegex = /((\d+):)?(\d+):(\d+(\.\d+)?)/.exec(scoreString);
          if (scoreRegex == null) {
            throw new Error(`Unexpected score: ${scoreString}`);
          }
          const hours = scoreRegex[1] || 0;
          const minutes = scoreRegex[3] || 0;
          const seconds = scoreRegex[4] || 0;
          const name = /\d+([^\d]+)/.exec($(cells[nameIndex]).text().trim())?.[1];
          if (name == null) {
            throw Error(`Unexpected name: ${$(cells[nameIndex]).text().trim()}`);
          }
          return new AthleteResult({
            id: shortUUID.generate(),
            event,
            name,
            gender: category === '女生組' ? Gender.FEMALE : Gender.MALE,
            isTrans: false,
            country: Country.TAIWAN,
            institution: $(cells[institutionIndex]).text().trim(),
            rank: Number($(cells[rankIndex]).text().trim()),
            score: Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds),
          });
        })
        .toArray()
        .filter((el) => el != null)
    );
  }
}
