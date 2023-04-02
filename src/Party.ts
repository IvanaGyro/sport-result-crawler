import { autoImplements } from './utilities';
import Vehicle, { VehicleUsage } from './Vehicle';

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  NOTHING_OR_STUFF = 3,
  HIT_AND_RUN = 4,
}

export enum InjurySeverity {
  DEATH = 1,
  INJURY = 2,
  NO_INJURY = 3,
  UNKNOWN = 4,
  DEATH_IN_30_DAYS = 5,
}

export enum InjuriedArea {
  HEAD = 1,
  NECK = 2,
  CHEST = 3,
  ABDOMEN = 4,
  WAIST = 5,
  BACK = 6,
  HAND = 7,
  LEG = 8,
  MULTIPLE = 9,
  NONE = 10,
  UNKNOWN = 11,
}

export enum SaftyDevice {
  USE_SAFETY_DEVICE = 1,
  NO_SAFETY_DEVICE = 2,
  UNKNOWN = 3,
  OTHER = 4,
}

export enum Smartphone {
  NOT_USE = 1,
  HANDHELD = 2,
  HADNS_FREE = 3,
  UNKNOWN = 4,
  NOT_DRIVER = 5,
}

export enum Action {
  PULLING_OUT = 1,
  REVERSING = 2,
  DOING_PARKING = 3,
  OVER_TAKING = 4,
  TURNING_LEFT = 5,
  TURNING_RIGHT = 6,
  CHANGING_TO_LEFT_LANE = 7,
  CHANGING_TO_RIGHT_LANE = 8,
  FORWARD = 9,
  INSERTING_INTO_LINE = 10,
  U_TRUNING_OR_CROSSING = 11,
  SUDDEN_STOP = 12,
  PARKING = 13,
  STOPING_OR_WAITING = 14,
  OTHER_VEHICLE_ACTION = 15,
  WALKING = 16,
  STANDING = 17,
  RUNNING = 18,
  GETTING_ON_OR_OFF = 19,
  OTEHR_PEOPLE_ACTION = 20,
  UNKNOWN = 21,
}

export enum DriverQualification {
  HAVE_LICENSE = 1,
  NO_LICENSE_UNDER_AGE = 2,
  NO_LICENSE_OVER_AGE = 3,
  DRIVE_OVER_LEVEL = 4,
  SUSPENDED = 5,
  REVOKED = 6,
  UNKNOWN = 7,
  NOT_DRIVER = 8,
}

export enum License {
  BUSINESS_TRAILER = 1,
  BUSINESS_BUS = 2,
  BUSINESS_HEAVY_TRUCK = 3,
  BUSINESS_CAR = 4,
  NORMAL_TRAILER = 5,
  NORMAL_BUS = 6,
  NORMAL_HEAVY_TRUCK = 7,
  NORMAL_CAR = 8,
  MOTORCYCLE_250_UP = 9,
  MOTORCYCLE_50_TO_249 = 10,
  MOTORCYCLE_49_UNDER = 11,
  MILITARY_BUS = 12,
  MILITARY_HEAVY_TRUCK = 13,
  MILITARY_CAR = 14,
  INTERNATIONAL_LICENSE = 15,
  OTHER_LICENSE = 16,
  LEARNING_LICENSE = 17,
  NO_LICENSE = 18,
  UNKNOWN = 19,
  NOT_DRIVER = 20,
}

export enum DrunkDriving {
  LOOK_NOT_DRUNK = 1,
  NO_ALCOHOL_REACTION_DETECTED = 2,
  LESS_EQUAL_THAN_15 = 3, // less equaal than 0.15 mg/L
  BETWEEN_16_AND_25 = 4, // between 0.16 and 0.25 mg/L
  BETWEEN_26_AND_40 = 5, // between 0.26 and 0.40 mg/L
  BETWEEN_41_AND_55 = 6, // between 0.41 and 0.55 mg/L
  BETWEEN_56_AND_80 = 7, // between 0.56 and 0.80 mg/L
  GREATER_THAN_80 = 8, // greater than 0.80 mg/L
  CANNOT_TEST = 9,
  NOT_DRIVER_OR_NOT_TESTED = 10,
  UNKNOWN = 11,
}

export enum CrashArea {
  CAR_FRONT = 1,
  CAR_RIGHT = 2,
  CAR_REAR = 3,
  CAR_LEFT = 4,
  CAR_RIGHT_FRONT = 5,
  CAR_RIGHT_REAR = 6,
  CAR_LEFT_REAR = 7,
  CAR_LEFT_FRONT = 8,
  CAR_TOP = 9,
  CAR_UNDERCARRIAGE = 10,
  MOTORCYCLE_FRONT = 11,
  MOTORCYCLE_RIGHT = 12,
  MOTORCYCLE_REAR = 13,
  MOTORCYCLE_LEFT = 14,
  UNKNOWN = 15,
  NOT_VEHICLE = 16,
}

export enum Cause {
  ILLEGALLY_OVER_TAKING = 1,
  SCRAMBLE_TO_DRIVE_IN_A_LANE = 2,
  WEAVE_ON_ROAD = 3,
  OPPOSITE_DIRECTION = 4,
  NOT_DRIVE_ON_RIGHT_SIDE = 5,
  NOT_GIVE_WAY = 6,
  BADLY_CHANGE_LANE = 7,
  ILLEGALLY_LEFT_TURN = 8,
  ILLEGALLY_RIGHT_TURN = 9,
  ILLEGALLY_U_TRUN = 10,
  BADLY_CROSS_ROAD = 11,
  ILLEGALLY_REVERSE = 12,
  OVERSPEED = 13,
  NOT_SLOW_DOWN = 14,
  SCRAMBLE_TO_CROSS_CROSSWALK = 15,
  NOT_KEEP_DISTANCE = 16,
  NOT_KEEP_INTERVAL = 17,
  NOT_NOTICE_OTHERS_WHILE_PARKING = 18,
  NOT_NOTICE_OTHERS_WHILE_PULLING_OFF = 19,
  DRUG_DRIVING = 20,
  DRUNK_DRIVING = 21,
  DROWSY_DRIVING = 22,
  NOT_NOTICE_FRONT = 23,
  SCRAMBLE_TO_CROSS_CROSSING_LEVEL = 24,
  VIOLATE_SIGNAL = 25,
  VIOLATE_SIGN = 26,
  ILLEGALLY_USE_LIGHT = 27,
  PARK_IN_DARK_WITHOUT_LIGHT = 28,
  DRIVE_AT_NIGHT_WITHOUT_LIGHT = 29,
  GOODS_NOT_RESTRAINED = 30,
  OVERLOADED = 31,
  CARRY_EXCESS_PASSENGER = 32,
  OVERSIZE_LOAD = 33,
  BADLY_LOAD = 34,
  UNSAFELY_LOAD = 35,
  DRIVE_WHILE_PASSENGER_GET_ON_OFF = 36,
  OTHER_BADLY_LOAD_OR_CARRY = 37,
  ILLEGALLY_PARK_OR_STOP = 38,
  BROKEN_DOWN_WITHOUT_SAFTY_ACTION = 39,
  BADLY_OPEN_DOOR = 40,
  USE_HANDHELD_PHONE = 41,
  OTEHR_ILLEGALY_ACT = 42,
  UNKNOWN = 43,
  NONE_FOR_DRIVER = 44,
  BRAKE_FAILURE = 45,
  STEERING_WHEEL_FAILURE = 46,
  LIGHT_FAILURE = 47,
  BROKEN_TIRES = 48,
  VEHICLE_PART_FALL_OFF = 49,
  OTHER_VEHICLE_FAILURE = 50,
  NOT_WALK_ON_CROSSWALK = 51,
  CROSS_WITHOUT_FOLLOWING_SIGN = 52,
  NOT_SEE_COMING_VEHICLES = 53,
  PLAY_ON_ROAD = 54,
  GET_ON_OFF_BEORE_STOPPING = 55,
  GET_ON_OFF_WITHOUT_ATTENTION = 56,
  PUT_HEAD_HAND_OUTSIDE_VEHICLE = 57,
  BADLY_SIT = 58,
  WORK_WITHOUT_SIGN = 59,
  OTHER_FOR_NON_DRIVER = 60,
  DANGEROUS_ROAD = 61,
  SIGNAL_FAILURE = 62,
  BADLY_DIRECT_TRAFFIC = 63,
  LEVEL_CROSSING_FAILURE = 64,
  OTHER_BAD_MANAGEMENT = 65,
  ANIMAL_RUSH_OUT = 66,
  NONE_FOR_NON_DRIVER = 67,
}

// Refer to https://www.stat.gov.tw/public/data/dgbas03/bs1/中華民國職業標準分類/第6版分類系統中英對照.xls
export enum Job {
  ADMINISTRATOR = 1,
  PROFESSIONAL = 2,
  TECHNICLE = 3,
  CLERICAL_SUPPORT = 4,
  SERVICE = 5,
  SALES = 6,
  FARMER_OR_FISHER = 7,
  SECURITY = 8,
  CRAFT = 9,
  PROFESSIONAL_DRIVER = 10,
  MACHINE_OPERATOR = 11,
  ELEMENTARY_LABOURER = 12,
  UNDER_SCHOOL_AGE = 13,
  ELEMENTARY_SCHOOL = 14,
  JUNIOR_HIGH_SCHOOL = 15,
  SENIOR_HIGH_SCHOOL = 16,
  JUNIOR_COLLEDGE = 17,
  UNIVERSITY = 18,
  HOUSEWORKER = 19,
  JOBLESS = 20,
  OTHER = 21,
  UNKNOWN = 22,
  POLICE = 23,
}

export enum TravelPurpose {
  WORK = 1,
  SCHOOL = 2,
  BUSINESS = 3,
  TRANSPORT = 4,
  COMMUTATION = 5,
  TARVEL = 6,
  SHOPPING = 7,
  OTHER = 8,
  UNKNOWN = 9,
}

export enum Citizenship {
  CITIZEN = 1,
  NON_CITIZEN = 2,
}

interface PartyParameters {
    id: string;
    order: number;
    vehicle: Vehicle;
    gender?: Gender;
    age?: number;
    injurySeverity?: InjurySeverity;
    injuriedArea?: InjuriedArea;
    saftyDevice?: SaftyDevice;
    smartPhone?: Smartphone;
    vehicleUsage?: VehicleUsage;
    action?: Action;
    driverQualification?: DriverQualification;
    license?: License;
    drunkDriving?: DrunkDriving;
    crashArea?: [CrashArea] | [CrashArea, CrashArea];
    cause?: Cause;
    isHitAndRun?: boolean;
    job?: Job;
    travelPurpose?: TravelPurpose;
    citizenship?: Citizenship;
  }

export default class Party extends autoImplements<PartyParameters>() {}
