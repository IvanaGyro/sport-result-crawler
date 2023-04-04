import { transform } from 'stream-transform';
import { stringify } from 'csv-stringify';
import fs from 'fs';
import SportEvent, { GPS } from '../SportEvent';

import AthleteResult from '../AthleteResult';
import {
  gameToString,
  sportToString,
  eventTypeToString,
  categoryToString,
  roundToString,
  genderToString,
  countryToString,
} from '../locales/zh';

type StringifiedEvent = {
  [key in keyof SportEvent]: string;
};

type StringifiedRecord = StringifiedEvent & {
  [key in keyof AthleteResult as Exclude<key, 'event'>]: string;
};

function numberToString(n?: number): string {
  return n == null ? '-' : n.toString();
}

function gpsToString(gps?: GPS): string | undefined {
  return gps && `${gps.lat},${gps.lng}`;
}

export default class CSVExporter {
  static export(filename: string, records: AthleteResult[]): void {
    const toStringStream = transform(records, (curRecord: AthleteResult): StringifiedRecord => {
      const transmformedRecord: StringifiedRecord = {
        id: curRecord.id,
        game: gameToString(curRecord.event.game),
        sport: sportToString(curRecord.event.sport),
        event: eventTypeToString(curRecord.event.event),
        category: categoryToString(curRecord.event.category),
        division: curRecord.event.division,
        round: roundToString(curRecord.event.round),
        date: curRecord.event.date.toISO({ includeOffset: false }),
        location: curRecord.event.location,
        gps: gpsToString(curRecord.event.gps),
        name: curRecord.name,
        gender: genderToString(curRecord.gender),
        isTrans: curRecord.isTrans ? '是' : '不是',
        age: numberToString(curRecord.age),
        country: countryToString(curRecord.country),
        institution: curRecord.institution,
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
        { key: 'round', header: '比賽階段' },
        { key: 'date', header: '日期' },
        { key: 'location', header: '競賽地點' },
        { key: 'gps', header: 'GPS' },
        { key: 'name', header: '選手' },
        { key: 'gender', header: '性別' },
        { key: 'isTrans', header: '是跨性別' },
        { key: 'age', header: '年齡' },
        { key: 'country', header: '國籍' },
        { key: 'institution', header: '代表機構' },
        { key: 'rank', header: '名次' },
        { key: 'score', header: '成績' },
      ],
    });

    toStringStream.pipe(toCSVStream).pipe(fileStream);

    // TODO: do we need to close the file stream?
  }
}
