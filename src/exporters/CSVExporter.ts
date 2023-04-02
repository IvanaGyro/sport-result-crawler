import { transform } from 'stream-transform';
import { stringify } from 'csv-stringify';
import fs from 'fs';
import Case, {
  Severity,
  GPS,
  Weather,
  Light,
  RoadHierarchy,
  RoadGeometry,
  Position,
  RoadMaterial,
  RoadSurfaceWet,
  RoadSurfaceDefect,
  Obstacle,
  SightDistance,
  TrafficSignal,
  TrafficSignalStatus,
  DirectionDivider,
  NormalLaneDivider,
  FastSlowLaneDivider,
  EdgeLine,
  CrashType,
} from '../Case';

import Vehicle, { VehicleUsage } from '../Vehicle';

import Party, {
  Gender,
  InjurySeverity,
  InjuriedArea,
  SaftyDevice,
  Smartphone,
  Action,
  DriverQualification,
  License,
  DrunkDriving,
  CrashArea,
  Cause,
  Job,
  TravelPurpose,
  Citizenship,
} from '../Party';

type MAX_PARTY_COUNT = 5;
const maxPartyCount: MAX_PARTY_COUNT = 5;

// modify from https://stackoverflow.com/a/68487744/6663588
type AddSuffix<Key, Suffix extends string> = Key extends string ? `${Key}${Suffix}` : never;

// modify from https://javascript.plainenglish.io/the-fibonacci-sequence-in-typescript-4401bd3b9d1f
type _ArrayOfSize<N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _ArrayOfSize<N, [true, ...R]>;
type ArrayOfSize<N extends number> = N extends N
  ? number extends N
    ? boolean[]
    : _ArrayOfSize<N, []>
  : never;

type Minus1<A extends any[]> = A extends readonly [any?, ...infer U] ? U : [...A];

type StringifiedParty = {
  [key in keyof (Omit<Party, 'crashArea'> & {
    crashAreaMain?: string;
    crashAreaSub?: string;
  })]: string;
};

type FlatStringifiedParty<Order extends number> = {
  [key in AddSuffix<keyof StringifiedParty, `Party${Order}`>]?: string;
};

type _FlatStringifiedParties<NUM extends any[]> = FlatStringifiedParty<NUM['length']> &
  (NUM['length'] extends 1 ? {} : _FlatStringifiedParties<Minus1<NUM>>);
type AllFlatStringifiedParties<Order extends number> = _FlatStringifiedParties<ArrayOfSize<Order>>;

type StringifiedCaseMetaData = {
  [key in keyof Case as Exclude<key, 'parties' | 'equalTo'>]: string;
};

type StringifiedCase = StringifiedCaseMetaData & {
  // XXX: why it needs to set optional here?
  parties: StringifiedParty[];
};

type FlatStringifiedCase = StringifiedCaseMetaData & {
  // XXX: why it needs to set optional here?
  [key in keyof AllFlatStringifiedParties<MAX_PARTY_COUNT>]?: string;
};

function numberToString(n?: number): string | undefined {
  return n == null ? undefined : n.toString();
}

function severityToString(severity: Severity): string {
  const mapping = {
    [Severity.DEATH_IN_24_HOURS]: 'A1',
    [Severity.DEATH_BETWEEN_2_TO_30_DAYS]: 'A2-1',
    [Severity.INJURY_ONLY_OR_DEATH_BETWEEN_2_TO_30_DAYS]: 'A2',
    [Severity.INJURY_ONLY]: 'A2-2',
    [Severity.ONLY_PROPERTY_DAMAGE]: 'A3',
    [Severity.SELF_SETTLEMENT]: 'A4',
  };
  return mapping[severity];
}

function gpsToString(gps?: GPS): string | undefined {
  return gps && `${gps.lat},${gps.lng}`;
}

function weatherToString(weather?: Weather): string | undefined {
  const mapping = {
    [Weather.STROM]: '暴雨 ',
    [Weather.STRONG_WIND]: '強風',
    [Weather.SAND_WIND]: '風沙',
    [Weather.SMOKE]: '霧或煙',
    [Weather.SNOWE]: '雪',
    [Weather.RAIN]: '雨',
    [Weather.CLOUDY]: '陰',
    [Weather.SUNNY]: '晴',
  };
  return weather && weather && mapping[weather];
}

function lightToString(light?: Light): string | undefined {
  const mapping = {
    [Light.DAYTIME]: '日間自然光線',
    [Light.SUNRISE_SUNSET]: '晨或暮光',
    [Light.NIGHT_LIGHTING]: '夜間（或隧道、地下道、涵洞）有照明',
    [Light.NIGHT_DARK]: '夜間（或隧道、地下道、涵洞）無照明',
  };
  return light && mapping[light];
}

function roadHierarchyToString(roadHierarchy?: RoadHierarchy): string | undefined {
  const mapping = {
    [RoadHierarchy.FREEWAY]: '國道',
    [RoadHierarchy.PROVINCIAL]: '省道',
    [RoadHierarchy.COUNTY]: '縣道',
    [RoadHierarchy.COUNTRY]: '鄉道',
    [RoadHierarchy.CITY]: '市區道路',
    [RoadHierarchy.VILLAGE]: '村里道路',
    [RoadHierarchy.EXCLUDED]: '專用道路',
    [RoadHierarchy.OTHER]: '其他',
  };
  return roadHierarchy && mapping[roadHierarchy];
}

function roadGeometryToString(roadGeometry?: RoadGeometry): string | undefined {
  const mapping = {
    [RoadGeometry.OPEN_LEVEL_CROSSING]: '有遮斷器',
    [RoadGeometry.BARRIER_LEVEL_CROSSING]: '無遮斷器',
    [RoadGeometry.THREE_WAY_INTERSECTION]: '三岔路',
    [RoadGeometry.CROSS_INTERSECTION]: '四岔路 ',
    [RoadGeometry.MULTIWAY_INTERSECTION]: '多岔路',
    [RoadGeometry.TUNNEL]: '隧道',
    [RoadGeometry.UNDERPASS]: '地下道',
    [RoadGeometry.BRIDGE]: '橋樑',
    [RoadGeometry.CULVERT]: '涵洞',
    [RoadGeometry.VIADUCT]: '高架道路',
    [RoadGeometry.CURVE]: '彎曲路及附近',
    [RoadGeometry.SLOPE]: '坡路',
    [RoadGeometry.ALLEY]: '巷弄',
    [RoadGeometry.STRAIGHT]: '直路',
    [RoadGeometry.OTHER]: '其他單路',
    [RoadGeometry.ROUNDABOUT]: '圓環',
    [RoadGeometry.SQUARE]: '廣場',
  };
  return roadGeometry && mapping[roadGeometry];
}

function positionToString(position?: Position): string | undefined {
  const mapping = {
    [Position.INTERSECTION]: '交岔路口內',
    [Position.NEARBY_INTERSECTION]: '交岔口附近',
    [Position.HOOK_TURN_AREA]: '機車待轉區',
    [Position.BIKE_STOP_AREA]: '機車停等區 ',
    [Position.TRAFFIC_ISLAND]: '交通島 ',
    [Position.U_TURN]: '迴轉道',
    [Position.FAST_LANE]: '快車道',
    [Position.SLOW_LANE]: '慢車道',
    [Position.NORMAL_LANE]: '一般車道(未劃分快慢車道)',
    [Position.BUS_LANE]: '公車專用道',
    [Position.MOTORCYCLE_LANE]: '機車專用道',
    [Position.MOTORCYCLE_FIRST_LANE]: '機車優先道 ',
    [Position.ROAD_SHOULDER]: '路肩、路緣 ',
    [Position.ACCELERATION_LANE]: '加速車道',
    [Position.DECELERATION_LANE]: '減速車道',
    [Position.STRAIGHT_RAMP]: '直線匝道',
    [Position.BEND_RAMP]: '環道匝道',
    [Position.PEDESTRIAN_CROSSING]: '行人穿越道',
    [Position.NEARBY_PEDESTRIAN_CROSSING]: '穿越道附近',
    [Position.SIDEWALK]: '人行道',
    [Position.TOLLGATE]: '收費站附近',
    [Position.OTHER]: '其他',
  };
  return position && mapping[position];
}

function roadMaterialToString(roadMaterial?: RoadMaterial): string | undefined {
  const mapping = {
    [RoadMaterial.ASPHALT]: '柏油',
    [RoadMaterial.CONCRETE]: '水泥',
    [RoadMaterial.GRAVEL]: '碎石',
    [RoadMaterial.OTHER]: '其他鋪裝',
    [RoadMaterial.NONE]: '無鋪裝',
  };
  return roadMaterial && mapping[roadMaterial];
}

function roadSurfaceWetToString(roadSurfaceWet?: RoadSurfaceWet): string | undefined {
  const mapping = {
    [RoadSurfaceWet.SNOW]: '冰雪',
    [RoadSurfaceWet.OIL]: '油滑',
    [RoadSurfaceWet.MUD]: '泥濘',
    [RoadSurfaceWet.WET]: '濕潤',
    [RoadSurfaceWet.DRY]: '乾燥',
  };
  return roadSurfaceWet && mapping[roadSurfaceWet];
}

function roadSurfaceDefectToString(roadSurfaceDefect?: RoadSurfaceDefect): string | undefined {
  const mapping = {
    [RoadSurfaceDefect.SOFT]: '路面鬆軟',
    [RoadSurfaceDefect.CORRUGATION]: '突出(高低)不平',
    [RoadSurfaceDefect.HOLE]: '有坑洞',
    [RoadSurfaceDefect.NONE]: '無缺陷',
  };
  return roadSurfaceDefect && mapping[roadSurfaceDefect];
}

function obstacleToString(obstacle?: Obstacle): string | undefined {
  const mapping = {
    [Obstacle.UNDER_CONSTRUCTION]: '道路工事（程）中',
    [Obstacle.STUFF]: '有堆積物',
    [Obstacle.PARKING]: '路上有停車',
    [Obstacle.OTHER]: '其他障礙物',
    [Obstacle.NONE]: '無障礙物',
  };
  return obstacle && mapping[obstacle];
}

function sightDistanceToString(sightDistance?: SightDistance): string | undefined {
  const mapping = {
    [SightDistance.BEND]: '彎道',
    [SightDistance.SLOPE]: '坡道',
    [SightDistance.BUILDING]: '建築物',
    [SightDistance.PLANT]: '樹木、農作物',
    [SightDistance.PARKING]: '路上停放車輛',
    [SightDistance.OTHER]: '其他',
    [SightDistance.GOOD]: '良好',
  };
  return sightDistance && mapping[sightDistance];
}

function trafficSignalToString(trafficSignal?: TrafficSignal): string | undefined {
  const mapping = {
    [TrafficSignal.NORMAL]: '行車管制號誌',
    [TrafficSignal.NORMAL_WITH_WALKING_PERSON]: '行車管制號誌（附設行人專用號誌）',
    [TrafficSignal.FLASH]: '閃光號誌',
    [TrafficSignal.NONE]: '無號誌',
  };
  return trafficSignal && mapping[trafficSignal];
}

function trafficSignalStatusToString(
  trafficSignalStatus?: TrafficSignalStatus,
): string | undefined {
  const mapping = {
    [TrafficSignalStatus.NORMAL]: '正常',
    [TrafficSignalStatus.UNUSUAL]: '不正常',
    [TrafficSignalStatus.NO_ACTION]: '無動作',
    [TrafficSignalStatus.NO_TRAFFIC_LIGHT]: '無號誌',
  };
  return trafficSignalStatus && mapping[trafficSignalStatus];
}

function directionDividerToString(directionDivider?: DirectionDivider): string | undefined {
  const mapping = {
    [DirectionDivider.WIDE_ISLAND]: '寬式分向島（50公分以上）',
    [DirectionDivider.NARROW_ISLAND_WITH_BARRIER]: '窄式分向島附柵欄',
    [DirectionDivider.NARROW_ISLAND_WITHOUT_BARRIER]: '窄式分向島無柵欄',
    [DirectionDivider.DOUBLE_YELLOW_LINE_WITH_MARK]: '雙向禁止超車線附標記',
    [DirectionDivider.DOUBLE_YELLOW_LINE_WITHOUT_MARK]: '雙向禁止超車線無標記',
    [DirectionDivider.SOLID_BROKEN_YELLOW_LINE_WITH_MARK]: '單向禁止超車附標記',
    [DirectionDivider.SOLID_BROKEN_YELLOW_LINE_WITHOUT_MARK]: '單向禁止超車無標記',
    [DirectionDivider.BROKEN_YELLOW_LINE_WITH_MARK]: '行車分向線附標記',
    [DirectionDivider.BROKEN_YELLOW_LINE_WITHOUT_MARK]: '行車分向線無標記',
    [DirectionDivider.NONE]: '無分向設施',
  };
  return directionDivider && mapping[directionDivider];
}

function normalLaneDividerToString(normalLaneDivider?: NormalLaneDivider): string | undefined {
  const mapping = {
    [NormalLaneDivider.DOUBLE_WHITE_LINE_WITH_MARK]: '禁止變換車道線（附標記）',
    [NormalLaneDivider.DOUBLE_WHITE_LINE_WITHOUT_MARK]: '禁止變換車道線（無標記）',
    [NormalLaneDivider.BROKEN_WHITE_LINE_WITH_MARK]: '車道線（附標記）',
    [NormalLaneDivider.BROKEN_WHITE_LINE_WITHOUT_MARK]: '車道線（無標記）',
    [NormalLaneDivider.NONE]: '未繪設車道線',
  };
  return normalLaneDivider && mapping[normalLaneDivider];
}

function fastSlowLaneDividerToString(
  fastSlowLaneDivider?: FastSlowLaneDivider,
): string | undefined {
  const mapping = {
    [FastSlowLaneDivider.WIDE_ISLAND]: '寬式快慢車道分隔島（50公分以上）',
    [FastSlowLaneDivider.NARROW_ISLAND_WITH_BARRIER]: '窄式快慢車道分隔島（附柵欄）',
    [FastSlowLaneDivider.NARROW_ISLAND_WITHOUT_BARRIER]: '窄式快慢車道分隔島（無柵欄）',
    [FastSlowLaneDivider.FAST_SLOW_LANE_LINE]: '快慢車道分隔線',
    [FastSlowLaneDivider.NONE]: '未繪設快慢車道分隔線',
  };
  return fastSlowLaneDivider && mapping[fastSlowLaneDivider];
}

function edgeLineToString(edgeLine?: EdgeLine): string | undefined {
  const mapping = {
    [EdgeLine.HAVE]: '有',
    [EdgeLine.NONE]: '無',
  };
  return edgeLine && mapping[edgeLine];
}

// TODO: differentiate all "other"s
function crashTypeToString(crashType?: CrashType): string | undefined {
  const mapping = {
    [CrashType.WALK_INVERSE_DIRECTION]: '對向通行中',
    [CrashType.WALK_SAME_DIRECTION]: '同向通行中',
    [CrashType.CROSSING_ROAD]: '穿越道路中',
    [CrashType.PLAYING_ON_ROAD]: '在路上嬉戲',
    [CrashType.WORKING_ON_ROAD]: '在路上作業中',
    [CrashType.RUNNING_INTO_ROAD]: '衝進路中',
    [CrashType.IMMERSING_BEHIND_CARS]: '從停車後（或中）穿出',
    [CrashType.STANDING_OUTSIDE_ROAD]: '佇立路邊（外）',
    [CrashType.OTHER_HUMAN_AND_VEHICLE]: '其他人與車事故',
    [CrashType.HEAD_ON]: '對撞',
    [CrashType.OPPOSITE_DIRECTION_SIDESWIPE]: '對向擦撞',
    [CrashType.SAME_DIRECTION_SIDESWIPE]: '同向擦撞',
    [CrashType.REAR_END]: '追撞',
    [CrashType.IN_REVERSE]: '倒車撞',
    [CrashType.CROSS_TRAFFIC]: '路口交岔撞',
    [CrashType.SIDE_IMPACT]: '側撞',
    [CrashType.OTHER_VEHICLE_ANDCEHICLE]: '其他車與車事故',
    [CrashType.ROLL_OVER_OR_SLIDE]: '路上翻車、摔倒',
    [CrashType.RUSH_OUT_OF_ROAD]: '衝出路外',
    [CrashType.BARRIER_IMPACT]: '撞護欄（樁）',
    [CrashType.TRAFFIC_LIGHT_IMPACT]: '撞號誌、標誌桿',
    [CrashType.TOLLGATE_IMPACT]: '撞收費亭',
    [CrashType.ISLAND_IMPACT]: '撞交通島',
    [CrashType.UNFIXED_FACILITY_IMPACT]: '撞非固定設施',
    [CrashType.BRIDGE_BUILDING_IMPACT]: '撞橋樑、建築物',
    [CrashType.TREE_UTILITY_POLE_IMPACT]: '撞路樹、電桿',
    [CrashType.ANIMAL_IMPACT]: '撞動物',
    [CrashType.CONSTRUCTION_FACILITY_IMPACT]: '撞工程施工',
    [CrashType.OTHER_SINGLE_VEHICLE]: '其他汽機車本身事故',
    [CrashType.LEVEL_CROSSING_BARRIER_IMPACT]: '衝過（或撞壞）遮斷器',
    [CrashType.CROSSING_LEVEL_CROSSING]: '正越過平交道中',
    [CrashType.STOP_WRONG_POSITION]: '暫停位置不當',
    [CrashType.STUCK_IN_LEVEL_CROSSING]: '在平交道內無法行動',
    [CrashType.OTEHR_LEVEL_CROSSING]: '其他平交道事故',
  };
  return crashType && mapping[crashType];
}

function vehicleToString(vehicle: Vehicle): string {
  const mapping = {
    [Vehicle.PUBLIC_CITY_BUS.key]: '公營公車',
    [Vehicle.PRIVATE_CITY_BUS.key]: '民營公車',
    [Vehicle.PUBLIC_HIGHWAY_BUS.key]: '公營客運',
    [Vehicle.PRIVATE_HIGHWAY_BUS.key]: '民營客運',
    [Vehicle.TOUR_BUS.key]: '遊覽車',
    [Vehicle.PERSONAL_BUS.key]: '自用大客車',
    [Vehicle.BUSINESS_HEAVY_TRUCK.key]: '營業用大貨車',
    [Vehicle.PERSONAL_HEAVY_TRUCK.key]: '自用大貨車',
    [Vehicle.BUSINESS_FULL_TRAILER.key]: '營業用全聯結車',
    [Vehicle.PERSONAL_FULL_TRAILER.key]: '自用全全聯結車',
    [Vehicle.BUSINESS_SEMI_TRAILER.key]: '營業用半半聯結車',
    [Vehicle.PERSONAL_SEMI_TRAILER.key]: '自用半聯結車',
    [Vehicle.BUSINESS_TRACTOR.key]: '營業用曳引車',
    [Vehicle.PERSONAL_TRACTOR.key]: '自用曳引車',
    [Vehicle.TAXI.key]: '計程車',
    [Vehicle.RENTAL_CAR.key]: '租賃車',
    [Vehicle.PERSONAL_CAR.key]: '自用小客車',
    [Vehicle.BUSINESS_PICKUP_TRUCK.key]: '營業用小貨車',
    [Vehicle.PERSONAL_PICKUP_TRUCK.key]: '自用小貨車',
    [Vehicle.MOTORCYCLE_550_UP.key]: 'C01大型重型1機車（550C.C.',
    [Vehicle.MOTORCYCLE_250_TO_549.key]: 'C02大型重型2機車（250-550C.C.',
    [Vehicle.MOTORCYCLE_50_TO_249.key]: '普通重型機車',
    [Vehicle.MOTORCYCLE_49_UNDER.key]: '普通輕型機車',
    [Vehicle.MOTORCYCLE_45_KPH_UNDER.key]: '小型輕型機車',
    [Vehicle.MILITARY_BUS.key]: '軍車大客車',
    [Vehicle.MILITARY_HEAVY_TRUCK.key]: '軍車載重車',
    [Vehicle.MILITARY_CAR.key]: '軍車小型車',
    [Vehicle.AMBULANCE.key]: '救護車',
    [Vehicle.FIRE_ENGINE.key]: '消防車',
    [Vehicle.POLICE_VEHICLE.key]: '警備車',
    [Vehicle.ENGINEERING_VEHICLE.key]: '工程車',
    [Vehicle.OTHER_SPECIAL_VEHICLE.key]: '其他特種車',
    [Vehicle.BICYCLE.key]: '腳踏自行車',
    [Vehicle.PEDELEC.key]: '電動輔助自行車',
    [Vehicle.PEDAL_FREE_PEDELEC.key]: '電動自行車',
    [Vehicle.RICKSHAW.key]: '人力車',
    [Vehicle.ANIMAL_DRAWN_VEHICLE.key]: '獸力車',
    [Vehicle.OTHER_SLOW_VEHICLE.key]: '其他慢車',
    [Vehicle.SELF_ASSEMBLED_VEHICLE.key]: '拼裝車',
    [Vehicle.AGRICULTURAL_MACHINARY.key]: '農耕用車（或機械）',
    [Vehicle.POWER_MACHINE.key]: '動力機械',
    [Vehicle.TRAILER.key]: '拖車（架）',
    [Vehicle.TRAIN.key]: '火車',
    [Vehicle.OTHER_VEHICLE.key]: '其他車',
    [Vehicle.PEDESTRIAN.key]: '行人',
    [Vehicle.PASSENGER.key]: '乘客',
    [Vehicle.OTEHR_PEOPLE.key]: '其他人',
    [Vehicle.OTHER.key]: '',
  };
  return mapping[vehicle.key];
}

function vehicleUsageToString(vehicleUsage?: VehicleUsage): string | undefined {
  const mapping = {
    [VehicleUsage.GRAVEL_TRACK]: '砂石車',
    [VehicleUsage.CHILDREN_USE_VEHICLE]: '幼童專用車',
    [VehicleUsage.SCHOOL_BUS]: '校車',
    [VehicleUsage.DISABLED_SPECIAL_VEHICLE]: '殘障特製車',
    [VehicleUsage.COACH_VEHICLE]: '教練車',
    [VehicleUsage.LOADING_DANGEROUS_GOODS]: '裝載危險物品車',
    [VehicleUsage.OTHER]: '其他',
    [VehicleUsage.NOT_DRIVER]: '非駕駛人及乘客',
  };
  return vehicleUsage && mapping[vehicleUsage];
}

function genderToString(gender?: Gender): string | undefined {
  const mapping = {
    [Gender.MALE]: '男',
    [Gender.FEMALE]: '女',
    [Gender.NOTHING_OR_STUFF]: '無或物（動物、堆置物）',
    [Gender.HIT_AND_RUN]: '肇事逃逸尚未查獲',
  };
  return gender && mapping[gender];
}

function injurySeverityToString(injuryseverity?: InjurySeverity): string | undefined {
  const mapping = {
    [InjurySeverity.DEATH]: '24小時內死亡',
    [InjurySeverity.INJURY]: '受傷',
    [InjurySeverity.NO_INJURY]: '未受傷',
    [InjurySeverity.UNKNOWN]: '不明',
    [InjurySeverity.DEATH_IN_30_DAYS]: '2-30日內死亡',
  };
  return injuryseverity && mapping[injuryseverity];
}

function injuriedAreaToString(injuriedarea?: InjuriedArea): string | undefined {
  const mapping = {
    [InjuriedArea.HEAD]: '頭部',
    [InjuriedArea.NECK]: '頸部',
    [InjuriedArea.CHEST]: '胸部',
    [InjuriedArea.ABDOMEN]: '腹部',
    [InjuriedArea.WAIST]: '腰部',
    [InjuriedArea.BACK]: '背脊部',
    [InjuriedArea.HAND]: '手（腕）部',
    [InjuriedArea.LEG]: '腿（腳）部',
    [InjuriedArea.MULTIPLE]: '多數傷',
    [InjuriedArea.NONE]: '無',
    [InjuriedArea.UNKNOWN]: '不明',
  };
  return injuriedarea && mapping[injuriedarea];
}

function saftyDeviceToString(saftydevice?: SaftyDevice): string | undefined {
  const mapping = {
    [SaftyDevice.USE_SAFETY_DEVICE]: '戴安全帽或繫安全帶（使用幼童安全椅）',
    [SaftyDevice.NO_SAFETY_DEVICE]: '未戴安全帽或未繫安全帶（未使用幼童安全椅）',
    [SaftyDevice.UNKNOWN]: '不明',
    [SaftyDevice.OTHER]: '其他（行人、慢車駕駛人）',
  };
  return saftydevice && mapping[saftydevice];
}

function smartphoneToString(smartphone?: Smartphone): string | undefined {
  const mapping = {
    [Smartphone.NOT_USE]: '未使用',
    [Smartphone.HANDHELD]: '使用手持或有礙駕駛安全',
    [Smartphone.HADNS_FREE]: '使用免持或未有礙駕駛安全',
    [Smartphone.UNKNOWN]: '不明',
    [Smartphone.NOT_DRIVER]: '非汽（機）車駕駛人',
  };
  return smartphone && mapping[smartphone];
}

// TODO: differentiate "other"s
function actionToString(action?: Action): string | undefined {
  const mapping = {
    [Action.PULLING_OUT]: '起步',
    [Action.REVERSING]: '倒車',
    [Action.DOING_PARKING]: '停車操作中',
    [Action.OVER_TAKING]: '超車（含超越）',
    [Action.TURNING_LEFT]: '左轉彎',
    [Action.TURNING_RIGHT]: '右轉彎',
    [Action.CHANGING_TO_LEFT_LANE]: '向左變換車道',
    [Action.CHANGING_TO_RIGHT_LANE]: '向右變換車道',
    [Action.FORWARD]: '向前直行中',
    [Action.INSERTING_INTO_LINE]: '插入行列',
    [Action.U_TRUNING_OR_CROSSING]: '迴轉或橫越道路中',
    [Action.SUDDEN_STOP]: '急減速或急停止',
    [Action.PARKING]: '靜止（引擎熄火）',
    [Action.STOPING_OR_WAITING]: '停等（引擎未熄火）',
    [Action.OTHER_VEHICLE_ACTION]: '其他車的狀態',
    [Action.WALKING]: '步行',
    [Action.STANDING]: '靜立（止）',
    [Action.RUNNING]: '奔跑',
    [Action.GETTING_ON_OR_OFF]: '上、下車',
    [Action.OTEHR_PEOPLE_ACTION]: '其他人的狀態',
    [Action.UNKNOWN]: '不明',
  };
  return action && mapping[action];
}

function driverQualificationToString(
  driverqualification?: DriverQualification,
): string | undefined {
  const mapping = {
    [DriverQualification.HAVE_LICENSE]: '有適當之駕照',
    [DriverQualification.NO_LICENSE_UNDER_AGE]: '無照（未達考照年齡）',
    [DriverQualification.NO_LICENSE_OVER_AGE]: '無照（已達考照年齡）',
    [DriverQualification.DRIVE_OVER_LEVEL]: '越級駕駛',
    [DriverQualification.SUSPENDED]: '駕照被吊扣',
    [DriverQualification.REVOKED]: '駕照被吊（註）銷',
    [DriverQualification.UNKNOWN]: '不明',
    [DriverQualification.NOT_DRIVER]: '非汽（機）車駕駛人',
  };
  return driverqualification && mapping[driverqualification];
}
function licenseToString(license?: License): string | undefined {
  const mapping = {
    [License.BUSINESS_TRAILER]: '職業聯結車',
    [License.BUSINESS_BUS]: '職業大客車',
    [License.BUSINESS_HEAVY_TRUCK]: '職業大貨車',
    [License.BUSINESS_CAR]: '職業小型車',
    [License.NORMAL_TRAILER]: '普通聯結車',
    [License.NORMAL_BUS]: '普通大客車',
    [License.NORMAL_HEAVY_TRUCK]: '普通大貨車',
    [License.NORMAL_CAR]: '普通小型車',
    [License.MOTORCYCLE_250_UP]: '大型重型機車',
    [License.MOTORCYCLE_50_TO_249]: '普通重型機車',
    [License.MOTORCYCLE_49_UNDER]: '輕型機車',
    [License.MILITARY_BUS]: '軍用大客車',
    [License.MILITARY_HEAVY_TRUCK]: '軍用載重車',
    [License.MILITARY_CAR]: '軍用小型車',
    [License.INTERNATIONAL_LICENSE]: '國際（外國）駕照',
    [License.OTHER_LICENSE]: '其他駕照（證）',
    [License.LEARNING_LICENSE]: '學習駕駛證',
    [License.NO_LICENSE]: '無駕駛執照',
    [License.UNKNOWN]: '不明',
    [License.NOT_DRIVER]: '非汽（機）車駕駛人',
  };
  return license && mapping[license];
}

function drunkDrivingToString(drunkdriving?: DrunkDriving): string | undefined {
  const mapping = {
    [DrunkDriving.LOOK_NOT_DRUNK]: '經觀察未飲酒',
    [DrunkDriving.NO_ALCOHOL_REACTION_DETECTED]: '經檢測無酒精反應',
    [DrunkDriving.LESS_EQUAL_THAN_15]: '經呼氣檢測未超過0.15mg/L或血液檢測未超過0.03%',
    [DrunkDriving.BETWEEN_16_AND_25]: '經呼氣檢測0.16~0.25mg/L或血液檢測0.031%~0.05%',
    [DrunkDriving.BETWEEN_26_AND_40]: '經呼氣檢測0.26~0.40mg/L或血液檢測0.051%~0.08%',
    [DrunkDriving.BETWEEN_41_AND_55]: '經呼氣檢測0.41~0.55mg/L或血液檢測0.081%~0.11%',
    [DrunkDriving.BETWEEN_56_AND_80]: '經呼氣檢測0.56~0.80mg/L或血液檢測0.111%~0.16%',
    [DrunkDriving.GREATER_THAN_80]: '經呼氣檢測超過0.80mg/L或血液檢測超過0.16%',
    [DrunkDriving.CANNOT_TEST]: '無法檢測',
    [DrunkDriving.NOT_DRIVER_OR_NOT_TESTED]: '非駕駛人，未檢測',
    [DrunkDriving.UNKNOWN]: '不明',
  };
  return drunkdriving && mapping[drunkdriving];
}

function crashAreaToString(crasharea?: CrashArea): string | undefined {
  const mapping = {
    [CrashArea.CAR_FRONT]: '汽車前車頭',
    [CrashArea.CAR_RIGHT]: '汽車右側車身',
    [CrashArea.CAR_REAR]: '汽車後車尾',
    [CrashArea.CAR_LEFT]: '汽車左側車身',
    [CrashArea.CAR_RIGHT_FRONT]: '汽車右前車頭（身）',
    [CrashArea.CAR_RIGHT_REAR]: '汽車右後車尾（身）',
    [CrashArea.CAR_LEFT_REAR]: '汽車左後車尾（身）',
    [CrashArea.CAR_LEFT_FRONT]: '汽車左前車頭（身）',
    [CrashArea.CAR_TOP]: '汽車車頂',
    [CrashArea.CAR_UNDERCARRIAGE]: '汽車車底',
    [CrashArea.MOTORCYCLE_FRONT]: '機車前車頭',
    [CrashArea.MOTORCYCLE_RIGHT]: '機車右側車身',
    [CrashArea.MOTORCYCLE_REAR]: '機車後車尾',
    [CrashArea.MOTORCYCLE_LEFT]: '機車左側車身',
    [CrashArea.UNKNOWN]: '不明',
    [CrashArea.NOT_VEHICLE]: '非汽（機）車',
  };
  return crasharea && mapping[crasharea];
}

function causeToString(cause?: Cause): string | undefined {
  const mapping = {
    [Cause.ILLEGALLY_OVER_TAKING]: '違規超車',
    [Cause.SCRAMBLE_TO_DRIVE_IN_A_LANE]: '爭（搶）道行駛',
    [Cause.WEAVE_ON_ROAD]: '蛇行、方向不定',
    [Cause.OPPOSITE_DIRECTION]: '逆向行駛',
    [Cause.NOT_DRIVE_ON_RIGHT_SIDE]: '未靠右行駛',
    [Cause.NOT_GIVE_WAY]: '未依規定讓車',
    [Cause.BADLY_CHANGE_LANE]: '變換車道或方向不當',
    [Cause.ILLEGALLY_LEFT_TURN]: '左轉彎未依規定',
    [Cause.ILLEGALLY_RIGHT_TURN]: '右轉彎未依規定',
    [Cause.ILLEGALLY_U_TRUN]: '迴轉未依規定',
    [Cause.BADLY_CROSS_ROAD]: '橫越道路不慎',
    [Cause.ILLEGALLY_REVERSE]: '倒車未依規定',
    [Cause.OVERSPEED]: '超速失控',
    [Cause.NOT_SLOW_DOWN]: '未依規定減速',
    [Cause.SCRAMBLE_TO_CROSS_CROSSWALK]: '搶越行人穿越道',
    [Cause.NOT_KEEP_DISTANCE]: '未保持行車安全距離',
    [Cause.NOT_KEEP_INTERVAL]: '未保持行車安全間隔',
    [Cause.NOT_NOTICE_OTHERS_WHILE_PARKING]: '停車操作時，未注意其他車（人）安全',
    [Cause.NOT_NOTICE_OTHERS_WHILE_PULLING_OFF]: '起步未注意其他車（人）安全',
    [Cause.DRUG_DRIVING]: '吸食違禁物後駕駛失控',
    [Cause.DRUNK_DRIVING]: '酒醉（後）駕駛失控',
    [Cause.DROWSY_DRIVING]: '疲勞（患病）駕駛失控',
    [Cause.NOT_NOTICE_FRONT]: '未注意車前狀態',
    [Cause.SCRAMBLE_TO_CROSS_CROSSING_LEVEL]: '搶（闖）越平交道',
    [Cause.VIOLATE_SIGNAL]: '違反號誌管制或指揮',
    [Cause.VIOLATE_SIGN]: '違反特定標誌（線）禁制',
    [Cause.ILLEGALLY_USE_LIGHT]: '未依規定使用燈光',
    [Cause.PARK_IN_DARK_WITHOUT_LIGHT]: '暗處停車無燈光、標識',
    [Cause.DRIVE_AT_NIGHT_WITHOUT_LIGHT]: '夜間行駛無燈光設備',
    [Cause.GOODS_NOT_RESTRAINED]: '裝載貨物不穩妥',
    [Cause.OVERLOADED]: '載貨超重而失控',
    [Cause.CARRY_EXCESS_PASSENGER]: '超載人員而失控',
    [Cause.OVERSIZE_LOAD]: '貨物超長、寬、高而肇事',
    [Cause.BADLY_LOAD]: '裝卸貨物不當',
    [Cause.UNSAFELY_LOAD]: '裝載未盡安全措施',
    [Cause.DRIVE_WHILE_PASSENGER_GET_ON_OFF]: '未待乘客安全上下開車',
    [Cause.OTHER_BADLY_LOAD_OR_CARRY]: '其他裝載不當肇事',
    [Cause.ILLEGALLY_PARK_OR_STOP]: '違規停車或暫停不當而肇事',
    [Cause.BROKEN_DOWN_WITHOUT_SAFTY_ACTION]: '拋錨未採安全措施',
    [Cause.BADLY_OPEN_DOOR]: '開啟車門不當而肇事',
    [Cause.USE_HANDHELD_PHONE]: '使用手持行動電話失控',
    [Cause.OTEHR_ILLEGALY_ACT]: '其他引起事故之違規或不當行為',
    [Cause.UNKNOWN]: '不明原因肇事',
    [Cause.NONE_FOR_DRIVER]: '尚未發現肇事因素',
    [Cause.BRAKE_FAILURE]: '煞車失靈',
    [Cause.STEERING_WHEEL_FAILURE]: '方向操縱系統故障',
    [Cause.LIGHT_FAILURE]: '燈光系統故障',
    [Cause.BROKEN_TIRES]: '車輪脫落或輪胎爆裂',
    [Cause.VEHICLE_PART_FALL_OFF]: '車輛零件脫落',
    [Cause.OTHER_VEHICLE_FAILURE]: '其他引起事故之故障',
    [Cause.NOT_WALK_ON_CROSSWALK]: '未依規定行走行人穿越道、地下道、天橋而穿越道路',
    [Cause.CROSS_WITHOUT_FOLLOWING_SIGN]: '未依標誌、標線、號誌或手勢指揮穿越道路',
    [Cause.NOT_SEE_COMING_VEHICLES]: '穿越道路未注意左右來車',
    [Cause.PLAY_ON_ROAD]: '在道路上嬉戲或奔走不定',
    [Cause.GET_ON_OFF_BEORE_STOPPING]: '未待車輛停妥而上下車',
    [Cause.GET_ON_OFF_WITHOUT_ATTENTION]: '上下車輛未注意安全',
    [Cause.PUT_HEAD_HAND_OUTSIDE_VEHICLE]: '頭手伸出車外而肇事',
    [Cause.BADLY_SIT]: '乘坐不當而跌落',
    [Cause.WORK_WITHOUT_SIGN]: '在路上工作未設適當標識',
    [Cause.OTHER_FOR_NON_DRIVER]: '其他引起事故之疏失或行為',
    [Cause.DANGEROUS_ROAD]: '路況危險無安全（警告）設施',
    [Cause.SIGNAL_FAILURE]: '交通管制設施失靈或損毀',
    [Cause.BADLY_DIRECT_TRAFFIC]: '交通指揮不當',
    [Cause.LEVEL_CROSSING_FAILURE]: '平交道看守疏失或未放柵欄',
    [Cause.OTHER_BAD_MANAGEMENT]: '其他交通管制不當',
    [Cause.ANIMAL_RUSH_OUT]: '動物竄出',
    [Cause.NONE_FOR_NON_DRIVER]: '尚未發現肇事因素',
  };
  return cause && mapping[cause];
}

function isHitAndRunToString(isHitAndRun?: boolean): string | undefined {
  return isHitAndRun ? '是' : '否';
}

function jobToString(job?: Job): string | undefined {
  const mapping = {
    [Job.ADMINISTRATOR]: '民意代表、行政主管、企業主管及經理人員',
    [Job.PROFESSIONAL]: '專業人員',
    [Job.TECHNICLE]: '技術員及助理人員',
    [Job.CLERICAL_SUPPORT]: '事務工作者',
    [Job.SERVICE]: '服務工作者',
    [Job.SALES]: '售貨員',
    [Job.FARMER_OR_FISHER]: '農林漁牧工作者',
    [Job.SECURITY]: '保安工作者（不含警察人員）',
    [Job.CRAFT]: '技術工',
    [Job.PROFESSIONAL_DRIVER]: '汽車、火車駕駛員及船員',
    [Job.MACHINE_OPERATOR]: '機械設備操作工及組裝工',
    [Job.ELEMENTARY_LABOURER]: '非技術工及體力工',
    [Job.UNDER_SCHOOL_AGE]: '未就學兒童',
    [Job.ELEMENTARY_SCHOOL]: '小學生',
    [Job.JUNIOR_HIGH_SCHOOL]: '國中生',
    [Job.SENIOR_HIGH_SCHOOL]: '高中生',
    [Job.JUNIOR_COLLEDGE]: '專科生',
    [Job.UNIVERSITY]: '大學（研究）生',
    [Job.HOUSEWORKER]: '家庭主婦（夫）',
    [Job.JOBLESS]: '無業者',
    [Job.OTHER]: '其他',
    [Job.UNKNOWN]: '不明',
    [Job.POLICE]: '警察人員',
  };
  return job && mapping[job];
}

function travelPurposeToString(travelpurpose?: TravelPurpose): string | undefined {
  const mapping = {
    [TravelPurpose.WORK]: '上、下班',
    [TravelPurpose.SCHOOL]: '上、下學',
    [TravelPurpose.BUSINESS]: '業務聯繫',
    [TravelPurpose.TRANSPORT]: '運輸',
    [TravelPurpose.COMMUTATION]: '社交活動',
    [TravelPurpose.TARVEL]: '觀光旅遊',
    [TravelPurpose.SHOPPING]: '購物',
    [TravelPurpose.OTHER]: '其他',
    [TravelPurpose.UNKNOWN]: '不明',
  };
  return travelpurpose && mapping[travelpurpose];
}

function citizenshipToString(citizenship?: Citizenship): string | undefined {
  const mapping = {
    [Citizenship.CITIZEN]: '國人',
    [Citizenship.NON_CITIZEN]: '非國人',
  };
  return citizenship && mapping[citizenship];
}

export default class CSVExporter {
  static export(
    filename: string,
    cases: Case[],
    partyNumber: number = 2,
    combine: boolean = false,
  ): void {
    const toStringStream = transform(cases, (curCase: Case): StringifiedCase => {
      const transmformedCase: StringifiedCase = {
        id: curCase.id,
        date: curCase.date.toISO({ includeOffset: false }),
        location: curCase.location,
        firstAdministrativeLevel: curCase.firstAdministrativeLevel,
        secondAdministrativeLevel: curCase.secondAdministrativeLevel,
        severity: severityToString(curCase.severity),
        gps: gpsToString(curCase.gps),
        deathIn24Hours: numberToString(curCase.deathIn24Hours),
        deathIn30Days: numberToString(curCase.deathIn30Days),
        injury: numberToString(curCase.injury),
        weather: weatherToString(curCase.weather),
        light: lightToString(curCase.light),
        roadHierarchy: roadHierarchyToString(curCase.roadHierarchy),
        speedLimit: numberToString(curCase.speedLimit),
        roadGeometry: roadGeometryToString(curCase.roadGeometry),
        position: positionToString(curCase.position),
        roadMaterial: roadMaterialToString(curCase.roadMaterial),
        roadSurfaceWet: roadSurfaceWetToString(curCase.roadSurfaceWet),
        roadSurfaceDefect: roadSurfaceDefectToString(curCase.roadSurfaceDefect),
        obstacle: obstacleToString(curCase.obstacle),
        sightDistance: sightDistanceToString(curCase.sightDistance),
        trafficSignal: trafficSignalToString(curCase.trafficSignal),
        trafficSignalStatus: trafficSignalStatusToString(curCase.trafficSignalStatus),
        directionDivider: directionDividerToString(curCase.directionDivider),
        normalLaneDivider: normalLaneDividerToString(curCase.normalLaneDivider),
        fastSlowLaneDivider: fastSlowLaneDividerToString(curCase.fastSlowLaneDivider),
        edgeLine: edgeLineToString(curCase.edgeLine),
        crashType: crashTypeToString(curCase.crashType),
        parties: [],
      };
      transmformedCase.parties = curCase.parties.map((party: Party) => {
        const { order } = party;
        return {
          id: party.id,
          order: `${order}`,
          vehicle: vehicleToString(party.vehicle),
          gender: genderToString(party.gender),
          age: numberToString(party.age),
          injurySeverity: injurySeverityToString(party.injurySeverity),
          injuriedArea: injuriedAreaToString(party.injuriedArea),
          saftyDevice: saftyDeviceToString(party.saftyDevice),
          smartPhone: smartphoneToString(party.smartPhone),
          vehicleUsage: vehicleUsageToString(party.vehicleUsage),
          action: actionToString(party.action),
          driverQualification: driverQualificationToString(party.driverQualification),
          license: licenseToString(party.license),
          drunkDriving: drunkDrivingToString(party.drunkDriving),
          crashAreaMain: crashAreaToString(party.crashArea?.[0]),
          crashAreaSub: crashAreaToString(party.crashArea?.[1]),
          cause: causeToString(party.cause),
          isHitAndRun: isHitAndRunToString(party.isHitAndRun),
          job: jobToString(party.job),
          travelPurpose: travelPurposeToString(party.travelPurpose),
          citizenship: citizenshipToString(party.citizenship),
        };
      });
      return transmformedCase;
    });

    if (combine) {
      if (partyNumber > maxPartyCount) {
        throw new Error(`The number of parties must be less than ${maxPartyCount}`);
      }
      const fileStream: fs.WriteStream = fs.createWriteStream(filename);

      const flattenStream = transform((curCase: StringifiedCase) => {
        const flattenCase: FlatStringifiedCase = curCase;
        curCase.parties.forEach((party: StringifiedParty) => {
          const { order } = party;
          Object.assign(
            flattenCase,
            Object.fromEntries(
              Object.entries(party).map((key, value) => [`${key}Party${order}`, value]),
            ),
          );
        });
      });

      const toCSVStream = stringify({
        header: true,
        bom: true,
        columns: [
          { key: 'id', header: '案件編號' },
          { key: 'date', header: '時間' },
          { key: 'location', header: '地點' },
          { key: 'firstAdministrativeLevel', header: '縣市' },
          { key: 'secondAdministrativeLevel', header: '鄉鎮市區' },
          { key: 'severity', header: '等級' },
          { key: 'gps', header: 'GPS' },
          { key: 'deathIn24Hours', header: '24小時內死亡人數' },
          { key: 'deathIn30Days', header: '2-30日死亡人數' },
          { key: 'injury', header: '受傷人數' },
          { key: 'weather', header: '天候' },
          { key: 'light', header: '光線' },
          { key: 'roadHierarchy', header: '道路類別' },
          { key: 'speedLimit', header: '速限' },
          { key: 'roadGeometry', header: '道路型態' },
          { key: 'position', header: '事故位置' },
          { key: 'roadMaterial', header: '路面鋪裝' },
          { key: 'roadSurfaceWet', header: '路面狀態' },
          { key: 'roadSurfaceDefect', header: '路面缺陷' },
          { key: 'obstacle', header: '障礙物' },
          { key: 'sightDistance', header: '視距' },
          { key: 'trafficSignal', header: '號誌種類' },
          { key: 'trafficSignalStatus', header: '號誌動作' },
          { key: 'directionDivider', header: '車道劃分設施及分向設施' },
          { key: 'normalLaneDivider', header: '快車道或一般車道間' },
          { key: 'fastSlowLaneDivider', header: '快慢車道間' },
          { key: 'edgeLine', header: '路面邊線' },
          { key: 'crashType', header: '事故類型及型態' },
        ].concat(
          ...Array(partyNumber)
            .fill(0)
            .map((_, index: number) => {
              const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
              const order = index + 1;
              const chineseOrder = `當事人${chineseNumbers[index]}`;
              return [
                { key: `idParty${order}`, header: `${chineseOrder}-當事人編號` },
                { key: `orderParty${order}`, header: `${chineseOrder}-當事人序` },
                { key: `vehicleParty${order}`, header: `${chineseOrder}-當事者區分` },
                { key: `genderParty${order}`, header: `${chineseOrder}-性別` },
                { key: `ageParty${order}`, header: `${chineseOrder}-年齡` },
                { key: `injurySeverityParty${order}`, header: `${chineseOrder}-受傷程度` },
                { key: `injuriedAreaParty${order}`, header: `${chineseOrder}-主要傷處` },
                { key: `saftyDeviceParty${order}`, header: `${chineseOrder}-保護裝備` },
                {
                  key: `smartPhoneParty${order}`,
                  header: `${chineseOrder}-行動電話或電腦或其他相類功能裝置`,
                },
                { key: `vehicleUsageParty${order}`, header: `${chineseOrder}-車輛用途` },
                { key: `actionParty${order}`, header: `${chineseOrder}-當事者行動狀態` },
                { key: `driverQualificationParty${order}`, header: `${chineseOrder}-駕駛資格情形` },
                { key: `licenseParty${order}`, header: `${chineseOrder}-駕駛執照種類` },
                { key: `drunkDrivingParty${order}`, header: `${chineseOrder}-飲酒情形` },
                { key: `crashAreaMainParty${order}`, header: `${chineseOrder}-主要車輛撞擊部位` },
                { key: `crashAreaSubParty${order}`, header: `${chineseOrder}-次要車輛撞擊部位` },
                { key: `causeParty${order}`, header: `${chineseOrder}-肇事因素` },
                { key: `isHitAndRunParty${order}`, header: `${chineseOrder}-肇事逃逸` },
                { key: `jobParty${order}`, header: `${chineseOrder}-職業` },
                { key: `travelPurposeParty${order}`, header: `${chineseOrder}-旅次目的` },
                { key: `citizenshipParty${order}`, header: `${chineseOrder}-國籍` },
              ];
            }),
        ),
      });

      toStringStream.pipe(flattenStream).pipe(toCSVStream).pipe(fileStream);
    } else {
      const partyFilename = filename.lastIndexOf('.') === -1
        ? `${filename}-parties.csv`
        : `${filename.substring(0, filename.lastIndexOf('.'))}-parties.csv`;
      const caseFileStream: fs.WriteStream = fs.createWriteStream(filename);
      const partyFileStream: fs.WriteStream = fs.createWriteStream(partyFilename);

      const caseStringifyStream = stringify({
        header: true,
        bom: true,
        columns: [
          { key: 'id', header: '案件編號' },
          { key: 'date', header: '時間' },
          { key: 'location', header: '地點' },
          { key: 'firstAdministrativeLevel', header: '縣市' },
          { key: 'secondAdministrativeLevel', header: '鄉鎮市區' },
          { key: 'severity', header: '等級' },
          { key: 'gps', header: 'GPS' },
          { key: 'deathIn24Hours', header: '24小時內死亡人數' },
          { key: 'deathIn30Days', header: '2-30日死亡人數' },
          { key: 'injury', header: '受傷人數' },
          { key: 'weather', header: '天候' },
          { key: 'light', header: '光線' },
          { key: 'roadHierarchy', header: '道路類別' },
          { key: 'speedLimit', header: '速限' },
          { key: 'roadGeometry', header: '道路型態' },
          { key: 'position', header: '事故位置' },
          { key: 'roadMaterial', header: '路面鋪裝' },
          { key: 'roadSurfaceWet', header: '路面狀態' },
          { key: 'roadSurfaceDefect', header: '路面缺陷' },
          { key: 'obstacle', header: '障礙物' },
          { key: 'sightDistance', header: '視距' },
          { key: 'trafficSignal', header: '號誌種類' },
          { key: 'trafficSignalStatus', header: '號誌動作' },
          { key: 'directionDivider', header: '車道劃分設施及分向設施' },
          { key: 'normalLaneDivider', header: '快車道或一般車道間' },
          { key: 'fastSlowLaneDivider', header: '快慢車道間' },
          { key: 'edgeLine', header: '路面邊線' },
          { key: 'crashType', header: '事故類型及型態' },
        ],
      });

      const partyStream = stringify({
        header: true,
        bom: true,
        columns: [
          { key: 'id', header: '當事人編號' },
          { key: 'caseId', header: '案件編號' },
          { key: 'order', header: '當事人序' },
          { key: 'vehicle', header: '當事者區分' },
          { key: 'gender', header: '性別' },
          { key: 'age', header: '年齡' },
          { key: 'injurySeverity', header: '受傷程度' },
          { key: 'injuriedArea', header: '主要傷處' },
          { key: 'saftyDevice', header: '保護裝備' },
          { key: 'smartPhone', header: '行動電話或電腦或其他相類功能裝置' },
          { key: 'vehicleUsage', header: '車輛用途' },
          { key: 'action', header: '當事者行動狀態' },
          { key: 'driverQualification', header: '駕駛資格情形' },
          { key: 'license', header: '駕駛執照種類' },
          { key: 'drunkDriving', header: '飲酒情形' },
          { key: 'crashAreaMain', header: '主要車輛撞擊部位' },
          { key: 'crashAreaSub', header: '次要車輛撞擊部位' },
          { key: 'cause', header: '肇事因素' },
          { key: 'isHitAndRun', header: '肇事逃逸' },
          { key: 'job', header: '職業' },
          { key: 'travelPurpose', header: '旅次目的' },
          { key: 'citizenship', header: '國籍' },
        ],
      });

      toStringStream
        .on('data', (stringifiedCase: StringifiedCase) => {
          stringifiedCase.parties.forEach((party: StringifiedParty) => {
            partyStream.write({ ...party, caseId: stringifiedCase.id });
          });
        })
        .pipe(caseStringifyStream)
        .pipe(caseFileStream);
      partyStream.pipe(partyFileStream);
    }
    // TODO: do we need to close the file stream?
  }
}
