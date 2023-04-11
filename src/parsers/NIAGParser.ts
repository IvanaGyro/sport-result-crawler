/* eslint-disable class-methods-use-this */
import * as cheerio from 'cheerio';
import * as luxon from 'luxon';
import shortUUID from 'short-uuid';
import HTMLParser from './HTMLParser';
import AthleteResult, { Gender, Country } from '../AthleteResult';
import SportEvent, {
  Game,
  Sport,
  EventType,
  Category,
  Round,
  FieldAndTrackEvent,
  SwimmingEvent,
  WoodballEvent,
  SoftTennisEvent,
  TaekwondoPoomsaeEvent,
  TaekwondoSparringEvent,
  RugbyEvent,
  FencingEvent,
  WeightingEvent,
  RhythmicGymnasticsEvent,
  ArtisticGymnaticsEvent,
  BadmintonEvent,
  WrestlingEvent,
  KarateEvent,
  JudoEvent,
  ShootingEvent,
  ArcheryEvent,
  BoxingEvent,
  TableTennisEvent,
  RowingEvent,
  CheerLeadingEvent,
  CyclingEvent,
  OrienteeringEvent,
  GolfEvent,
  TaekwondoEvent,
  RollerSkatingEvent,
  ESportsEvent,
  BilliardsEvent,
  CanoeingEvent,
  WushuEvent,
  TennisEvent,
} from '../SportEvent';

export default class NIAGParser extends HTMLParser {
  private static parseScore(scoreString: string): number {
    // Some sports don't have score, for example, tennis.
    if (scoreString === '--') {
      return -1;
    }

    const score = Number(scoreString);
    if (!Number.isNaN(score)) {
      return score;
    }

    let scoreRegex = /((\d+):)?(\d+):(\d+(\.\d+)?)/.exec(scoreString);
    if (scoreRegex != null) {
      const hours = scoreRegex[2] || 0;
      const minutes = scoreRegex[3] || 0;
      const seconds = scoreRegex[4] || 0;
      return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    }

    scoreRegex = /抓舉(成績)?:(\d+)(公斤)?.*挺舉(成績)?:(\d+)(公斤)?.*總和(成績)?:(\d+)(公斤)?/u.exec(
      scoreString,
    );
    if (scoreRegex != null) {
      return Number(scoreRegex[8]);
    }

    scoreRegex = /(\d+(\.\d+)?)(公尺|秒|分|\/(\+|-)?\d+(\.\d+)?|pts|-\d+X)/u.exec(scoreString);
    if (scoreRegex != null) {
      return Number(scoreRegex[1]);
    }

    throw new Error(`Unexpected score: ${scoreString}`);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  public async parse(source: string, verify: boolean): Promise<AthleteResult[]> {
    const sportMapping: { [key: string]: Sport } = {
      '400公尺': Sport.FIELD_AND_TRACK,
    };
    const eventMapping: { [key: string]: EventType } = {
      '400公尺': FieldAndTrackEvent.SPRINT_400M,
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
            score: NIAGParser.parseScore(row['成績']),
          });
        })
        .toArray()
        .filter((el) => el != null)
    );
  }

  public async parseHistoryResults(html: string): Promise<AthleteResult[]> {
    const eventTypeMapping: Record<string, Record<string, EventType>> = {
      木球: {
        '桿數-個人賽': WoodballEvent.STROKE_INDIVIDUAL,
        '桿數-團體賽': WoodballEvent.STROKE_TEAM,
        '桿數-雙人賽': WoodballEvent.STROKE_PAIR,
        '球道-個人賽': WoodballEvent.FAIRWAY_INDIVIDUAL,
        桿數賽個人賽: WoodballEvent.STROKE_INDIVIDUAL,
        桿數賽團體賽: WoodballEvent.STROKE_TEAM,
        桿數賽雙人賽: WoodballEvent.STROKE_PAIR,
        球道賽個人賽: WoodballEvent.FAIRWAY_INDIVIDUAL,
        個人桿數賽: WoodballEvent.STROKE_INDIVIDUAL,
        個人球道賽: WoodballEvent.FAIRWAY_INDIVIDUAL,
        團體桿數賽: WoodballEvent.STROKE_TEAM,
        雙人桿數賽: WoodballEvent.STROKE_PAIR,
      },
      田徑: {
        '100公尺': FieldAndTrackEvent.SPRINT_100M,
        '100公尺跨欄': FieldAndTrackEvent.HURDLES_100M,
        '1500公尺': FieldAndTrackEvent.MIDDLE_DISTANCE_1500M,
        '200公尺': FieldAndTrackEvent.SPRINT_200M,
        '3000公尺障礙': FieldAndTrackEvent.STEEPLECHASE_3000M,
        '400公尺': FieldAndTrackEvent.SPRINT_400M,
        '400公尺跨欄': FieldAndTrackEvent.HURDLES_400M,
        '4X100公尺接力': FieldAndTrackEvent.RELAY_4X100M,
        '4X400公尺接力': FieldAndTrackEvent.RELAY_4X400M,
        '5000公尺': FieldAndTrackEvent.LONG_DISTANCE_5000M,
        '800公尺': FieldAndTrackEvent.MIDDLE_DISTANCE_800M,
        三級跳遠: FieldAndTrackEvent.TRIPLE_JUMP,
        全能七項運動: FieldAndTrackEvent.HEPTATHLON,
        跳高: FieldAndTrackEvent.HIGH_JUMP,
        跳遠: FieldAndTrackEvent.LONG_JUMP,
        鉛球: FieldAndTrackEvent.SHOT_PUT,
        撐竿跳高: FieldAndTrackEvent.POLE_VAULT,
        標槍: FieldAndTrackEvent.JAVELIN_THROW,
        鏈球: FieldAndTrackEvent.HAMMER_THROW,
        鐵餅: FieldAndTrackEvent.DISCUS_THROW,
        '10000公尺': FieldAndTrackEvent.LONG_DISTANCE_10000M,
        '10000公尺競走': FieldAndTrackEvent.RACE_WALKING_10000M,
        '110公尺跨欄': FieldAndTrackEvent.HURDLES_110M,
        '100公尺跨欄(0.838m)': FieldAndTrackEvent.HURDLES_100M,
        '4×100公尺接力': FieldAndTrackEvent.RELAY_4X100M,
        '4×400公尺接力': FieldAndTrackEvent.RELAY_4X400M,
        '400公尺跨欄(0.762m)': FieldAndTrackEvent.HURDLES_400M,
        七項運動: FieldAndTrackEvent.HEPTATHLON,
        '鉛球(4Kg)': FieldAndTrackEvent.SHOT_PUT,
        '標槍(600g)': FieldAndTrackEvent.JAVELIN_THROW,
        '鏈球(4Kg)': FieldAndTrackEvent.HAMMER_THROW,
        '鐵餅(1Kg)': FieldAndTrackEvent.DISCUS_THROW,
        '110公尺跨欄(1.067m)': FieldAndTrackEvent.HURDLES_110M,
        '3000公尺障礙(0.914m)': FieldAndTrackEvent.STEEPLECHASE_3000M,
        '400公尺跨欄(0.914m)': FieldAndTrackEvent.HURDLES_400M,
        十項運動: FieldAndTrackEvent.DECATHLON,
        '鉛球(7.26Kg)': FieldAndTrackEvent.SHOT_PUT,
        '標槍(800g)': FieldAndTrackEvent.JAVELIN_THROW,
        '鏈球(7.26Kg)': FieldAndTrackEvent.HAMMER_THROW,
        '鐵餅(2Kg)': FieldAndTrackEvent.DISCUS_THROW,
        '3000公尺障礙(0.762m)': FieldAndTrackEvent.STEEPLECHASE_3000M,
        全能十項運動: FieldAndTrackEvent.DECATHLON,
        七項混合運動100公尺跨欄: FieldAndTrackEvent.HEPTATHLON_100M_HURDLES,
        七項混合運動200公尺: FieldAndTrackEvent.HEPTATHLON_200M,
        七項混合運動800公尺: FieldAndTrackEvent.HEPTATHLON_800M,
        七項混合運動跳高: FieldAndTrackEvent.HEPTATHLON_HIGH_JUMP,
        七項混合運動跳遠: FieldAndTrackEvent.HEPTATHLON_LONG_JUMP,
        七項混合運動鉛球: FieldAndTrackEvent.HEPTATHLON_SHOT_PUT,
        七項混合運動標槍: FieldAndTrackEvent.HEPTATHLON_JAVELIN_THROW,
        十項混合運動100公尺: FieldAndTrackEvent.DECATHLON_100M,
        十項混合運動110公尺跨欄: FieldAndTrackEvent.DECATHLON_110M_HURDLES,
        十項混合運動1500公尺: FieldAndTrackEvent.DECATHLON_1500M,
        十項混合運動400公尺: FieldAndTrackEvent.DECATHLON_400M,
        十項混合運動跳高: FieldAndTrackEvent.DECATHLON_HIGH_JUMP,
        十項混合運動跳遠: FieldAndTrackEvent.DECATHLON_LONG_JUMP,
        十項混合運動鉛球: FieldAndTrackEvent.DECATHLON_SHOT_PUT,
        十項混合運動撐竿跳高: FieldAndTrackEvent.DECATHLON_POLE_VAULT,
        十項混合運動標槍: FieldAndTrackEvent.DECATHLON_JAVELIN_THROW,
        十項混合運動鐵餅: FieldAndTrackEvent.DECATHLON_DISCUS_THROW,
        '4x100公尺接力': FieldAndTrackEvent.RELAY_4X100M,
        '4x400公尺接力': FieldAndTrackEvent.RELAY_4X400M,
        推鉛球: FieldAndTrackEvent.SHOT_PUT,
        // '混合運動': FieldAndTrackEvent.,
        擲標槍: FieldAndTrackEvent.JAVELIN_THROW,
        擲鏈球: FieldAndTrackEvent.HAMMER_THROW,
        擲鐵餅: FieldAndTrackEvent.DISCUS_THROW,
      },
      軟式網球: {
        單打賽: SoftTennisEvent.SINGLES,
        團體賽: SoftTennisEvent.TEAM,
        雙打賽: SoftTennisEvent.DOUBLES,
        混合雙打賽: SoftTennisEvent.MIXED_DOUBLES,
        個人單打賽: SoftTennisEvent.SINGLES,
        個人雙打賽: SoftTennisEvent.DOUBLES,
      },
      游泳: {
        '100公尺仰式': SwimmingEvent.BACKSTROKE_100M,
        '100公尺自由式': SwimmingEvent.FREESTYLE_100M,
        '100公尺蛙式': SwimmingEvent.BREASTSTROKE_100M,
        '100公尺蝶式': SwimmingEvent.BUTTERFLY_100M,
        '1500公尺自由式': SwimmingEvent.FREESTYLE_1500M,
        '200公尺仰式': SwimmingEvent.BACKSTROKE_200M,
        '200公尺自由式': SwimmingEvent.FREESTYLE_200M,
        '200公尺混合式': SwimmingEvent.MEDLEY_200M,
        '200公尺蛙式': SwimmingEvent.BREASTSTROKE_200M,
        '200公尺蝶式': SwimmingEvent.BUTTERFLY_200M,
        '4×100公尺自由式接力': SwimmingEvent.FREESTYLE_RELAY_4X100M,
        '4×100公尺混合式接力': SwimmingEvent.MELODY_RELAY_4X100M,
        '4×200公尺自由式接力': SwimmingEvent.FREESTYLE_RELAY_4X200M,
        '400公尺自由式': SwimmingEvent.FREESTYLE_400M,
        '400公尺混合式': SwimmingEvent.MEDLEY_400M,
        '50公尺仰式': SwimmingEvent.BACKSTROKE_50M,
        '50公尺自由式': SwimmingEvent.FREESTYLE_50M,
        '50公尺蛙式': SwimmingEvent.BREASTSTROKE_50M,
        '50公尺蝶式': SwimmingEvent.BUTTERFLY_50M,
        '800公尺自由式': SwimmingEvent.FREESTYLE_800M,
        '男女4×100公尺自由式接力': SwimmingEvent.MIXED_FREESTYLE_RELAY_4X100M,
        '男女4×100公尺混合式接力': SwimmingEvent.MIXED_MELODY_RELAY_4X100M,
        '4x100公尺自由式接力': SwimmingEvent.FREESTYLE_RELAY_4X100M,
        '4x100公尺混合式接力': SwimmingEvent.MELODY_RELAY_4X100M,
        '4x200公尺自由式接力': SwimmingEvent.FREESTYLE_RELAY_4X200M,
        '4*100公尺自由式接力': SwimmingEvent.FREESTYLE_RELAY_4X100M,
        '4*100公尺混合式接力': SwimmingEvent.MELODY_RELAY_4X100M,
        '4*200公尺自由式接力': SwimmingEvent.FREESTYLE_RELAY_4X200M,
      },
      跆拳道品勢: {
        個人組: TaekwondoPoomsaeEvent.SINGLES,
        團體組: TaekwondoPoomsaeEvent.TEAM,
        雙人組: TaekwondoPoomsaeEvent.DOUBLES,
        個人賽: TaekwondoPoomsaeEvent.SINGLES,
        團體賽: TaekwondoPoomsaeEvent.TEAM,
        混雙賽: TaekwondoPoomsaeEvent.MIXED_DOUBLES,
      },
      跆拳道對打: {
        '46公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_46KG,
        '49公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_49KG,
        '53公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_53KG,
        '57公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_57KG,
        '62公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_62KG,
        '67公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_67KG,
        '73公斤以上': TaekwondoSparringEvent.WEIGHT_CLASS_ABOVE_73KG,
        '73公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_73KG,
        '54公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_54KG,
        '58公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_58KG,
        '63公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_63KG,
        '68公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_68KG,
        '74公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_74KG,
        '80公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_80KG,
        '87公斤以上': TaekwondoSparringEvent.WEIGHT_CLASS_ABOVE_87KG,
        '87公斤級': TaekwondoSparringEvent.WEIGHT_CLASS_87KG,
        '73公斤以上級': TaekwondoSparringEvent.WEIGHT_CLASS_ABOVE_73KG,
        '87公斤以上級': TaekwondoSparringEvent.WEIGHT_CLASS_ABOVE_87KG,
      },
      網球: {
        單打賽: TennisEvent.SINGLES,
        團體賽: TennisEvent.TEAM,
        雙打賽: TennisEvent.DOUBLES,
        混合雙打賽: TennisEvent.MIXED_DOUBLES,
        個人單打賽: TennisEvent.SINGLES,
        個人雙打賽: TennisEvent.DOUBLES,
        個人混合雙打賽: TennisEvent.MIXED_DOUBLES,
        混雙賽: TennisEvent.MIXED_DOUBLES,
      },
      橄欖球: {
        七人制: RugbyEvent.SEVENS,
        十五人制: RugbyEvent.FIFTEENS,
      },
      擊劍: {
        軍刀個人賽: FencingEvent.SABRE_INDIVIDUAL,
        軍刀團體賽: FencingEvent.SABRE_TEAM,
        鈍劍個人賽: FencingEvent.EPEE_INDIVIDUAL,
        鈍劍團體賽: FencingEvent.EPEE_TEAM,
        銳劍個人賽: FencingEvent.FOIL_INDIVIDUAL,
        銳劍團體賽: FencingEvent.FOIL_TEAM,
      },
      舉重: {
        '45公斤級': WeightingEvent.WEIGHT_CLASS_45KG,
        '49公斤級': WeightingEvent.WEIGHT_CLASS_49KG,
        '55公斤級': WeightingEvent.WEIGHT_CLASS_55KG,
        '59公斤級': WeightingEvent.WEIGHT_CLASS_59KG,
        '64公斤級': WeightingEvent.WEIGHT_CLASS_64KG,
        '71公斤級': WeightingEvent.WEIGHT_CLASS_71KG,
        '76公斤級': WeightingEvent.WEIGHT_CLASS_76KG,
        '87公斤以上級': WeightingEvent.WEIGHT_CLASS_ABOVE_87KG,
        '87公斤級': WeightingEvent.WEIGHT_CLASS_87KG,
        '102公斤級': WeightingEvent.WEIGHT_CLASS_102KG,
        '109公斤以上級': WeightingEvent.WEIGHT_CLASS_ABOVE_109KG,
        '109公斤級': WeightingEvent.WEIGHT_CLASS_109KG,
        '61公斤級': WeightingEvent.WEIGHT_CLASS_61KG,
        '67公斤級': WeightingEvent.WEIGHT_CLASS_67KG,
        '73公斤級': WeightingEvent.WEIGHT_CLASS_73KG,
        '81公斤級': WeightingEvent.WEIGHT_CLASS_81KG,
        '89公斤級': WeightingEvent.WEIGHT_CLASS_89KG,
        '96公斤級': WeightingEvent.WEIGHT_CLASS_96KG,
        '48公斤級': WeightingEvent.WEIGHT_CLASS_48KG,
        '53公斤級': WeightingEvent.WEIGHT_CLASS_53KG,
        '58公斤級': WeightingEvent.WEIGHT_CLASS_58KG,
        '63公斤級': WeightingEvent.WEIGHT_CLASS_63KG,
        '69公斤級': WeightingEvent.WEIGHT_CLASS_69KG,
        '75公斤級': WeightingEvent.WEIGHT_CLASS_75KG,
        '90公斤以上級': WeightingEvent.WEIGHT_CLASS_ABOVE_90KG,
        '90公斤級': WeightingEvent.WEIGHT_CLASS_90KG,
        '105公斤以上級': WeightingEvent.WEIGHT_CLASS_ABOVE_105KG,
        '105公斤級': WeightingEvent.WEIGHT_CLASS_105KG,
        '56公斤級': WeightingEvent.WEIGHT_CLASS_56KG,
        '62公斤級': WeightingEvent.WEIGHT_CLASS_62KG,
        '77公斤級': WeightingEvent.WEIGHT_CLASS_77KG,
        '85公斤級': WeightingEvent.WEIGHT_CLASS_85KG,
        '94公斤級': WeightingEvent.WEIGHT_CLASS_94KG,
        '75公斤以上級': WeightingEvent.WEIGHT_CLASS_ABOVE_75KG,
      },
      韻律體操: {
        個人全能: RhythmicGymnasticsEvent.ALL_AROUND_INDIVIDUAL,
        帶競賽: RhythmicGymnasticsEvent.ROPE,
        球競賽: RhythmicGymnasticsEvent.BALL,
        棒競賽: RhythmicGymnasticsEvent.CLUBS,
        環競賽: RhythmicGymnasticsEvent.HOOP,
        團隊全能: RhythmicGymnasticsEvent.ALL_AROUND_TEAM,
        個人全能競賽: RhythmicGymnasticsEvent.ALL_AROUND_INDIVIDUAL,
        個人單項競賽: RhythmicGymnasticsEvent.UNKNOWN,
        團隊全能競賽: RhythmicGymnasticsEvent.ALL_AROUND_TEAM,
        帶: RhythmicGymnasticsEvent.ROPE,
        球: RhythmicGymnasticsEvent.BALL,
        棒: RhythmicGymnasticsEvent.CLUBS,
        環: RhythmicGymnasticsEvent.HOOP,
        '韻律體操個人單項競賽(帶)': RhythmicGymnasticsEvent.ROPE,
        '韻律體操個人單項競賽(球)': RhythmicGymnasticsEvent.BALL,
        '韻律體操個人單項競賽(棒)': RhythmicGymnasticsEvent.CLUBS,
        '韻律體操個人單項競賽(環)': RhythmicGymnasticsEvent.HOOP,
      },
      競技體操: {
        平衡木競賽: ArtisticGymnaticsEvent.BALANCE_BEAM,
        地板競賽: ArtisticGymnaticsEvent.FLOOR_EXERCISE,
        // XXX: group all member's results into one result for 成隊競賽?
        成隊競賽: ArtisticGymnaticsEvent.ALL_AROUND_TEAM,
        個人全能競賽: ArtisticGymnaticsEvent.ALL_AROUND_INDIVIDUAL,
        高低槓競賽: ArtisticGymnaticsEvent.UNEVEN_BARS,
        跳馬競賽: ArtisticGymnaticsEvent.VAULT,
        吊環競賽: ArtisticGymnaticsEvent.RINGS,
        單槓競賽: ArtisticGymnaticsEvent.HORIZONTAL_BAR,
        鞍馬競賽: ArtisticGymnaticsEvent.POMMEL_HORSE,
        雙槓競賽: ArtisticGymnaticsEvent.PARALLEL_BARS,
        個人單項競賽: ArtisticGymnaticsEvent.UNKNOWN,
        平衡木: ArtisticGymnaticsEvent.BALANCE_BEAM,
        地板: ArtisticGymnaticsEvent.FLOOR_EXERCISE,
        高低槓: ArtisticGymnaticsEvent.UNEVEN_BARS,
        跳馬: ArtisticGymnaticsEvent.VAULT,
        吊環: ArtisticGymnaticsEvent.RINGS,
        單槓: ArtisticGymnaticsEvent.HORIZONTAL_BAR,
        鞍馬: ArtisticGymnaticsEvent.POMMEL_HORSE,
        雙槓: ArtisticGymnaticsEvent.PARALLEL_BARS,
        '個人單項競賽(平衡木)': ArtisticGymnaticsEvent.BALANCE_BEAM,
        '個人單項競賽(地板)': ArtisticGymnaticsEvent.FLOOR_EXERCISE,
        '個人單項競賽(高低槓)': ArtisticGymnaticsEvent.UNEVEN_BARS,
        '個人單項競賽(跳馬)': ArtisticGymnaticsEvent.VAULT,
        '個人單項競賽(吊環)': ArtisticGymnaticsEvent.RINGS,
        '個人單項競賽(單槓)': ArtisticGymnaticsEvent.HORIZONTAL_BAR,
        '個人單項競賽(鞍馬)': ArtisticGymnaticsEvent.POMMEL_HORSE,
        '個人單項競賽(雙槓)': ArtisticGymnaticsEvent.PARALLEL_BARS,
      },
      羽球: {
        單打賽: BadmintonEvent.SINGLES,
        團體賽: BadmintonEvent.TEAM,
        雙打賽: BadmintonEvent.DOUBLES,
        混合雙打賽: BadmintonEvent.MIXED_DOUBLES,
        個人單打賽: BadmintonEvent.SINGLES,
        個人雙打賽: BadmintonEvent.DOUBLES,
        個人混合雙打賽: BadmintonEvent.MIXED_DOUBLES,
        混雙賽: BadmintonEvent.MIXED_DOUBLES,
      },
      角力: {
        自由式第一級: WrestlingEvent.FREESTYLE_1,
        自由式第二級: WrestlingEvent.FREESTYLE_2,
        自由式第三級: WrestlingEvent.FREESTYLE_3,
        自由式第四級: WrestlingEvent.FREESTYLE_4,
        自由式第五級: WrestlingEvent.FREESTYLE_5,
        自由式第六級: WrestlingEvent.FREESTYLE_6,
        希羅式第一級: WrestlingEvent.HEROIC_1,
        希羅式第二級: WrestlingEvent.HEROIC_2,
        希羅式第三級: WrestlingEvent.HEROIC_3,
        希羅式第四級: WrestlingEvent.HEROIC_4,
        希羅式第五級: WrestlingEvent.HEROIC_5,
        希羅式第六級: WrestlingEvent.HEROIC_6,
        '自由式第一級(50以下含)': WrestlingEvent.FREESTYLE_1,
        '自由式第二級(50.01~57.00)': WrestlingEvent.FREESTYLE_2,
        '自由式第三級(57.01~62.00)': WrestlingEvent.FREESTYLE_3,
        '自由式第一級(含65公斤)': WrestlingEvent.FREESTYLE_1,
        '自由式第二級(65.01~70.00)': WrestlingEvent.FREESTYLE_2,
        '自由式第三級(70.01~79.00)': WrestlingEvent.FREESTYLE_3,
        '自由式第四級(79.01~86.00)': WrestlingEvent.FREESTYLE_4,
        '希羅式第一級(含60.0公斤)': WrestlingEvent.HEROIC_1,
        '希羅式第二級(60.01~67.00)': WrestlingEvent.HEROIC_2,
        '希羅式第三級(67.01~72.00)': WrestlingEvent.HEROIC_3,
        '希羅式第四級(72.01~82.00)': WrestlingEvent.HEROIC_4,
        '自由式第二級(50.01~53.00)': WrestlingEvent.FREESTYLE_2,
        '自由式第三級(53.01~57.00)': WrestlingEvent.FREESTYLE_3,
        '自由式第五級(62.01~68.00)': WrestlingEvent.FREESTYLE_5,
        '自由式第六級(68.01~76.00)': WrestlingEvent.FREESTYLE_6,
        '自由式第一級(57以下含)': WrestlingEvent.FREESTYLE_1,
        '自由式第二級(57.01~65.00)': WrestlingEvent.FREESTYLE_2,
        '自由式第三級(65.01~74.00)': WrestlingEvent.FREESTYLE_3,
        '自由式第四級(74.01~86.00)': WrestlingEvent.FREESTYLE_4,
        '自由式第五級(86.01~97.00)': WrestlingEvent.FREESTYLE_5,
        '自由式第六級(97.01~125.0)': WrestlingEvent.FREESTYLE_6,
        '希羅式第三級(67.01~77.00)': WrestlingEvent.HEROIC_3,
        '希羅式第五級(87.01~97.00)': WrestlingEvent.HEROIC_5,
        '希羅式第六級(97.01~130.00)': WrestlingEvent.HEROIC_6,
        '希羅式第四級(77.01~87.00)': WrestlingEvent.HEROIC_4,
        自由式第1級: WrestlingEvent.FREESTYLE_1,
        自由式第2級: WrestlingEvent.FREESTYLE_2,
        自由式第3級: WrestlingEvent.FREESTYLE_3,
        自由式第4級: WrestlingEvent.FREESTYLE_4,
        自由式第5級: WrestlingEvent.FREESTYLE_5,
        自由式第6級: WrestlingEvent.FREESTYLE_6,
        希羅式第1級: WrestlingEvent.HEROIC_1,
        希羅式第2級: WrestlingEvent.HEROIC_2,
        希羅式第3級: WrestlingEvent.HEROIC_3,
        希羅式第4級: WrestlingEvent.HEROIC_4,
        希羅式第5級: WrestlingEvent.HEROIC_5,
        希羅式第6級: WrestlingEvent.HEROIC_6,
      },
      空手道: {
        個人型: KarateEvent.UNKNOWN_WEIGHT,
        第一量級: KarateEvent.WEIGHT_1,
        第二量級: KarateEvent.WEIGHT_2,
        第三量級: KarateEvent.WEIGHT_3,
        第五量級: KarateEvent.WEIGHT_5,
        第四量級: KarateEvent.WEIGHT_4,
        個人對打第一量級: KarateEvent.WEIGHT_1,
        個人對打第二量級: KarateEvent.WEIGHT_2,
        個人對打第三量級: KarateEvent.WEIGHT_3,
        個人對打第五量級: KarateEvent.WEIGHT_5,
        個人對打第四量級: KarateEvent.WEIGHT_4,
        '第一量級(50.00公斤以下(含))': KarateEvent.WEIGHT_1,
        '第二量級(50.01～55.00公斤)': KarateEvent.WEIGHT_2,
        '第三量級(55.01～61.00公斤)': KarateEvent.WEIGHT_3,
        '第四量級(61.01～68.00公斤)': KarateEvent.WEIGHT_4,
        '第一量級(60.00公斤以下(含))': KarateEvent.WEIGHT_1,
        '第二量級(60.01～67.00公斤)': KarateEvent.WEIGHT_2,
        '第三量級(67.01～75.00公斤)': KarateEvent.WEIGHT_3,
        '第五量級(84.01公斤以上)': KarateEvent.WEIGHT_5,
        '第四量級(75.01～84.00公斤)': KarateEvent.WEIGHT_4,
        '第五量級(68.01公斤以上)': KarateEvent.WEIGHT_5,
        對打第一量級: KarateEvent.WEIGHT_1,
        對打第二量級: KarateEvent.WEIGHT_2,
        對打第三量級: KarateEvent.WEIGHT_3,
        對打第四量級: KarateEvent.WEIGHT_4,
        對打第五量級: KarateEvent.WEIGHT_5,
      },
      柔道: {
        第一級: JudoEvent.WEIGHT_1,
        第二級: JudoEvent.WEIGHT_2,
        第三級: JudoEvent.WEIGHT_3,
        第四級: JudoEvent.WEIGHT_4,
        第五級: JudoEvent.WEIGHT_5,
        第六級: JudoEvent.WEIGHT_6,
        第七級: JudoEvent.WEIGHT_7,
        個人第一級: JudoEvent.WEIGHT_1,
        個人第七級: JudoEvent.WEIGHT_7,
        個人第二級: JudoEvent.WEIGHT_2,
        個人第三級: JudoEvent.WEIGHT_3,
        個人第五級: JudoEvent.WEIGHT_5,
        個人第六級: JudoEvent.WEIGHT_6,
        個人第四級: JudoEvent.WEIGHT_4,
        '第一級(48公斤以下)': JudoEvent.WEIGHT_1,
        '第二級(48.1~52公斤)': JudoEvent.WEIGHT_2,
        '第三級(52.1~57公斤)': JudoEvent.WEIGHT_3,
        '第五級(63.1~70公斤)': JudoEvent.WEIGHT_5,
        '第四級(57.1~63公斤)': JudoEvent.WEIGHT_4,
        '第一級(60公斤以下)': JudoEvent.WEIGHT_1,
        '第七級(100.1公斤以上)': JudoEvent.WEIGHT_7,
        '第二級(60.1~66公斤)': JudoEvent.WEIGHT_2,
        '第三級(66.1~73公斤)': JudoEvent.WEIGHT_3,
        '第五級(81.1~90公斤)': JudoEvent.WEIGHT_5,
        '第六級(90.1~100公斤)': JudoEvent.WEIGHT_6,
        '第四級(73.1~81公斤)': JudoEvent.WEIGHT_4,
        '第七級(78.1公斤以上)': JudoEvent.WEIGHT_7,
        '第六級(70.1~78公斤)': JudoEvent.WEIGHT_6,
        第八級: JudoEvent.WEIGHT_8,
      },
      射箭: {
        反曲弓個人對抗賽: ArcheryEvent.RECURVE_BOW_INDIVIDUAL,
        反曲弓團體對抗賽: ArcheryEvent.RECURVE_BOW_TEAM,
        複合弓個人對抗賽: ArcheryEvent.COMPOUND_BOW_INDIVIDUAL,
        複合弓團體對抗賽: ArcheryEvent.COMPOUND_BOW_TEAM,
        反曲弓混雙對抗賽: ArcheryEvent.RECURVE_BOW_MIXED_DOUBLE,
        複合弓混雙對抗賽: ArcheryEvent.COMPOUND_BOW_MIXED_DOUBLE,
        反曲弓個人賽: ArcheryEvent.RECURVE_BOW_INDIVIDUAL,
        反曲弓團體賽: ArcheryEvent.RECURVE_BOW_TEAM,
        複合弓個人賽: ArcheryEvent.COMPOUND_BOW_INDIVIDUAL,
        複合弓團體賽: ArcheryEvent.COMPOUND_BOW_TEAM,
        反曲弓混雙賽: ArcheryEvent.RECURVE_BOW_MIXED_DOUBLE,
        複合弓混雙賽: ArcheryEvent.COMPOUND_BOW_MIXED_DOUBLE,
        公開混合組反曲弓混雙賽: ArcheryEvent.RECURVE_BOW_MIXED_DOUBLE,
        公開混合組複合弓混雙賽: ArcheryEvent.COMPOUND_BOW_MIXED_DOUBLE,
      },
      射擊: {
        '10公尺空氣手槍': ShootingEvent.AIR_PISTOL_10M_INDIVIDUAL,
        '10公尺空氣手槍團體賽': ShootingEvent.AIR_PISTOL_10M_TEAM,
        '10公尺空氣步槍': ShootingEvent.AIR_RIFLE_10M_INDIVIDUAL,
        '10公尺空氣步槍團體賽': ShootingEvent.AIR_RIFLE_10M_TEAM,
        '10公尺空氣手槍混合賽': ShootingEvent.AIR_PISTOL_MIXED_DOUBLE,
        '10公尺空氣步槍混合賽': ShootingEvent.AIR_RIFLE_MIXED_DOUBLE,
        '10公尺空氣手槍個人賽': ShootingEvent.AIR_PISTOL_10M_INDIVIDUAL,
        '10公尺空氣步槍個人賽': ShootingEvent.AIR_RIFLE_10M_INDIVIDUAL,
      },
      拳擊: {
        第一量級: BoxingEvent.WEIGHT_1, // 量：\uF97E
        第二量級: BoxingEvent.WEIGHT_2,
        第八量級: BoxingEvent.WEIGHT_8,
        第三量級: BoxingEvent.WEIGHT_3,
        第五量級: BoxingEvent.WEIGHT_5,
        第六量級: BoxingEvent.WEIGHT_6,
        第四量級: BoxingEvent.WEIGHT_4,
        第一量級: BoxingEvent.WEIGHT_1, // 量：\u91CF
        第七量級: BoxingEvent.WEIGHT_7,
        第九量級: BoxingEvent.WEIGHT_9,
        第二量級: BoxingEvent.WEIGHT_2,
        第八量級: BoxingEvent.WEIGHT_8,
        第十量級: BoxingEvent.WEIGHT_10,
        第三量級: BoxingEvent.WEIGHT_3,
        第五量級: BoxingEvent.WEIGHT_5,
        第六量級: BoxingEvent.WEIGHT_6,
        第四量級: BoxingEvent.WEIGHT_4,
        '第一量級(45.01-48.0kg)': BoxingEvent.WEIGHT_1,
        '第七量級(64.01-69.0kg)': BoxingEvent.WEIGHT_7,
        '第二量級(48.01-51.0kg)': BoxingEvent.WEIGHT_2,
        '第八量級(69.01-75.0kg)': BoxingEvent.WEIGHT_8,
        '第三量級(51.01-54.0kg)': BoxingEvent.WEIGHT_3,
        '第五量級(57.01-60.0kg)': BoxingEvent.WEIGHT_5,
        '第六量級(60.01-64.0kg)': BoxingEvent.WEIGHT_6,
        '第四量級(54.01-57.0kg)': BoxingEvent.WEIGHT_4,
        '第一量級(46.01-49.0kg)': BoxingEvent.WEIGHT_1,
        '第七量級(69.01-75.0kg)': BoxingEvent.WEIGHT_7,
        '第九量級(81.01-91.0kg)': BoxingEvent.WEIGHT_9,
        '第二量級(49.01-52.0kg)': BoxingEvent.WEIGHT_2,
        '第八量級(75.01-81.0kg)': BoxingEvent.WEIGHT_8,
        '第十量級(91+kg)': BoxingEvent.WEIGHT_10,
        '第三量級(52.01-56.0kg)': BoxingEvent.WEIGHT_3,
        '第五量級(60.01-64.0kg)': BoxingEvent.WEIGHT_5,
        '第六量級(64.01-69.0kg)': BoxingEvent.WEIGHT_6,
        '第四量級(56.01-60.0kg)': BoxingEvent.WEIGHT_4,
      },
      桌球: {
        單打賽: TableTennisEvent.SINGLES,
        團體賽: TableTennisEvent.TEAM,
        雙打賽: TableTennisEvent.DOUBLES,
        混合雙打賽: TableTennisEvent.MIXED_DOUBLES,
        個人單打賽: TableTennisEvent.SINGLES,
        個人雙打賽: TableTennisEvent.DOUBLES,
        個人混合雙打賽: TableTennisEvent.MIXED_DOUBLES,
        混雙賽: TableTennisEvent.MIXED_DOUBLES,
      },
      划船: {
        單人雙槳艇: RowingEvent.SINGLE_SCULL,
        輕量級單人雙槳艇: RowingEvent.LIGHTWEIGHT_SINGLE_SCULL,
        輕量級雙人雙槳艇: RowingEvent.LIGHTWEIGHT_DOUBLE_SCULL,
        雙人雙槳艇: RowingEvent.DOUBLE_SCULL,
        四人單槳艇: RowingEvent.FOUR_SINGLE_SCULL,
        四人雙槳艇: RowingEvent.FOUR_DOUBLE_SCULL,
        雙人單槳艇: RowingEvent.DOUBLE_SINGLE_SCULL,
      },
      競技啦啦: {
        競技啦啦隊5人組: CheerLeadingEvent.FIVE_PERSON_TEAM,
        競技啦啦隊團體組: CheerLeadingEvent.TEAM,
        舞蹈啦啦隊嘻哈雙人組: CheerLeadingEvent.HIPHOP_TWO_PERSON_TEAM,
        舞蹈啦啦隊嘻哈團體組: CheerLeadingEvent.HIPHOP_TEAM,
        舞蹈啦啦隊彩球雙人組: CheerLeadingEvent.RIBBON_BALL_TWO_PERSON_TEAM,
      },
      自由車: {
        爭先賽: CyclingEvent.SPRINT_RACE,
        個人全能賽: CyclingEvent.INDIVIDUAL_ALL_AROUND,
        個人追逐賽: CyclingEvent.INDIVIDUAL_PURSUIT,
        團隊追逐賽: CyclingEvent.TEAM_PURSUIT,
        團隊競速賽: CyclingEvent.TEAM_SPRINT,
        競輪賽: CyclingEvent.KEIRIN_RACE,
      },
      定向越野: {
        短距離個人賽: OrienteeringEvent.SHORT_DISTANCE_INDIVIDUAL,
        男女混合接力賽: OrienteeringEvent.MIXED_RELAY,
      },
      武術: {
        '52公斤級：52公斤以下（含52.00公斤）': WushuEvent.WEIGHT_CLASS_52KG,
        '60公斤級：60公斤以下（56.01公斤至60.00公斤）': WushuEvent.WEIGHT_CLASS_60KG,
        '太極拳/太極劍全能': WushuEvent.TAIJIQUAN_SWORD,
        長拳: WushuEvent.CHANGQUAN,
        '南拳/南刀全能': WushuEvent.NANQUAN_KNIFE,
        '56公斤級：56公斤以下(含56.00公斤)': WushuEvent.WEIGHT_CLASS_56KG,
        '65公斤級：65公斤以下（60.01公斤至65.00公斤）': WushuEvent.WEIGHT_CLASS_65KG,
        '70公斤級：70公斤以下（65.01公斤至70.00公斤）': WushuEvent.WEIGHT_CLASS_70KG,
        '75公斤級：75公斤以下（70.01公斤至75.00公斤）': WushuEvent.WEIGHT_CLASS_75KG,
        '刀術/棍術全能': WushuEvent.KNIFE_STICK,
        '南拳/南棍全能': WushuEvent.NANQUAN_STICK,
      },
      高爾夫: {
        個人賽: GolfEvent.INDIVIDUAL,
        團體賽: GolfEvent.TEAM,
      },
      跆拳道: {
        '46公斤級': TaekwondoEvent.KG_46,
        '49公斤級': TaekwondoEvent.KG_49,
        '53公斤級': TaekwondoEvent.KG_53,
        '57公斤級': TaekwondoEvent.KG_57,
        '62公斤級': TaekwondoEvent.KG_62,
        '67公斤級': TaekwondoEvent.KG_67,
        '73公斤以上': TaekwondoEvent.KG_73,
        '73公斤級': TaekwondoEvent.KG_73_ABOVE,
        品勢個人組: TaekwondoEvent.FORM_INDIVIDUAL,
        品勢團體組: TaekwondoEvent.FORM_TEAM,
        '54公斤級': TaekwondoEvent.KG_54,
        '58公斤級': TaekwondoEvent.KG_58,
        '63公斤級': TaekwondoEvent.KG_63,
        '68公斤級': TaekwondoEvent.KG_68,
        '74公斤級': TaekwondoEvent.KG_74,
        '80公斤級': TaekwondoEvent.KG_80,
        '87公斤以上': TaekwondoEvent.KG_87_ABOVE,
        '87公斤級': TaekwondoEvent.KG_87,
        品勢混合組: TaekwondoEvent.FORM_MIXED,
      },
      滑輪溜冰: {
        '10000公尺計點淘汰賽': RollerSkatingEvent.POINT_RACE_10K,
        '1000公尺爭先賽': RollerSkatingEvent.SPEED_RACE_1000,
        '15000公尺淘汰賽': RollerSkatingEvent.ELIMINATION_RACE_15K,
        '3000公尺美式接力': RollerSkatingEvent.AMERICAN_RELAY_3000,
        '300公尺計時賽': RollerSkatingEvent.TIME_TRIAL_300,
        '500公尺爭先賽': RollerSkatingEvent.SPEED_RACE_500,
        速度過樁賽: RollerSkatingEvent.OBSTACLE_RACE,
      },
      電競: {
        英雄聯盟團體賽: ESportsEvent.LOL,
        爐石戰記個人賽: ESportsEvent.HEARTHSTONE,
      },
      撞球: {
        '9號球個人賽': BilliardsEvent.NO9_BALL_INDIVIDUAL,
        '9號球雙打賽': BilliardsEvent.NO9_BALL_DOUBLES,
      },
      輕艇: {
        '200公尺C1': CanoeingEvent.C1_200M,
        '200公尺K1': CanoeingEvent.K1_200M,
        '500公尺C2': CanoeingEvent.C2_500M,
        '500公尺K1': CanoeingEvent.K1_500M,
        '500公尺K2': CanoeingEvent.K2_500M,
        '500公尺K4': CanoeingEvent.K4_500M,
        '1000公尺C1': CanoeingEvent.C1_1000M,
        '1000公尺C2': CanoeingEvent.C2_1000M,
        '1000公尺K1': CanoeingEvent.K1_1000M,
        '1000公尺K2': CanoeingEvent.K2_1000M,
      },
    };

    const sportMapping: Record<string, Sport> = {
      木球: Sport.WOODBALL,
      田徑: Sport.FIELD_AND_TRACK,
      軟式網球: Sport.SOFT_TENNIS,
      游泳: Sport.SWIMMING,
      跆拳道品勢: Sport.TAEKWONDO_POOMSAE,
      跆拳道對打: Sport.TAEKWONDO_SPARRING,
      網球: Sport.TENNIS,
      橄欖球: Sport.RUGBY,
      擊劍: Sport.FENCING,
      舉重: Sport.WEIGHTING,
      韻律體操: Sport.RHYTHMIC_GYMNASTICS,
      競技體操: Sport.ARTISTIC_GYMNATICS,
      羽球: Sport.BADMINTON,
      角力: Sport.WRESTLING,
      空手道: Sport.KARATE,
      柔道: Sport.JUDO,
      射箭: Sport.ARCHERY,
      射擊: Sport.SHOOTING,
      拳擊: Sport.BOXING,
      桌球: Sport.TABLE_TENNIS,
      划船: Sport.ROWING,
      競技啦啦: Sport.CHEER_LEADING,
      自由車: Sport.CYCLING,
      定向越野: Sport.ORIENTEERING,
      武術: Sport.WUSHU,
      高爾夫: Sport.GOLF,
      跆拳道: Sport.TAEKWONDO,
      滑輪溜冰: Sport.ROLLER_SKATING,
      電競: Sport.E_SPORTS,
      撞球: Sport.BILLIARDS,
      輕艇: Sport.CANOEING,
    };

    const divisionCategoryMapping: Record<string, [string | undefined, Category]> = {
      一般女生組: ['一般', Category.FEMALE],
      一般男生組: ['一般', Category.MALE],
      公開女生組: ['公開', Category.FEMALE],
      一般混合組: ['一般', Category.MIXED],
      公開男生組: ['公開', Category.MALE],
      公開混合組: ['公開', Category.MIXED],
      一般男女混合組: ['一般', Category.MIXED],
      公開男女混合組: ['公開', Category.MIXED],
      一般組: ['一般', Category.MIXED], // 2020 競技啦啦
      公開組: ['公開', Category.MIXED], // 2020 競技啦啦
      大專女生組: [undefined, Category.FEMALE], // 2018 滑輪溜冰
      大專男生組: [undefined, Category.MALE], // 2018 滑輪溜冰
      大專團體組: [undefined, Category.OPEN], // 2018 電競
      一般女子組: ['一般', Category.FEMALE],
      一般男子組: ['一般', Category.MALE],
      公開女子組: ['公開', Category.FEMALE],
      公開男子組: ['公開', Category.MALE],
    };

    const $ = cheerio.load(html);
    const resultTable = $('#ctl00_ContentPlaceHolder1_GridView1');
    const headers = $('tr:nth-child(1) > th', resultTable)
      // eslint-disable-next-line func-names
      .map(function () {
        return $(this).text().replace(/\s+/gu, '');
      })
      .get();
    const validHeaders = [
      '年度',
      '單位',
      '組別',
      '運動種類',
      '項目',
      '成績',
      '名次',
      '日期',
      '選手',
    ].every((key) => headers.includes(key));
    if (!validHeaders) {
      throw new Error(`Invalid headers: ${headers}`);
    }

    return $(':scope > tbody > tr', resultTable) // cheerio insert <tbody> automatically when <tbody> is committed
      .slice(1, -1) // remove the hearder and the page navigator
      .map((_, row): AthleteResult => {
        if ($('td', row).length !== headers.length) {
          throw new Error(
            `Number of cells in the row is not equal to the number of the headers. row:${$(
              row,
            ).html()}`,
          );
        }
        const result: Record<string, string> = {};
        $('td', row).each((i, cell) => {
          result[headers[i]] = $(cell).text().replace(/\s+/gu, '');
        });

        // divition, category
        if (divisionCategoryMapping[result['組別']] == null) {
          throw Error(`Unhandeld division-category: ${result['組別']}`);
        }
        const [division, category] = divisionCategoryMapping[result['組別']];

        // sport, event
        const sport = sportMapping[result['運動種類']];
        if (sport == null) {
          throw new Error(`Unexpected sport: ${result['運動種類']}`);
        }
        let eventType = eventTypeMapping[result['運動種類']][result['項目']];
        if (eventType == null) {
          if (result['運動種類'] === '田徑' && result['項目'] === '混合運動') {
            eventType = category === Category.FEMALE
              ? FieldAndTrackEvent.HEPTATHLON
              : FieldAndTrackEvent.DECATHLON;
          } else {
            throw new Error(`Unexpected event type: ${result['項目']}`);
          }
        }

        // rank
        const rankRegex = /^\d+$/.exec(result['名次']);
        if (rankRegex == null) {
          throw Error(`Unexpected rank: ${result['名次']}`);
        }
        const rank = Number(result['名次']);

        // score
        const score = NIAGParser.parseScore(result['成績']);

        // date
        const [year, month, day] = result['日期'].split('-');
        const date = luxon.DateTime.fromObject(
          {
            year: Number(year),
            month: Number(month) || 1,
            day: Number(day) || 1,
          },
          {
            zone: 'Asia/Taipei',
          },
        );

        return new AthleteResult({
          id: shortUUID.generate(),
          event: new SportEvent({
            id: shortUUID.generate(), // should not be random
            game: Game.TAIWAN_INTERCOLLEGIATE_GAMES,
            sport,
            event: eventType,
            category,
            division,
            round: undefined,
            date,
          }),
          name: result['選手'],
          // Fix this for MIXED
          gender: category === Category.FEMALE ? Gender.FEMALE : Gender.MALE,
          isTrans: false,
          country: Country.TAIWAN,
          institution: result['單位'],
          rank,
          score,
        });
      })
      .get();
  }
}
