import { transform } from 'stream-transform';
import { stringify } from 'csv-stringify';
import fs from 'fs';
import SportEvent, { GPS } from '../SportEvent';

import AthleteResult from '../AthleteResult';
import enumToString from '../EnumToString';

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
  static export(filename: string, results: AthleteResult[]): void {
    const toStringStream = transform(results, (result: AthleteResult): StringifiedRecord => {
      const transmformedRecord: StringifiedRecord = {
        id: result.id,
        game: enumToString(result.event.game),
        sport: enumToString(result.event.sport),
        event: enumToString(result.event.event),
        category: enumToString(result.event.category),
        division: result.event.division,
        round: enumToString(result.event.round),
        date: result.event.date.toISO({ includeOffset: false }),
        location: result.event.location,
        gps: gpsToString(result.event.gps),
        name: result.name,
        gender: enumToString(result.gender),
        isTrans: result.isTrans ? '是' : '不是',
        age: numberToString(result.age),
        country: enumToString(result.country),
        institution: result.institution,
        rank: numberToString(result.rank),
        score: numberToString(result.score),
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
