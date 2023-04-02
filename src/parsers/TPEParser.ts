import luxon from 'luxon';
import shortUUID from 'short-uuid';

import BaseParser from './BaseParser';
import Case, { Severity } from '../Case';
import Party from '../Party';
import Vehicle from '../Vehicle';

// eslint-disable-next-line no-use-before-define
function assignIfExists<T extends { [P in K]?: number | number[] }, K extends keyof T>(
  target: T,
  key: K,
  value: string,
) {
  let cleanValue: number;
  // Some values in hackthon data end with '`'.
  if (value.endsWith('`')) {
    cleanValue = Number(value.slice(0, -1));
  } else {
    // '', '0', and '00' will be converted to 0.
    cleanValue = Number(value);
  }
  if (cleanValue !== 0) {
    const valueRef: number | number[] | undefined = target[key];
    if (valueRef !== undefined && valueRef instanceof Array) {
      valueRef.push(cleanValue);
    } else {
      const targetRef: { [P in K]?: number | number[] } = target;
      targetRef[key] = cleanValue;
    }
  }
}

function isEmpty(value: string): boolean {
  return value === '' || value === '0';
}

function toChineseNumber(value: string): string {
  return ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][Number(value)];
}

function composeAddress(
  firstAdministrativeLevel: string,
  secondAdministrativeLevel: string,
  road: string,
  section: string,
  lane: string,
  alley: string,
  number: string,
) {
  const sectionPart = isEmpty(section) ? '' : `${toChineseNumber(section)}段`;
  const lanePart = isEmpty(lane) ? '' : `${lane}巷`;
  const alleyPart = isEmpty(alley) ? '' : `${lane}弄`;
  const numberPart = isEmpty(number) ? '' : `${lane}號`;
  return `${firstAdministrativeLevel}${secondAdministrativeLevel}${road}${sectionPart}${lanePart}${alleyPart}${numberPart}`;
}

export default class TPEParser extends BaseParser {
  public constructor(protected filePath_: string) {
    super(filePath_);
  }

  public async parse(verify: boolean = false): Promise<Case[]> {
    this.verify = verify;
    this.cases = [];
    this.caseMapping = {};
    const outStream = this.csvParser.on('headers', (headers: string[]) => {
      if (headers.includes('肇因研判O')) {
        outStream.on('data', this.parseHackathon.bind(this));
      } else {
        throw Error(`Unsupported CSV format: ${this.filePath}`);
      }
    });
    await this.startStream();
    return this.cases;
  }

  /**
   * Parse the data from hackathon.
   *
   * The whole dataset includes the data from 2016 to 2020. Some fields appear later then 2016:
   *  field         | year starting to appear
   *  ---           | ---
   *  汽車駕籍地縣市  | 2017
   *  機車駕籍地縣市  | 2017
   *  戶籍地         | 2018
   *  Delivery_Type | 2019
   *
   * @param data object of the row
   */
  private parseHackathon(data: { [key: string]: string }) {
    const errorPrefix = `${this.filePath}:${this.curLine}`;
    if (Object.keys(data).length === 0) {
      console.error(`${errorPrefix} empty row`);
      return;
    }
    this.rowNumber += 1;

    // TODO: wierd value of 當事人序
    // "52": year:2018 row:76499
    // "133": year:2016 row:171004
    // "212": year:2016 row:45845
    // "281": year:2018 row:97240
    // "312": year:2019 row:46576
    const party = new Party({
      id: shortUUID.generate(),
      order: Number(data['當事人序']),
      vehicle: Vehicle.codeToVehicleMapping[data['車種']],
    });

    // If the field can not be empty, the value will not be assigned by `assignIfExists()` to
    // apply value check in runtime.
    assignIfExists(party, 'gender', data['性別']);
    assignIfExists(party, 'age', data['年齡']);
    assignIfExists(party, 'injurySeverity', data['22受傷程度']);
    assignIfExists(party, 'injuriedArea', data['23主要傷處']);
    assignIfExists(party, 'saftyDevice', data['24安全帽']);
    assignIfExists(party, 'smartPhone', data['25行動電話']);
    assignIfExists(party, 'vehicleUsage', data['28車輛用途']);
    assignIfExists(party, 'action', data['29當事者行動狀態']);
    assignIfExists(party, 'driverQualification', data['30駕駛資格情形']);
    // TODO: figure out the real value of license when the value is '19*' or '118'.
    // 19*: year:2017 row:169759
    // 118: year:2019 row:184042
    const license = data['31駕駛執照種類'];
    if (license === '19*') {
      party.license = 19;
    } else if (license !== '118') {
      assignIfExists(party, 'license', license);
    }
    // TODO: correct wierd values
    // "111": year:2020 row:130063
    const drunkDriving = data['32飲酒情形'];
    if (drunkDriving !== '111') {
      assignIfExists(party, 'drunkDriving', drunkDriving);
    }
    assignIfExists(party, 'crashArea', data['33_1主要車損']);
    // TODO: correct wierd values
    // "無": year:2017 row:52039
    // "右右": year:2018 row:19908
    // "左": year:2018 row:115463
    // "如": year:2020 row:196922
    // "手把": year:2020 row:203317
    // "捆捆": year:2020 row:209601
    const secondCrashArea = data['33_2其他車損'];
    if (!['無', '右右', '左', '如', '手把', '捆捆'].includes(secondCrashArea)) {
      assignIfExists(party, 'crashArea', secondCrashArea);
    }
    // TODO: correct wierd values
    // "A1": year:2018 row:61226
    const cause = data['肇因碼-個別'];
    if (cause !== 'A1') {
      assignIfExists(party, 'cause', data['肇因碼-個別']);
    }
    // This seems an expected bahavor of the data...
    // if (this.verify && party.order === 1 && cause !== data['肇因碼-主要']) {
    //   throw new Error(`${errorPrefix} The main cause is not consistent with the first party's cause.`);
    // }
    // TODO: correct wierd values
    // "4": year:2017 row:28374
    // "12": year:2016 row:153206
    const isHitAndRun = data['35個人肇逃否'];
    // 1: not hit and run
    // 2: hit and run
    if (!['4', '12'].includes(isHitAndRun)) {
      party.isHitAndRun = isHitAndRun === '2';
    }
    assignIfExists(party, 'job', data['36職業']);
    assignIfExists(party, 'travelPurpose', data['37旅次目的']);
    const citizenship = data['國籍'];
    if (citizenship != null && citizenship !== '') {
      party.citizenship = Number(citizenship) + 1;
    }

    // The data may not arrange in the order of the parties in one case, so we compare the case ID
    // provided in the dataset to identify the same case.
    if (this.verify && data['案號'] !== data['件數']) {
      throw new Error(`${errorPrefix} The original case ID is not consistent: ${data['案號']} and ${data['件數']}`);
    }
    // This dataset may not put the parties in the same case together.
    const existingCase = this.caseMapping[data['案號']];
    if (existingCase != null) {
      existingCase.parties.push(party);
      return;
    }

    const firstLocation = composeAddress(
      data.OccurAddr1_1,
      data.OccurAddr1_2,
      data['路段一'],
      data['路段一段'],
      data['巷'],
      data['弄'],
      data['號'],
    );
    if (this.verify) {
      // data.OccurAddr1_2 is the district in address and data['區'] is the district of the police
      // station who deal with the case.
      // if (data.OccurAddr1_2 !== data['區']) {
      //   throw new Error(
      //     `${errorPrefix} Distruct is not consistent: "${data.OccurAddr1_2}" and "${data['區']}"`,
      //   );
      // }
      // When data['號'] is "15-1" data['OccurAddr1_9_1(號)'] will be "15"
      // Sometimes data['OccurAddr1_9_1(號)'] holds a detail location of the case. E.g.台北橋機車道
      // if (!data['號'].startsWith(data['OccurAddr1_9_1(號)'])) {
      //   throw new Error(
      //     `${errorPrefix} Address number is not consistent: "${data['號']}" and "${data['OccurAddr1_9_1(號)']}"`,
      //   );
      // }
      if (!data['路段'].startsWith(data['路段一'])) {
        throw new Error(
          `${errorPrefix} First road address is not consistent: "${data['路段一']}" and "${data['路段']}"`,
        );
      }
      if (data['路段2'] !== '段' && !data['路段2'].startsWith(data['路段二'])) {
        throw new Error(
          `${errorPrefix} Second road address is not consistent: "${data['路段二']}" and "${data['路段2']}"`,
        );
      }
    }
    const secondLocation = composeAddress(
      data.OccurAddr1_1,
      data.OccurAddr1_2,
      data['路段二'],
      data['路段二段'],
      data['巷(岔路)'],
      data['弄(岔路)'],
      data['號(岔路)'],
    );
    const deathIn24Hours = Number(data['死亡人數']);
    const deathIn30Days = Number(data['2-30日死亡人數']);
    const injury = Number(data['受傷人數']);
    let severity: Severity;
    switch (data['處理別']) {
      case '1':
        severity = Severity.DEATH_IN_24_HOURS;
        break;
      case '2':
        if (deathIn30Days > 0) {
          severity = Severity.DEATH_BETWEEN_2_TO_30_DAYS;
        } else {
          severity = Severity.INJURY_ONLY;
        }
        break;
      case '3':
        severity = Severity.ONLY_PROPERTY_DAMAGE;
        break;
      case '4':
        severity = Severity.SELF_SETTLEMENT;
        break;
      default:
        throw new Error('Should not reach here');
    }
    let secondAdministrativeLevel = data.OccurAddr1_2;
    // Only allow secondAdministrativeLevel be empty when the severity is Severity.SELF_SETTLEMENT
    if (this.verify && severity !== Severity.SELF_SETTLEMENT && secondAdministrativeLevel === '') {
      throw new Error(`${errorPrefix} Second administrative level is empty.`);
    }
    secondAdministrativeLevel = secondAdministrativeLevel === '' ? '未知區' : secondAdministrativeLevel;

    const currentCase = new Case({
      id: shortUUID.generate(),
      date: luxon.DateTime.fromFormat(data['發生時間'], 'yyyy-MM-dd HH:mm:ss.SSS', {
        zone: 'Asia/Taipei',
      }),
      location: secondLocation === '' ? `${firstLocation}/${secondLocation}` : firstLocation,
      // TODO: There are 7 cases which data.OccurAddr1_1 is "02"
      firstAdministrativeLevel: data.OccurAddr1_1,
      secondAdministrativeLevel,
      severity,
      parties: [],
    });

    currentCase.deathIn24Hours = deathIn24Hours;
    currentCase.deathIn30Days = deathIn30Days;
    currentCase.injury = injury;
    // TODO: correct wierd values
    // "-1": year:2016 row:160383
    const weather = data['4天候'];
    if (weather !== '-1') {
      assignIfExists(currentCase, 'weather', weather);
    }
    assignIfExists(currentCase, 'light', data['5光線']);
    assignIfExists(currentCase, 'roadHierarchy', data['6道路類別']);
    // TODO: correct wierd values
    // "100": {
    //   "filename": "data/tpe/hackathon/105-A1_A4.csv",
    //   "line": 51266
    // },
    // "300": {
    //   "filename": "data/tpe/hackathon/108-A1_A4.csv",
    //   "line": 57725
    // },
    // "401": {
    //   "filename": "data/tpe/hackathon/108-A1_A4.csv",
    //   "line": 135458
    // },
    // "440": {
    //   "filename": "data/tpe/hackathon/106-A1_A4.csv",
    //   "line": 88045
    // },
    // "500": {
    //   "filename": "data/tpe/hackathon/107-A1_A4.csv",
    //   "line": 38880
    // },
    // "501": {
    //   "filename": "data/tpe/hackathon/105-A1_A4.csv",
    //   "line": 161575
    // },
    // "502": {
    //   "filename": "data/tpe/hackathon/105-A1_A4.csv",
    //   "line": 125193
    // },
    // "504": {
    //   "filename": "data/tpe/hackathon/108-A1_A4.csv",
    //   "line": 47285
    // },
    // "505": {
    //   "filename": "data/tpe/hackathon/108-A1_A4.csv",
    //   "line": 103068
    // },
    // "510": {
    //   "filename": "data/tpe/hackathon/108-A1_A4.csv",
    //   "line": 58614
    // },
    // "550": {
    //   "filename": "data/tpe/hackathon/106-A1_A4.csv",
    //   "line": 32021
    // },
    // "555": {
    //   "filename": "data/tpe/hackathon/107-A1_A4.csv",
    //   "line": 80477
    // },
    // "580": {
    //   "filename": "data/tpe/hackathon/106-A1_A4.csv",
    //   "line": 43794
    // },
    // "701": {
    //   "filename": "data/tpe/hackathon/107-A1_A4.csv",
    //   "line": 9640
    // },
    // "707": {
    //   "filename": "data/tpe/hackathon/108-A1_A4.csv",
    //   "line": 62507
    // },
    // "801": {
    //   "filename": "data/tpe/hackathon/106-A1_A4.csv",
    //   "line": 36445
    // },
    assignIfExists(currentCase, 'speedLimit', data['7速限']);
    assignIfExists(currentCase, 'roadGeometry', data['8道路型態']);
    assignIfExists(currentCase, 'position', data['9事故位置']);
    assignIfExists(currentCase, 'roadMaterial', data['10路面狀況1']);
    assignIfExists(currentCase, 'roadSurfaceWet', data['10路面狀況2']);
    assignIfExists(currentCase, 'roadSurfaceDefect', data['10路面狀況3']);
    assignIfExists(currentCase, 'obstacle', data['11道路障礙1']);
    assignIfExists(currentCase, 'sightDistance', data['11道路障礙2']);
    assignIfExists(currentCase, 'trafficSignal', data['12號誌1']);
    assignIfExists(currentCase, 'trafficSignalStatus', data['12號誌2']);
    assignIfExists(currentCase, 'directionDivider', data['13車道劃分-分向']);
    assignIfExists(currentCase, 'normalLaneDivider', data['14車道劃分-分道1']);
    assignIfExists(currentCase, 'fastSlowLaneDivider', data['14車道劃分-分道2']);
    assignIfExists(currentCase, 'edgeLine', data['14車道劃分-分道3']);
    assignIfExists(currentCase, 'crashType', data['15事故類型及型態']);

    currentCase.parties.push(party);
    this.cases.push(currentCase);
    this.caseMapping[data['案號']] = currentCase;
  }

  private cases: Case[] = [];

  private caseMapping: { [key: string]: Case } = {};

  private rowNumber = 1;

  private verify: boolean = false;
}
