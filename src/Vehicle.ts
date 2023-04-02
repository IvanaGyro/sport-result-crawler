export enum VehicleCategory {
  BUS = '大客車',
  HEAVY_TRUCK = '大貨車',
  CAR = '小客車',
  PICKUP_TRUCK = '小貨車',
  MOTORCYCLE = '機車',
  BICYCLE = '自行車',
  PEDESTRIAN = '行人',
  OTHER_VEHICLE = '其他車',
  OTHER_PEOPLE = '其他人',
  OTHER = '其他',
}

export default class Vehicle {
  static readonly PUBLIC_CITY_BUS = new Vehicle('A01', VehicleCategory.BUS);

  static readonly PRIVATE_CITY_BUS = new Vehicle('A02', VehicleCategory.BUS);

  static readonly PUBLIC_HIGHWAY_BUS = new Vehicle('A03', VehicleCategory.BUS);

  static readonly PRIVATE_HIGHWAY_BUS = new Vehicle('A04', VehicleCategory.BUS);

  static readonly TOUR_BUS = new Vehicle('A05', VehicleCategory.BUS);

  static readonly PERSONAL_BUS = new Vehicle('A06', VehicleCategory.BUS);

  static readonly BUSINESS_HEAVY_TRUCK = new Vehicle('A11', VehicleCategory.HEAVY_TRUCK);

  static readonly PERSONAL_HEAVY_TRUCK = new Vehicle('A12', VehicleCategory.HEAVY_TRUCK);

  static readonly BUSINESS_FULL_TRAILER = new Vehicle('A21', VehicleCategory.HEAVY_TRUCK);

  static readonly PERSONAL_FULL_TRAILER = new Vehicle('A22', VehicleCategory.HEAVY_TRUCK);

  static readonly BUSINESS_SEMI_TRAILER = new Vehicle('A31', VehicleCategory.HEAVY_TRUCK);

  static readonly PERSONAL_SEMI_TRAILER = new Vehicle('A32', VehicleCategory.HEAVY_TRUCK);

  static readonly BUSINESS_TRACTOR = new Vehicle('A41', VehicleCategory.HEAVY_TRUCK);

  static readonly PERSONAL_TRACTOR = new Vehicle('A42', VehicleCategory.HEAVY_TRUCK);

  static readonly TAXI = new Vehicle('B01', VehicleCategory.CAR);

  static readonly RENTAL_CAR = new Vehicle('B02', VehicleCategory.CAR);

  static readonly PERSONAL_CAR = new Vehicle('B03', VehicleCategory.CAR);

  static readonly BUSINESS_PICKUP_TRUCK = new Vehicle('B11', VehicleCategory.PICKUP_TRUCK);

  static readonly PERSONAL_PICKUP_TRUCK = new Vehicle('B12', VehicleCategory.PICKUP_TRUCK);

  static readonly MOTORCYCLE_550_UP = new Vehicle('C01', VehicleCategory.MOTORCYCLE);

  static readonly MOTORCYCLE_250_TO_549 = new Vehicle('C02', VehicleCategory.MOTORCYCLE);

  static readonly MOTORCYCLE_50_TO_249 = new Vehicle('C03', VehicleCategory.MOTORCYCLE);

  static readonly MOTORCYCLE_49_UNDER = new Vehicle('C04', VehicleCategory.MOTORCYCLE);

  static readonly MOTORCYCLE_45_KPH_UNDER = new Vehicle('C05', VehicleCategory.MOTORCYCLE);

  static readonly MILITARY_BUS = new Vehicle('D01', VehicleCategory.OTHER_VEHICLE);

  static readonly MILITARY_HEAVY_TRUCK = new Vehicle('D02', VehicleCategory.OTHER_VEHICLE);

  static readonly MILITARY_CAR = new Vehicle('D03', VehicleCategory.OTHER_VEHICLE);

  static readonly AMBULANCE = new Vehicle('E01', VehicleCategory.OTHER_VEHICLE);

  static readonly FIRE_ENGINE = new Vehicle('E02', VehicleCategory.OTHER_VEHICLE);

  static readonly POLICE_VEHICLE = new Vehicle('E03', VehicleCategory.OTHER_VEHICLE);

  static readonly ENGINEERING_VEHICLE = new Vehicle('E04', VehicleCategory.OTHER_VEHICLE);

  static readonly OTHER_SPECIAL_VEHICLE = new Vehicle('E05', VehicleCategory.OTHER_VEHICLE);

  static readonly BICYCLE = new Vehicle('F01', VehicleCategory.BICYCLE);

  static readonly PEDELEC = new Vehicle('F02', VehicleCategory.BICYCLE);

  static readonly PEDAL_FREE_PEDELEC = new Vehicle('F03', VehicleCategory.BICYCLE);

  static readonly RICKSHAW = new Vehicle('F04', VehicleCategory.OTHER_VEHICLE);

  static readonly ANIMAL_DRAWN_VEHICLE = new Vehicle('F05', VehicleCategory.OTHER_VEHICLE);

  static readonly OTHER_SLOW_VEHICLE = new Vehicle('F06', VehicleCategory.OTHER_VEHICLE);

  static readonly SELF_ASSEMBLED_VEHICLE = new Vehicle('G01', VehicleCategory.OTHER_VEHICLE);

  static readonly AGRICULTURAL_MACHINARY = new Vehicle('G02', VehicleCategory.OTHER_VEHICLE);

  static readonly POWER_MACHINE = new Vehicle('G03', VehicleCategory.OTHER_VEHICLE);

  static readonly TRAILER = new Vehicle('G04', VehicleCategory.OTHER_VEHICLE);

  static readonly TRAIN = new Vehicle('G05', VehicleCategory.OTHER_VEHICLE);

  static readonly OTHER_VEHICLE = new Vehicle('G06', VehicleCategory.OTHER_VEHICLE);

  static readonly PEDESTRIAN = new Vehicle('H01', VehicleCategory.PEDESTRIAN);

  static readonly PASSENGER = new Vehicle('H02', VehicleCategory.OTHER_PEOPLE);

  static readonly OTEHR_PEOPLE = new Vehicle('H03', VehicleCategory.OTHER_PEOPLE);

  static readonly OTHER = new Vehicle('', VehicleCategory.OTHER);

  static readonly codeToVehicleMapping: { [key: string]: Vehicle } = Object.fromEntries(
    Object.values(Vehicle).map((v) => [v.key, v]),
  );

  // private to disallow creating other instances of this type
  private constructor(public readonly key: string, public readonly category: VehicleCategory) {}
}

export enum VehicleUsage {
  GRAVEL_TRACK = 1,
  CHILDREN_USE_VEHICLE = 2,
  SCHOOL_BUS = 3,
  DISABLED_SPECIAL_VEHICLE = 4,
  COACH_VEHICLE = 5,
  LOADING_DANGEROUS_GOODS = 6,
  OTHER = 7,
  NOT_DRIVER = 8,
}
