import i18n from 'i18n';
import { fileURLToPath } from 'url';
import { Gender, Country } from './AthleteResult';
import {
  Category,
  Round,
  Game,
  Sport,
  FieldAndTrackEvent,
  SwimmingEvent,
  WoodballEvent,
  SoftTennisEvent,
  TaekwondoPoomsaeEvent,
  TaekwondoSparringEvent,
  TennisEvent,
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
  WushuEvent,
  GolfEvent,
  TaekwondoEvent,
  RollerSkatingEvent,
  ESportsEvent,
  BilliardsEvent,
  CanoeingEvent,
} from './SportEvent';

/**
 * configure shared state
 */
i18n.configure({
  defaultLocale: 'zh',
  locales: ['zh', 'en'],
  directory: fileURLToPath(new URL('../locales', import.meta.url).toString()),
});

const mapping = {
  [Gender.FEMALE]: i18n.__('女'),
  [Gender.MALE]: i18n.__('男'),
  [Gender.NON_BINARY]: i18n.__('非二元'),
  [Country.TAIWAN]: i18n.__('台灣'),
  [Category.FEMALE]: i18n.__('女子組'),
  [Category.MALE]: i18n.__('男子組'),
  [Category.MIXED]: i18n.__('混合'),
  [Category.OPEN]: i18n.__('公開組'),
  [Round.PRELIMINARY]: i18n.__('預賽'),
  [Round.SEMI_FINAL]: i18n.__('準決賽'),
  [Round.FINAL]: i18n.__('決賽'),
  [Game.TAIWAN_INTERCOLLEGIATE_GAMES]: i18n.__('全大運'),
  [Game.NTU_MARATHON]: i18n.__('台灣大學馬拉松'),
  [Sport.FIELD_AND_TRACK]: i18n.__('田徑'),
  [Sport.SWIMMING]: i18n.__('游泳'),
  [Sport.WOODBALL]: i18n.__('木球'),
  [Sport.SOFT_TENNIS]: i18n.__('軟式網球'),
  [Sport.TAEKWONDO_POOMSAE]: i18n.__('跆拳道品勢'),
  [Sport.TAEKWONDO_SPARRING]: i18n.__('跆拳道對打'),
  [Sport.TENNIS]: i18n.__('網球'),
  [Sport.RUGBY]: i18n.__('橄欖球'),
  [Sport.FENCING]: i18n.__('劍擊'),
  [Sport.WEIGHTING]: i18n.__('舉重'),
  [Sport.RHYTHMIC_GYMNASTICS]: i18n.__('韻律體操'),
  [Sport.ARTISTIC_GYMNATICS]: i18n.__('競技體操'),
  [Sport.BADMINTON]: i18n.__('羽球'),
  [Sport.WRESTLING]: i18n.__('角力'),
  [Sport.KARATE]: i18n.__('空手道'),
  [Sport.JUDO]: i18n.__('柔道'),
  [Sport.SHOOTING]: i18n.__('射擊'),
  [Sport.ARCHERY]: i18n.__('射箭'),
  [Sport.BOXING]: i18n.__('拳擊'),
  [Sport.TABLE_TENNIS]: i18n.__('桌球'),
  [Sport.ROWING]: i18n.__('划船'),
  [Sport.CHEER_LEADING]: i18n.__('競技啦啦'),
  [Sport.CYCLING]: i18n.__('自由車'),
  [Sport.ORIENTEERING]: i18n.__('定向越野'),
  [Sport.WUSHU]: i18n.__('武術'),
  [Sport.GOLF]: i18n.__('高爾夫'),
  [Sport.TAEKWONDO]: i18n.__('跆拳道'),
  [Sport.ROLLER_SKATING]: i18n.__('滑輪溜冰'),
  [Sport.E_SPORTS]: i18n.__('電競'),
  [Sport.BILLIARDS]: i18n.__('撞球'),
  [Sport.CANOEING]: i18n.__('輕艇'),
  [FieldAndTrackEvent.SPRINT_100M]: i18n.__('100 公尺'),
  [FieldAndTrackEvent.SPRINT_200M]: i18n.__('200 公尺'),
  [FieldAndTrackEvent.SPRINT_400M]: i18n.__('400 公尺'),
  [FieldAndTrackEvent.MIDDLE_DISTANCE_800M]: i18n.__('800 公尺'),
  [FieldAndTrackEvent.MIDDLE_DISTANCE_1500M]: i18n.__('1500 公尺'),
  [FieldAndTrackEvent.LONG_DISTANCE_5000M]: i18n.__('5000 公尺'),
  [FieldAndTrackEvent.LONG_DISTANCE_10000M]: i18n.__('10000 公尺'),
  [FieldAndTrackEvent.RACE_WALKING_10000M]: i18n.__('10000 公尺競走'),
  [FieldAndTrackEvent.HURDLES_100M]: i18n.__('100 公尺跨欄'),
  [FieldAndTrackEvent.HURDLES_110M]: i18n.__('110 公尺跨欄'),
  [FieldAndTrackEvent.HURDLES_400M]: i18n.__('400 公尺跨欄'),
  [FieldAndTrackEvent.STEEPLECHASE_3000M]: i18n.__('3000 公尺障礙賽'),
  [FieldAndTrackEvent.RELAY_4X100M]: i18n.__('4x100 公尺接力'),
  [FieldAndTrackEvent.RELAY_4X400M]: i18n.__('4x400 公尺接力'),
  [FieldAndTrackEvent.HIGH_JUMP]: i18n.__('跳高'),
  [FieldAndTrackEvent.POLE_VAULT]: i18n.__('撐竿跳高'),
  [FieldAndTrackEvent.LONG_JUMP]: i18n.__('跳遠'),
  [FieldAndTrackEvent.TRIPLE_JUMP]: i18n.__('三級跳遠'),
  [FieldAndTrackEvent.SHOT_PUT]: i18n.__('鉛球'),
  [FieldAndTrackEvent.DISCUS_THROW]: i18n.__('鐵餅'),
  [FieldAndTrackEvent.HAMMER_THROW]: i18n.__('鏈球'),
  [FieldAndTrackEvent.JAVELIN_THROW]: i18n.__('標槍'),
  [FieldAndTrackEvent.HEPTATHLON]: i18n.__('七項全能'),
  [FieldAndTrackEvent.HEPTATHLON_200M]: i18n.__('七項全能（200 公尺）'),
  [FieldAndTrackEvent.HEPTATHLON_800M]: i18n.__('七項全能（800 公尺）'),
  [FieldAndTrackEvent.HEPTATHLON_100M_HURDLES]: i18n.__('七項全能（100 公尺跨欄）'),
  [FieldAndTrackEvent.HEPTATHLON_HIGH_JUMP]: i18n.__('七項全能（跳高）'),
  [FieldAndTrackEvent.HEPTATHLON_LONG_JUMP]: i18n.__('七項全能（跳遠）'),
  [FieldAndTrackEvent.HEPTATHLON_SHOT_PUT]: i18n.__('七項全能（鉛球）'),
  [FieldAndTrackEvent.HEPTATHLON_JAVELIN_THROW]: i18n.__('七項全能（標槍）'),
  [FieldAndTrackEvent.DECATHLON]: i18n.__('十項全能'),
  [FieldAndTrackEvent.DECATHLON_100M]: i18n.__('十項全能（100 公尺）'),
  [FieldAndTrackEvent.DECATHLON_400M]: i18n.__('十項全能（400 公尺）'),
  [FieldAndTrackEvent.DECATHLON_1500M]: i18n.__('十項全能（1500 公尺）'),
  [FieldAndTrackEvent.DECATHLON_110M_HURDLES]: i18n.__('十項全能（110 公尺跨欄）'),
  [FieldAndTrackEvent.DECATHLON_HIGH_JUMP]: i18n.__('十項全能（跳高）'),
  [FieldAndTrackEvent.DECATHLON_LONG_JUMP]: i18n.__('十項全能（跳遠）'),
  [FieldAndTrackEvent.DECATHLON_POLE_VAULT]: i18n.__('十項全能（撐竿跳高）'),
  [FieldAndTrackEvent.DECATHLON_SHOT_PUT]: i18n.__('十項全能（鉛球）'),
  [FieldAndTrackEvent.DECATHLON_DISCUS_THROW]: i18n.__('十項全能（鐵餅）'),
  [FieldAndTrackEvent.DECATHLON_JAVELIN_THROW]: i18n.__('十項全能（標槍）'),
  [SwimmingEvent.FREESTYLE_50M]: i18n.__('50 公尺自由式'),
  [SwimmingEvent.FREESTYLE_100M]: i18n.__('100 公尺自由式'),
  [SwimmingEvent.FREESTYLE_200M]: i18n.__('200 公尺自由式'),
  [SwimmingEvent.FREESTYLE_400M]: i18n.__('400 公尺自由式'),
  [SwimmingEvent.FREESTYLE_800M]: i18n.__('800 公尺自由式'),
  [SwimmingEvent.FREESTYLE_1500M]: i18n.__('1500 公尺自由式'),
  [SwimmingEvent.BACKSTROKE_50M]: i18n.__('50 公尺仰式'),
  [SwimmingEvent.BACKSTROKE_100M]: i18n.__('100 公尺仰式'),
  [SwimmingEvent.BACKSTROKE_200M]: i18n.__('200 公尺仰式'),
  [SwimmingEvent.BREASTSTROKE_50M]: i18n.__('50 公尺蛙式'),
  [SwimmingEvent.BREASTSTROKE_100M]: i18n.__('100 公尺蛙式'),
  [SwimmingEvent.BREASTSTROKE_200M]: i18n.__('200 公尺蛙式'),
  [SwimmingEvent.BUTTERFLY_50M]: i18n.__('50 公尺蝶式'),
  [SwimmingEvent.BUTTERFLY_100M]: i18n.__('100 公尺蝶式'),
  [SwimmingEvent.BUTTERFLY_200M]: i18n.__('200 公尺蝶式'),
  [SwimmingEvent.MEDLEY_200M]: i18n.__('200 公尺混合式'),
  [SwimmingEvent.MEDLEY_400M]: i18n.__('400 公尺混合式'),
  [SwimmingEvent.FREESTYLE_RELAY_4X100M]: i18n.__('4x100 公尺自由式接力'),
  [SwimmingEvent.FREESTYLE_RELAY_4X200M]: i18n.__('4x200 公尺自由式接力'),
  [SwimmingEvent.MIXED_FREESTYLE_RELAY_4X100M]: i18n.__('男女 4x100 公尺自由式接力'),
  [SwimmingEvent.MELODY_RELAY_4X100M]: i18n.__('4x100 公尺混合式接力'),
  [SwimmingEvent.MIXED_MELODY_RELAY_4X100M]: i18n.__('男女 4x100 公尺混合式接力'),
  [WoodballEvent.STROKE_INDIVIDUAL]: i18n.__('個人桿數賽'),
  [WoodballEvent.STROKE_PAIR]: i18n.__('雙人桿數賽'),
  [WoodballEvent.STROKE_TEAM]: i18n.__('團體桿數賽'),
  [WoodballEvent.FAIRWAY_INDIVIDUAL]: i18n.__('個人球道賽'),
  [SoftTennisEvent.SINGLES]: i18n.__('個人賽'),
  [SoftTennisEvent.DOUBLES]: i18n.__('雙人賽'),
  [SoftTennisEvent.TEAM]: i18n.__('團體賽'),
  [SoftTennisEvent.MIXED_DOUBLES]: i18n.__('混合雙人賽'),
  [TaekwondoPoomsaeEvent.SINGLES]: i18n.__('個人賽'),
  [TaekwondoPoomsaeEvent.DOUBLES]: i18n.__('雙人賽'),
  [TaekwondoPoomsaeEvent.TEAM]: i18n.__('團體賽'),
  [TaekwondoPoomsaeEvent.MIXED_DOUBLES]: i18n.__('混合雙人賽'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_46KG]: i18n.__('46 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_49KG]: i18n.__('49 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_53KG]: i18n.__('53 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_57KG]: i18n.__('57 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_62KG]: i18n.__('62 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_67KG]: i18n.__('67 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_ABOVE_73KG]: i18n.__('73 公斤以上級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_73KG]: i18n.__('73 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_54KG]: i18n.__('54 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_58KG]: i18n.__('58 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_63KG]: i18n.__('63 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_68KG]: i18n.__('68 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_74KG]: i18n.__('74 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_80KG]: i18n.__('80 公斤級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_ABOVE_87KG]: i18n.__('87 公斤以上級'),
  [TaekwondoSparringEvent.WEIGHT_CLASS_87KG]: i18n.__('87 公斤級'),
  [TennisEvent.SINGLES]: i18n.__('個人賽'),
  [TennisEvent.DOUBLES]: i18n.__('雙人賽'),
  [TennisEvent.TEAM]: i18n.__('團體賽'),
  [TennisEvent.MIXED_DOUBLES]: i18n.__('混合雙人賽'),
  [RugbyEvent.SEVENS]: i18n.__('七人制'),
  [RugbyEvent.FIFTEENS]: i18n.__('十五人制'),
  [FencingEvent.SABRE_INDIVIDUAL]: i18n.__('軍刀個人賽'),
  [FencingEvent.SABRE_TEAM]: i18n.__('軍刀團體賽'),
  [FencingEvent.EPEE_INDIVIDUAL]: i18n.__('銳劍個人賽'),
  [FencingEvent.EPEE_TEAM]: i18n.__('銳劍團體賽'),
  [FencingEvent.FOIL_INDIVIDUAL]: i18n.__('鈍劍個人賽'),
  [FencingEvent.FOIL_TEAM]: i18n.__('鈍劍團體賽'),
  [WeightingEvent.WEIGHT_CLASS_45KG]: i18n.__('45 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_49KG]: i18n.__('49 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_55KG]: i18n.__('55 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_59KG]: i18n.__('59 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_64KG]: i18n.__('64 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_71KG]: i18n.__('71 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_76KG]: i18n.__('76 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_ABOVE_87KG]: i18n.__('87 公斤以上級'),
  [WeightingEvent.WEIGHT_CLASS_87KG]: i18n.__('87 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_102KG]: i18n.__('10 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_ABOVE_109KG]: i18n.__('109 公斤以上級'),
  [WeightingEvent.WEIGHT_CLASS_109KG]: i18n.__('10 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_61KG]: i18n.__('61 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_67KG]: i18n.__('67 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_73KG]: i18n.__('73 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_81KG]: i18n.__('81 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_89KG]: i18n.__('89 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_96KG]: i18n.__('96 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_48KG]: i18n.__('48 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_53KG]: i18n.__('53 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_58KG]: i18n.__('58 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_63KG]: i18n.__('63 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_69KG]: i18n.__('69 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_75KG]: i18n.__('75 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_ABOVE_90KG]: i18n.__('90 公斤以上級'),
  [WeightingEvent.WEIGHT_CLASS_90KG]: i18n.__('90 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_ABOVE_105KG]: i18n.__('105 公斤以上級'),
  [WeightingEvent.WEIGHT_CLASS_105KG]: i18n.__('10 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_56KG]: i18n.__('56 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_62KG]: i18n.__('62 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_77KG]: i18n.__('77 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_85KG]: i18n.__('85 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_94KG]: i18n.__('94 公斤級'),
  [WeightingEvent.WEIGHT_CLASS_ABOVE_75KG]: i18n.__('75 公斤以上級'),
  [RhythmicGymnasticsEvent.ROPE]: i18n.__('帶'),
  [RhythmicGymnasticsEvent.HOOP]: i18n.__('環'),
  [RhythmicGymnasticsEvent.BALL]: i18n.__('球'),
  [RhythmicGymnasticsEvent.CLUBS]: i18n.__('棒'),
  [RhythmicGymnasticsEvent.UNKNOWN]: i18n.__('未知單項'),
  [RhythmicGymnasticsEvent.ALL_AROUND_INDIVIDUAL]: i18n.__('全能個人賽'),
  [RhythmicGymnasticsEvent.ALL_AROUND_TEAM]: i18n.__('全能團體賽'),
  [ArtisticGymnaticsEvent.BALANCE_BEAM]: i18n.__('平衡木'),
  [ArtisticGymnaticsEvent.FLOOR_EXERCISE]: i18n.__('地板'),
  [ArtisticGymnaticsEvent.UNEVEN_BARS]: i18n.__('高低槓'),
  [ArtisticGymnaticsEvent.VAULT]: i18n.__('跳馬'),
  [ArtisticGymnaticsEvent.RINGS]: i18n.__('吊環'),
  [ArtisticGymnaticsEvent.PARALLEL_BARS]: i18n.__('雙槓'),
  [ArtisticGymnaticsEvent.POMMEL_HORSE]: i18n.__('鞍馬'),
  [ArtisticGymnaticsEvent.HORIZONTAL_BAR]: i18n.__('單槓'),
  [ArtisticGymnaticsEvent.UNKNOWN]: i18n.__('未知單項'),
  [ArtisticGymnaticsEvent.ALL_AROUND_INDIVIDUAL]: i18n.__('全能個人賽'),
  [ArtisticGymnaticsEvent.ALL_AROUND_TEAM]: i18n.__('全能團體賽'),
  [BadmintonEvent.SINGLES]: i18n.__('個人賽'),
  [BadmintonEvent.DOUBLES]: i18n.__('雙人賽'),
  [BadmintonEvent.TEAM]: i18n.__('團體賽'),
  [BadmintonEvent.MIXED_DOUBLES]: i18n.__('混合雙人賽'),
  [WrestlingEvent.FREESTYLE_1]: i18n.__('自由式第一量級'),
  [WrestlingEvent.FREESTYLE_2]: i18n.__('自由式第二量級'),
  [WrestlingEvent.FREESTYLE_3]: i18n.__('自由式第三量級'),
  [WrestlingEvent.FREESTYLE_4]: i18n.__('自由式第四量級'),
  [WrestlingEvent.FREESTYLE_5]: i18n.__('自由式第五量級'),
  [WrestlingEvent.FREESTYLE_6]: i18n.__('自由式第六量級'),
  [WrestlingEvent.HEROIC_1]: i18n.__('希羅式第一量級'),
  [WrestlingEvent.HEROIC_2]: i18n.__('希羅式第二量級'),
  [WrestlingEvent.HEROIC_3]: i18n.__('希羅式第三量級'),
  [WrestlingEvent.HEROIC_4]: i18n.__('希羅式第四量級'),
  [WrestlingEvent.HEROIC_5]: i18n.__('希羅式第五量級'),
  [WrestlingEvent.HEROIC_6]: i18n.__('希羅式第六量級'),
  [KarateEvent.WEIGHT_1]: i18n.__('第一量級'),
  [KarateEvent.WEIGHT_2]: i18n.__('第二量級'),
  [KarateEvent.WEIGHT_3]: i18n.__('第三量級'),
  [KarateEvent.WEIGHT_4]: i18n.__('第四量級'),
  [KarateEvent.WEIGHT_5]: i18n.__('第五量級'),
  [KarateEvent.UNKNOWN_WEIGHT]: i18n.__('未知量級'),
  [JudoEvent.WEIGHT_1]: i18n.__('第一量級'),
  [JudoEvent.WEIGHT_2]: i18n.__('第二量級'),
  [JudoEvent.WEIGHT_3]: i18n.__('第三量級'),
  [JudoEvent.WEIGHT_4]: i18n.__('第四量級'),
  [JudoEvent.WEIGHT_5]: i18n.__('第五量級'),
  [JudoEvent.WEIGHT_6]: i18n.__('第六量級'),
  [JudoEvent.WEIGHT_7]: i18n.__('第七量級'),
  [JudoEvent.WEIGHT_8]: i18n.__('第八量級'),
  [ShootingEvent.AIR_PISTOL_10M_INDIVIDUAL]: i18n.__('10公尺空氣手槍個人賽'),
  [ShootingEvent.AIR_PISTOL_10M_TEAM]: i18n.__('10公尺空氣手槍團體賽'),
  [ShootingEvent.AIR_PISTOL_MIXED_DOUBLE]: i18n.__('10公尺空氣手槍混合賽'),
  [ShootingEvent.AIR_RIFLE_10M_INDIVIDUAL]: i18n.__('10公尺空氣步槍個人賽'),
  [ShootingEvent.AIR_RIFLE_10M_TEAM]: i18n.__('10公尺空氣步槍團體賽'),
  [ShootingEvent.AIR_RIFLE_MIXED_DOUBLE]: i18n.__('10公尺空氣步槍混合賽'),
  [ArcheryEvent.RECURVE_BOW_INDIVIDUAL]: i18n.__('反曲弓個人賽'),
  [ArcheryEvent.RECURVE_BOW_TEAM]: i18n.__('反曲弓團體賽'),
  [ArcheryEvent.RECURVE_BOW_MIXED_DOUBLE]: i18n.__('反曲弓混合賽'),
  [ArcheryEvent.COMPOUND_BOW_INDIVIDUAL]: i18n.__('複合弓個人賽'),
  [ArcheryEvent.COMPOUND_BOW_TEAM]: i18n.__('複合弓團體賽'),
  [ArcheryEvent.COMPOUND_BOW_MIXED_DOUBLE]: i18n.__('複合弓混合賽'),
  [BoxingEvent.WEIGHT_1]: i18n.__('第一量級'),
  [BoxingEvent.WEIGHT_2]: i18n.__('第二量級'),
  [BoxingEvent.WEIGHT_3]: i18n.__('第三量級'),
  [BoxingEvent.WEIGHT_4]: i18n.__('第四量級'),
  [BoxingEvent.WEIGHT_5]: i18n.__('第五量級'),
  [BoxingEvent.WEIGHT_6]: i18n.__('第六量級'),
  [BoxingEvent.WEIGHT_7]: i18n.__('第七量級'),
  [BoxingEvent.WEIGHT_8]: i18n.__('第八量級'),
  [BoxingEvent.WEIGHT_9]: i18n.__('第九量級'),
  [BoxingEvent.WEIGHT_10]: i18n.__('第十量級'),
  [TableTennisEvent.SINGLES]: i18n.__('個人賽'),
  [TableTennisEvent.DOUBLES]: i18n.__('雙人賽'),
  [TableTennisEvent.TEAM]: i18n.__('團體賽'),
  [TableTennisEvent.MIXED_DOUBLES]: i18n.__('混合雙人賽'),
  [RowingEvent.SINGLE_SCULL]: i18n.__('單人雙槳艇'),
  [RowingEvent.LIGHTWEIGHT_SINGLE_SCULL]: i18n.__('輕量級單人雙槳艇'),
  [RowingEvent.LIGHTWEIGHT_DOUBLE_SCULL]: i18n.__('輕量級雙人雙槳艇'),
  [RowingEvent.DOUBLE_SCULL]: i18n.__('雙人雙槳艇'),
  [RowingEvent.FOUR_SINGLE_SCULL]: i18n.__('四人單槳艇'),
  [RowingEvent.FOUR_DOUBLE_SCULL]: i18n.__('四人雙槳艇'),
  [RowingEvent.DOUBLE_SINGLE_SCULL]: i18n.__('雙人單槳艇'),
  [CheerLeadingEvent.FIVE_PERSON_TEAM]: i18n.__('五人組'),
  [CheerLeadingEvent.TEAM]: i18n.__('團體組'),
  [CheerLeadingEvent.HIPHOP_TWO_PERSON_TEAM]: i18n.__('嘻哈雙人組'),
  [CheerLeadingEvent.HIPHOP_TEAM]: i18n.__('嘻哈團體組'),
  [CheerLeadingEvent.RIBBON_BALL_TWO_PERSON_TEAM]: i18n.__('彩球雙人組'),
  [CyclingEvent.SPRINT_RACE]: i18n.__('爭先賽'),
  [CyclingEvent.INDIVIDUAL_ALL_AROUND]: i18n.__('個人全能賽'),
  [CyclingEvent.INDIVIDUAL_PURSUIT]: i18n.__('個人追逐賽'),
  [CyclingEvent.TEAM_PURSUIT]: i18n.__('團隊追逐賽'),
  [CyclingEvent.TEAM_SPRINT]: i18n.__('團隊競速賽'),
  [CyclingEvent.KEIRIN_RACE]: i18n.__('競輪賽'),
  [OrienteeringEvent.SHORT_DISTANCE_INDIVIDUAL]: i18n.__('短距離個人賽'),
  [OrienteeringEvent.MIXED_RELAY]: i18n.__('男女混合接力賽'),
  [WushuEvent.WEIGHT_CLASS_52KG]: i18n.__('52 公斤級'),
  [WushuEvent.WEIGHT_CLASS_56KG]: i18n.__('56 公斤級'),
  [WushuEvent.WEIGHT_CLASS_60KG]: i18n.__('60 公斤級'),
  [WushuEvent.WEIGHT_CLASS_65KG]: i18n.__('65 公斤級'),
  [WushuEvent.WEIGHT_CLASS_70KG]: i18n.__('70 公斤級'),
  [WushuEvent.WEIGHT_CLASS_75KG]: i18n.__('75 公斤級'),
  [WushuEvent.TAIJIQUAN_SWORD]: i18n.__('太極拳/太極劍'),
  [WushuEvent.CHANGQUAN]: i18n.__('長拳'),
  [WushuEvent.NANQUAN_KNIFE]: i18n.__('南拳/南刀'),
  [WushuEvent.NANQUAN_STICK]: i18n.__('南拳/南棍'),
  [WushuEvent.KNIFE_STICK]: i18n.__('刀/棍'),
  [GolfEvent.INDIVIDUAL]: i18n.__('個人賽'),
  [GolfEvent.TEAM]: i18n.__('團體賽'),
  [TaekwondoEvent.KG_46]: i18n.__('46 公斤級'),
  [TaekwondoEvent.KG_49]: i18n.__('49 公斤級'),
  [TaekwondoEvent.KG_53]: i18n.__('53 公斤級'),
  [TaekwondoEvent.KG_57]: i18n.__('57 公斤級'),
  [TaekwondoEvent.KG_62]: i18n.__('62 公斤級'),
  [TaekwondoEvent.KG_67]: i18n.__('67 公斤級'),
  [TaekwondoEvent.KG_73_ABOVE]: i18n.__('73 公斤以上級'),
  [TaekwondoEvent.KG_73]: i18n.__('73 公斤級'),
  [TaekwondoEvent.FORM_INDIVIDUAL]: i18n.__('品勢個人組'),
  [TaekwondoEvent.FORM_TEAM]: i18n.__('品勢個人組'),
  [TaekwondoEvent.KG_54]: i18n.__('54 公斤級'),
  [TaekwondoEvent.KG_58]: i18n.__('58 公斤級'),
  [TaekwondoEvent.KG_63]: i18n.__('63 公斤級'),
  [TaekwondoEvent.KG_68]: i18n.__('68 公斤級'),
  [TaekwondoEvent.KG_74]: i18n.__('74 公斤級'),
  [TaekwondoEvent.KG_80]: i18n.__('80 公斤級'),
  [TaekwondoEvent.KG_87_ABOVE]: i18n.__('87 公斤以上級'),
  [TaekwondoEvent.KG_87]: i18n.__('87 公斤級'),
  [TaekwondoEvent.FORM_MIXED]: i18n.__('品勢混合組'),
  [RollerSkatingEvent.POINT_RACE_10K]: i18n.__('10000 公尺計點淘汰賽'),
  [RollerSkatingEvent.SPEED_RACE_1000]: i18n.__('1000 公尺爭先賽'),
  [RollerSkatingEvent.ELIMINATION_RACE_15K]: i18n.__('15000 公尺淘汰賽'),
  [RollerSkatingEvent.AMERICAN_RELAY_3000]: i18n.__('3000 公尺美式接力'),
  [RollerSkatingEvent.TIME_TRIAL_300]: i18n.__('300 公尺計時賽'),
  [RollerSkatingEvent.SPEED_RACE_500]: i18n.__('500 公尺爭先賽'),
  [RollerSkatingEvent.OBSTACLE_RACE]: i18n.__('速度過樁賽'),
  [ESportsEvent.LOL]: i18n.__('英雄聯盟'),
  [ESportsEvent.HEARTHSTONE]: i18n.__('爐石戰記'),
  [BilliardsEvent.NO9_BALL_INDIVIDUAL]: i18n.__('九號球個人賽'),
  [BilliardsEvent.NO9_BALL_DOUBLES]: i18n.__('九號球雙人賽'),
  [CanoeingEvent.C1_200M]: i18n.__('200 公尺C1'),
  [CanoeingEvent.K1_200M]: i18n.__('200 公尺K1'),
  [CanoeingEvent.C2_500M]: i18n.__('500 公尺C2'),
  [CanoeingEvent.K1_500M]: i18n.__('500 公尺K1'),
  [CanoeingEvent.K2_500M]: i18n.__('500 公尺K2'),
  [CanoeingEvent.K4_500M]: i18n.__('500 公尺K4'),
  [CanoeingEvent.C1_1000M]: i18n.__('1000 公尺C1'),
  [CanoeingEvent.C2_1000M]: i18n.__('1000 公尺C2'),
  [CanoeingEvent.K1_1000M]: i18n.__('1000 公尺K1'),
  [CanoeingEvent.K2_1000M]: i18n.__('1000 公尺K2'),
};

export default <T extends keyof typeof mapping | undefined>(key: T) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (key == null ? undefined : mapping[key!]) as T extends undefined ? undefined : string;
