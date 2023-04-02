import { transform } from 'stream-transform';
import { stringify } from 'csv-stringify';
import fs from 'fs';
import Event, {
  Game, Sport, EventType, Category, GPS,
} from '../Event';

import Record, { Gender, Country } from '../Record';

type StringifiedEvent = {
  [key in keyof Event]: string;
};

type StringifiedRecord = StringifiedEvent & {
  [key in keyof Record as Exclude<key, 'event'>]: string;
};

function numberToString(n?: number): string {
  return n == null ? '-' : n.toString();
}

function gameToString(game: Game): string {
  const mapping = {
    [Game.TAIWAN_INTERCOLLEGIATE_GAMES]: '全大運',
  };
  return mapping[game];
}

function sportToString(sport: Sport): string {
  const mapping = {
    [Sport.TRACK]: '徑賽',
    [Sport.FIELD]: '田賽',
  };
  return mapping[sport];
}

function eventTypeToString(eventType: EventType): string {
  const mapping = {
    [EventType.RUN_400_METRES]: '400 公尺',
  };
  return mapping[eventType];
}

function categoryToString(category: Category): string {
  const mapping = {
    [Category.FEMALE]: '女子組',
    [Category.MALE]: '男子組',
    [Category.MIXED]: '混和',
    [Category.OPEN]: '公開組',
  };
  return mapping[category];
}

function gpsToString(gps?: GPS): string | undefined {
  return gps && `${gps.lat},${gps.lng}`;
}

function genderToString(gender: Gender): string {
  const mapping = {
    [Gender.MALE]: '男',
    [Gender.FEMALE]: '女',
    [Gender.NON_BINARY]: '非二元',
  };
  return mapping[gender];
}

function countryToString(country: Country): string {
  const mapping = {
    [Country.TAIWAN]: '台灣',
  };
  return mapping[country];
}

export default class CSVExporter {
  static export(filename: string, records: Record[]): void {
    const toStringStream = transform(records, (curRecord: Record): StringifiedRecord => {
      const transmformedRecord: StringifiedRecord = {
        id: curRecord.id,
        game: gameToString(curRecord.event.game),
        sport: sportToString(curRecord.event.sport),
        event: eventTypeToString(curRecord.event.event),
        category: categoryToString(curRecord.event.category),
        division: curRecord.event.division,
        date: curRecord.event.date.toISO({ includeOffset: false }),
        location: curRecord.event.location,
        gps: gpsToString(curRecord.event.gps),
        name: curRecord.name,
        gender: genderToString(curRecord.gender),
        isTrans: curRecord.isTrans ? '是' : '不是',
        age: numberToString(curRecord.age),
        country: countryToString(curRecord.country),
        rank: numberToString(curRecord.rank),
        score: numberToString(curRecord.score),
      };
      return transmformedRecord;
    });

    const fileStream: fs.WriteStream = fs.createWriteStream(filename);

    const toCSVStream = stringify({
      header: true,
      bom: true,
      columns: [
        { key: 'id', header: '編號' },
        { key: 'game', header: '競賽' },
        { key: 'sport', header: '運動類別' },
        { key: 'event', header: '項目' },
        { key: 'category', header: '性別分組' },
        { key: 'division', header: '程度分組' },
        { key: 'date', header: '日期' },
        { key: 'location', header: '競賽地點' },
        { key: 'gps', header: 'GPS' },
        { key: 'name', header: '選手' },
        { key: 'gender', header: '性別' },
        { key: 'isTrans', header: '是跨性別' },
        { key: 'age', header: '年齡' },
        { key: 'country', header: '國籍' },
        { key: 'rank', header: '名次' },
        { key: 'score', header: '成績' },
      ],
    });

    toStringStream.pipe(toCSVStream).pipe(fileStream);

    // TODO: do we need to close the file stream?
  }
}
