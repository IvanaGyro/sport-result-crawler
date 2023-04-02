// cause_tb = {
// '01': '違規超車',
//  '02': '爭(搶)道行駛',
//  '03': '蛇行、方向不定',
//  '04': '逆向行駛',
//  '05': '未靠右行駛',
//  '06': '未依規定讓車',
//  '07': '變換車道或方向不當',
//  '08': '左轉彎未依規定',
//  '09': '右轉彎未依規定',
//  '10': '迴轉未依規定',
//  '11': '橫越道路不慎',
//  '12': '倒車未依規定',
//  '13': '超速失控',
//  '14': '未依規定減速',
//  '15': '搶越行人穿越道',
//  '16': '未保持行車安全距離',
//  '17': '未保持行車安全間隔',
//  '18': '停車操作時，未注意其他車(人)安全',
//  '19': '起步未注意其他車(人)安全',
//  '20': '吸食違禁物後駕駛失控',
//  '21': '酒醉(後)駕駛失控',
//  '22': '疲勞(患病)駕駛失控',
//  '23': '未注意車前狀態',
//  '24': '搶(闖)越平交道',
//  '25': '違反號誌管制或指揮',
//  '26': '違反特定標誌(線)禁制',
//  '27': '未依規定使用燈光',
//  '28': '暗處停車無燈光、標識',
//  '29': '夜間行駛無燈光設備',
//  '30': '裝載貨物不穩妥',
//  '31': '載貨超重而失控',
//  '32': '超載人員而失控',
//  '33': '貨物超長、寬、高而肇事',
//  '34': '裝卸貨不當',
//  '35': '裝載未盡安全措施',
//  '36': '未待乘客安全上下開車',
//  '37': '其他裝載不當肇事',
//  '38': '違規停車或暫停不當而肇事',
//  '39': '拋錨未採安全措施',
//  '40': '開啟車門不當而肇事',
//  '41': '使用手持行動電話失控',
//  '42': '其他引起事故之違規或不當行為',
//  '43': '不明原因肇事',
//  '44': '尚未發現肇事因素',
//  '45': '煞車失靈',
//  '46': '方向操縱系統故障',
//  '47': '燈光系統故障',
//  '48': '車輪脫落或輪胎爆裂',
//  '49': '車輛零件脫落',
// '50': '其他引起事故之故障',
// '51': '未依規定行走行人穿越道、地下道、天橋而穿越道路',
// '52': '未依標誌、標線、號誌或手勢指揮穿越道路',
// '53': '穿越道路未注意左右來車',
//  '54': '在道路上嬉戲或奔走不定',
//  '55': '未待車輛停妥而上下車',
//  '56': '上下車輛未注意安全',
//  '57': '頭手伸出車外而肇事',
//  '58': '乘坐不當而跌落',
//  '59': '在路上工作未設適當標識',
//  '60': '其他引起事故之疏失或行為',
//  '61': '路況危險無安全（警告）設施',
//  '62': '交通管制設施失靈或損毀',
//  '63': '交通指揮不當',
//  '64': '平交道看守疏失或未放柵欄',
//  '65': '其他交通管制不當',
//   '66': '動物竄出',
// '67': '尚未發現肇事因素',
// '':'空白',
// }
import luxon from 'luxon';

import Party from './Party';
import { autoImplements } from './utilities';

// If severity of one case is INJURY_ONLY_OR_DEATH_BETWEEN_2_TO_30_DAYS, it means we cannot
// distinguish whether the case is a DEATH_BETWEEN_2_TO_30_DAYS case or a INJURY_ONLY case
// from the dataset.
export enum Severity {
  DEATH_IN_24_HOURS = 1,
  DEATH_BETWEEN_2_TO_30_DAYS = 2,
  INJURY_ONLY_OR_DEATH_BETWEEN_2_TO_30_DAYS = 3,
  INJURY_ONLY = 4,
  ONLY_PROPERTY_DAMAGE = 5,
  SELF_SETTLEMENT = 6,
}

export enum Weather {
  STROM = 1,
  STRONG_WIND = 2,
  SAND_WIND = 3,
  SMOKE = 4,
  SNOWE = 5,
  RAIN = 6,
  CLOUDY = 7,
  SUNNY = 8,
}

export enum Light {
  DAYTIME = 1,
  SUNRISE_SUNSET = 2,
  NIGHT_LIGHTING = 3,
  NIGHT_DARK = 4,
}

export enum RoadHierarchy {
  FREEWAY = 1,
  PROVINCIAL = 2,
  COUNTY = 3,
  COUNTRY = 4,
  CITY = 5,
  VILLAGE = 6,
  EXCLUDED = 7,
  OTHER = 8,
}

export enum RoadGeometry {
  OPEN_LEVEL_CROSSING = 1,
  BARRIER_LEVEL_CROSSING = 2,
  THREE_WAY_INTERSECTION = 3,
  CROSS_INTERSECTION = 4,
  MULTIWAY_INTERSECTION = 5,
  TUNNEL = 6,
  UNDERPASS = 7,
  BRIDGE = 8,
  CULVERT = 9,
  VIADUCT = 10,
  CURVE = 11,
  SLOPE = 12,
  ALLEY = 13,
  STRAIGHT = 14,
  OTHER = 15,
  ROUNDABOUT = 16,
  SQUARE = 17,
}

export enum Position {
  INTERSECTION = 1,
  NEARBY_INTERSECTION = 2,
  HOOK_TURN_AREA = 3,
  BIKE_STOP_AREA = 4,
  TRAFFIC_ISLAND = 5,
  U_TURN = 6,
  FAST_LANE = 7,
  SLOW_LANE = 8,
  NORMAL_LANE = 9,
  BUS_LANE = 10,
  MOTORCYCLE_LANE = 11,
  MOTORCYCLE_FIRST_LANE = 12,
  ROAD_SHOULDER = 13,
  ACCELERATION_LANE = 14,
  DECELERATION_LANE = 15,
  STRAIGHT_RAMP = 16,
  BEND_RAMP = 17,
  PEDESTRIAN_CROSSING = 18,
  NEARBY_PEDESTRIAN_CROSSING = 19,
  SIDEWALK = 20,
  TOLLGATE = 21,
  OTHER = 22,
}

export enum RoadMaterial {
  ASPHALT = 1,
  CONCRETE = 2,
  GRAVEL = 3,
  OTHER = 4,
  NONE = 5,
}

export enum RoadSurfaceWet {
  SNOW = 1,
  OIL = 2,
  MUD = 3,
  WET = 4,
  DRY = 5,
}

export enum RoadSurfaceDefect {
  SOFT = 1,
  CORRUGATION = 2,
  HOLE = 3,
  NONE = 4,
}

export enum Obstacle {
  UNDER_CONSTRUCTION = 1,
  STUFF = 2,
  PARKING = 3,
  OTHER = 4,
  NONE = 5,
}

export enum SightDistance {
  BEND = 1,
  SLOPE = 2,
  BUILDING = 3,
  PLANT = 4,
  PARKING = 5,
  OTHER = 6,
  GOOD = 7,
}

export enum TrafficSignal {
  NORMAL = 1,
  NORMAL_WITH_WALKING_PERSON = 2,
  FLASH = 3,
  NONE = 4,
}

export enum TrafficSignalStatus {
  NORMAL = 1,
  UNUSUAL = 2,
  NO_ACTION = 3,
  NO_TRAFFIC_LIGHT = 4,
}

export enum DirectionDivider {
  WIDE_ISLAND = 1, // 50 cm above
  NARROW_ISLAND_WITH_BARRIER = 2,
  NARROW_ISLAND_WITHOUT_BARRIER = 3,
  DOUBLE_YELLOW_LINE_WITH_MARK = 4,
  DOUBLE_YELLOW_LINE_WITHOUT_MARK = 5,
  SOLID_BROKEN_YELLOW_LINE_WITH_MARK = 6,
  SOLID_BROKEN_YELLOW_LINE_WITHOUT_MARK = 7,
  BROKEN_YELLOW_LINE_WITH_MARK = 8,
  BROKEN_YELLOW_LINE_WITHOUT_MARK = 9,
  NONE = 10,
}

export enum NormalLaneDivider {
  DOUBLE_WHITE_LINE_WITH_MARK = 1,
  DOUBLE_WHITE_LINE_WITHOUT_MARK = 2,
  BROKEN_WHITE_LINE_WITH_MARK = 3,
  BROKEN_WHITE_LINE_WITHOUT_MARK = 4,
  NONE = 5,
}

export enum FastSlowLaneDivider {
  WIDE_ISLAND = 1, // 50 cm above
  NARROW_ISLAND_WITH_BARRIER = 2,
  NARROW_ISLAND_WITHOUT_BARRIER = 3,
  FAST_SLOW_LANE_LINE = 4,
  NONE = 5,
}

export enum EdgeLine {
  HAVE = 1,
  NONE = 2,
}

export enum CrashType {
  WALK_INVERSE_DIRECTION = 1,
  WALK_SAME_DIRECTION = 2,
  CROSSING_ROAD = 3,
  PLAYING_ON_ROAD = 4,
  WORKING_ON_ROAD = 5,
  RUNNING_INTO_ROAD = 6,
  IMMERSING_BEHIND_CARS = 7,
  STANDING_OUTSIDE_ROAD = 8,
  OTHER_HUMAN_AND_VEHICLE = 9,
  HEAD_ON = 10,
  OPPOSITE_DIRECTION_SIDESWIPE = 11,
  SAME_DIRECTION_SIDESWIPE = 12,
  REAR_END = 13,
  IN_REVERSE = 14,
  CROSS_TRAFFIC = 15,
  SIDE_IMPACT = 16,
  OTHER_VEHICLE_ANDCEHICLE = 17,
  ROLL_OVER_OR_SLIDE = 18,
  RUSH_OUT_OF_ROAD = 19,
  BARRIER_IMPACT = 20,
  TRAFFIC_LIGHT_IMPACT = 21,
  TOLLGATE_IMPACT = 22,
  ISLAND_IMPACT = 23,
  UNFIXED_FACILITY_IMPACT = 24,
  BRIDGE_BUILDING_IMPACT = 25,
  TREE_UTILITY_POLE_IMPACT = 26,
  ANIMAL_IMPACT = 27,
  CONSTRUCTION_FACILITY_IMPACT = 28,
  OTHER_SINGLE_VEHICLE = 29,
  LEVEL_CROSSING_BARRIER_IMPACT = 30,
  CROSSING_LEVEL_CROSSING = 31,
  STOP_WRONG_POSITION = 32,
  STUCK_IN_LEVEL_CROSSING = 33,
  OTEHR_LEVEL_CROSSING = 34,
}

export interface GPS {
  lng: number;
  lat: number;
}

interface CaseParameters {
  id: string;
  date: luxon.DateTime;
  location: string;
  firstAdministrativeLevel: string;
  secondAdministrativeLevel: string;
  severity: Severity;
  gps?: GPS;
  deathIn24Hours?: number;
  deathIn30Days?: number;
  injury?: number;
  weather?: Weather;
  light?: Light;
  roadHierarchy?: RoadHierarchy;
  speedLimit?: number;
  roadGeometry?: RoadGeometry;
  position?: Position;
  roadMaterial?: RoadMaterial;
  roadSurfaceWet?: RoadSurfaceWet;
  roadSurfaceDefect?: RoadSurfaceDefect;
  obstacle?: Obstacle;
  sightDistance?: SightDistance;
  trafficSignal?: TrafficSignal;
  trafficSignalStatus?: TrafficSignalStatus;
  directionDivider?: DirectionDivider;
  normalLaneDivider?: NormalLaneDivider;
  fastSlowLaneDivider?: FastSlowLaneDivider;
  edgeLine?: EdgeLine;
  crashType?: CrashType;
  parties: Party[];
}

/**
 * Class for indicate an accident case
 */
export default class Case extends autoImplements<CaseParameters>() {
  // This is not a perfect method to distinguish different cases.
  // TODO: Find a perfect method to distinguish different cases.
  equalTo(other: Case) {
    return (
      this.date.equals(other.date)
      && this.location === other.location
      && this.severity === other.severity
    );
  }
}
