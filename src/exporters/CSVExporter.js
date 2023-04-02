import { transform } from 'stream-transform';
import { stringify } from 'csv-stringify';
import fs from 'fs';
import { Game, Sport, EventType, Category, Round, } from '../Event';
import { Gender, Country } from '../Record';
function numberToString(n) {
    return n == null ? '-' : n.toString();
}
function gameToString(game) {
    const mapping = {
        [Game.TAIWAN_INTERCOLLEGIATE_GAMES]: '全大運',
    };
    return mapping[game];
}
function sportToString(sport) {
    const mapping = {
        [Sport.TRACK]: '徑賽',
        [Sport.FIELD]: '田賽',
    };
    return mapping[sport];
}
function eventTypeToString(eventType) {
    const mapping = {
        [EventType.RUN_400_METRES]: '400 公尺',
    };
    return mapping[eventType];
}
function categoryToString(category) {
    const mapping = {
        [Category.FEMALE]: '女子組',
        [Category.MALE]: '男子組',
        [Category.MIXED]: '混合',
        [Category.OPEN]: '公開組',
    };
    return mapping[category];
}
function roundToString(round) {
    const mapping = {
        [Round.PRELIMINARY]: '預賽',
        [Round.SEMI_FINAL]: '準決賽',
        [Round.FINAL]: '決賽',
    };
    return round && mapping[round];
}
function gpsToString(gps) {
    return gps && `${gps.lat},${gps.lng}`;
}
function genderToString(gender) {
    const mapping = {
        [Gender.MALE]: '男',
        [Gender.FEMALE]: '女',
        [Gender.NON_BINARY]: '非二元',
    };
    return mapping[gender];
}
function countryToString(country) {
    const mapping = {
        [Country.TAIWAN]: '台灣',
    };
    return mapping[country];
}
export default class CSVExporter {
    static export(filename, records) {
        const toStringStream = transform(records, (curRecord) => {
            const transmformedRecord = {
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
        const fileStream = fs.createWriteStream(filename);
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
