/* eslint-disable no-restricted-syntax */
import luxon from 'luxon';
import shortUUID from 'short-uuid';

import BaseParser from './BaseParser';
import Case, { Severity } from '../Case';
import Party from '../Party';
import Vehicle from '../Vehicle';

function isNumber(value: string): boolean {
  return !Number.isNaN(value);
}

function isChineseNumberOrNumber(value: string): boolean {
  return (
    ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'].includes(value) || isNumber(value)
  );
}

function normalizeMetersBefore(value: string): string {
  if (['NA', '0'].includes(value)) {
    return ' ';
  }
  return value;
}

function buildValidator(fail: () => void) {
  const required = (
    msg: string,
    value: string,
    format: (value: string) => boolean = () => true,
  ): void => {
    if (!value.trim() || !format(value)) {
      console.error(msg);
      fail();
    }
  };
  const optional = (
    msg: string,
    value: string,
    format: (value: string) => boolean = () => true,
  ): void => {
    if (value.trim() && !format(value)) {
      console.error(msg, value, format);
      fail();
    }
  };
  const empty = (msg: string, value: string): void => {
    if (value.trim()) {
      console.error(msg);
      fail();
    }
  };
  return [required, optional, empty];
}

// eslint-disable-next-line no-use-before-define
function assignIfExists<T extends { [P in K]?: number | number[] }, K extends keyof T>(
  target: T,
  key: K,
  value: string,
) {
  if (!['', 'NA'].includes(value)) {
    const valueRef: number | number[] | undefined = target[key];
    if (valueRef !== undefined && valueRef instanceof Array) {
      valueRef.push(Number(value));
    } else {
      const targetRef: { [P in K]?: number | number[] } = target;
      targetRef[key] = Number(value);
    }
  }
}

export default class TYCParser extends BaseParser {
  public constructor(protected filePath_: string) {
    super(filePath_);
  }

  public async parse(verify: boolean = false): Promise<Case[]> {
    this.verify = verify;
    const outStream = this.csvParser.on('headers', (headers: string[]) => {
      if (headers.includes('發生日期')) {
        outStream.on('data', this.parseLine.bind(this));
      } else if (headers.includes('西元年')) {
        outStream.on('data', this.parseLineBefore2016.bind(this));
      } else {
        throw Error(`Unsupported CSV format: ${this.filePath}`);
      }
    });
    await this.startStream();
    return this.cases;
  }

  // no national road
  // has A2-1
  // no A3 A4
  // only contain the first and the second parties?
  private parseLineBefore2016(data: { [key: string]: string }) {
    this.rowNumber += 1;
    // The datasets between 2014 and 2016 repeat the header at the begin of A2 case section.
    if (data['年月'] === '年月') {
      return;
    }
    // The csv parse sometimes writes an extra empty object to this function between line 17205
    // and line 17206 of the data sheet of 2013. The root cause is not clear.
    if (Object.keys(data).length === 0) {
      return;
    }

    let vehicleCode = data['當事者區分類別'];
    vehicleCode = vehicleCode === 'NA' ? '' : vehicleCode;
    const party = new Party({
      id: shortUUID.generate(),
      order: Number(data['當事者順序']),
      vehicle: Vehicle.codeToVehicleMapping[vehicleCode],
    });
    if (data['屬性別'] != null) {
      // Only the csv between 2014 and 2016 has this field.
      party.gender = Number(data['屬性別']);
    }
    // If the field can not be empty, the value will not be assigned by `assignIfExists()` to
    // apply value check in runtime.
    assignIfExists(party, 'injurySeverity', data['受傷程度']);
    assignIfExists(party, 'injuriedArea', data['主要傷處']);
    assignIfExists(party, 'saftyDevice', data['保護裝備']);
    assignIfExists(party, 'smartPhone', data['行動電話']);
    assignIfExists(party, 'vehicleUsage', data['車輛用途']);
    assignIfExists(party, 'action', data['當事者行動狀態']);
    assignIfExists(party, 'driverQualification', data['駕駛資格情形']);
    assignIfExists(party, 'license', data['駕駛執照種類']);
    assignIfExists(party, 'drunkDriving', data['飲酒情形']);
    assignIfExists(party, 'crashArea', data['車輛撞擊部位最初']);
    assignIfExists(party, 'crashArea', data['車輛撞擊部位其他']);
    assignIfExists(party, 'cause', data['肇事因素個別']);
    // data['肇事逃逸'] may be an empty string.
    if (data['肇事逃逸']) {
      // 1: not hit and run
      // 2: hit and run
      party.isHitAndRun = data['肇事逃逸'] === '2';
    }
    assignIfExists(party, 'job', data['職業']);
    assignIfExists(party, 'travelPurpose', data['旅次目的']);
    if (data['國籍'] != null) {
      party.citizenship = Number(data['國籍']) + 1;
    }

    // Few cases were happened at the same location and the same time, so we cannot distinguish
    // them from the meta-information of the case. Take the cases in the dataset for exmaple.
    // There was one vehicle crashing with the other accident vehicle which self-slided earlier.
    // They were two cases at the same location and the same time. There is another example.
    // There were three scooters self-sliding at the same location and the same time. The police
    // record this event as three cases.
    // We assume that each case starts with the first party. We will verify this assumption below.
    if (this.prevCase != null && party.order !== 1) {
      this.prevCase.parties.push(party);
      return;
    }

    if (party.order === 1 && Number(data['主要肇因']) !== party.cause) {
      throw new Error(
        `${this.filePath}:${this.rowNumber} The cause of the first party is not the same as the main cause.`,
      );
    }

    let locationSections = [
      data['縣市'],
      data['區'],
      data['村里'],
      data['鄰'],
      data['街道'],
      data['段'],
      data['巷'],
      data['弄'],
      data['號'],
      data['公尺處'],
      data['街道1'],
      data['段1'],
      data['側'],
      data['附近'],
      data['道路'],
      data['公里'],
      data['公尺處1'],
      data['向'],
      data['車道'],
      data['平交道'],
      data['公里1'],
      data['公尺處2'],
      data['附近1'],
    ];
    locationSections = locationSections.filter((section) => section !== 'NA');
    const date = luxon.DateTime.fromObject(
      {
        year: Number(data['西元年']),
        month: Number(data['月']),
        day: Number(data['日']),
        hour: Number(data['時']),
        minute: Number(data['分']),
      },
      {
        zone: 'Asia/Taipei',
      },
    );

    const location: string = locationSections.join('');
    const deathIn24Hours = Number(data['死']);
    const deathIn30Days = Number(data['事故後2至30日死亡']);
    const injury = Number(data['受傷']);
    let severity: Severity;
    if (deathIn24Hours) {
      severity = Severity.DEATH_IN_24_HOURS;
    } else if (deathIn30Days) {
      severity = Severity.DEATH_BETWEEN_2_TO_30_DAYS;
    } else if (injury) {
      severity = Severity.INJURY_ONLY;
    } else {
      severity = Severity.ONLY_PROPERTY_DAMAGE;
    }
    const currentCase = new Case({
      id: shortUUID.generate(),
      date,
      location,
      firstAdministrativeLevel: data['縣市'],
      secondAdministrativeLevel: data['區'],
      severity,
      parties: [],
    });
    if (
      (currentCase.date !== this.prevCase?.date
        || currentCase.location !== this.prevCase?.location)
      && party.order !== 1
    ) {
      throw new Error(
        `${this.filePath}:${this.rowNumber} The new case doesn't start with the first party.`,
      );
    }

    currentCase.deathIn24Hours = deathIn24Hours;
    currentCase.deathIn30Days = deathIn30Days;
    currentCase.injury = injury;
    currentCase.weather = Number(data['天候']);
    currentCase.light = Number(data['光線']);
    currentCase.roadHierarchy = Number(data['道路類別']);
    currentCase.speedLimit = Number(data['速限']);
    currentCase.roadGeometry = Number(data['道路型態']);
    currentCase.position = Number(data['事故位置']);
    currentCase.roadMaterial = Number(data['路面鋪裝']);
    currentCase.roadSurfaceWet = Number(data['路面狀態']);
    currentCase.roadSurfaceDefect = Number(data['路面缺陷']);
    currentCase.obstacle = Number(data['障礙物']);
    currentCase.sightDistance = Number(data['視距']);
    currentCase.trafficSignal = Number(data['號誌種類']);
    currentCase.trafficSignalStatus = Number(data['號誌動作']);
    currentCase.directionDivider = Number(data['分向設施']);
    currentCase.normalLaneDivider = Number(data['快車道或一般車道間']);
    currentCase.fastSlowLaneDivider = Number(data['快慢車道間']);
    currentCase.edgeLine = Number(data['路面邊線']);
    currentCase.crashType = Number(data['事故類型及型態']);

    currentCase.parties.push(party);
    this.cases.push(currentCase);
    this.prevCase = currentCase;
  }

  private parseLine(data: { [key: string]: string }) {
    if (this.verify) {
      if (!['交叉路口', '一般地址', '其他', '無'].includes(data['地址類型名稱'])) {
        console.log(data);
        throw new Error(`Invalid address type:${data['地址類型名稱']}`);
      }
    }
    // set1.add(data['地址類型名稱']);
    const districtSections = [data['發生縣市名稱'], data['發生市區鄉鎮名稱']];
    const addressSections = [
      data['發生地址_村里名稱'],
      data['發生地址_鄰'],
      data['發生地址_路街'],
      data['發生地址_段'],
      data['發生地址_巷'],
      data['發生地址_弄'],
      data['發生地址_號'],
      data['發生地址_前幾公尺'] === '0' ? ' ' : data['發生地址_前幾公尺'],
      data['發生地址_側名稱'],
    ];
    const intersectionSections = [
      data['發生交叉路口_村里名稱'],
      data['發生交叉路口_路街口'],
      data['發生交叉路口_段'],
      data['發生交叉路口_巷'],
      data['發生交叉路口_弄'],
    ];
    // data['發生地址_其他'];
    let location = `${data['發生縣市名稱']}${data['發生市區鄉鎮名稱']}`;
    if (data['發生地址_村里名稱'] !== ' ') {
      location += data['發生地址_村里名稱'];
    }
    if (data['發生地址_鄰'] !== ' ') {
      location += `${data['發生地址_鄰']}鄰`;
    }
    if (data['發生地址_路街'] !== ' ') {
      location += data['發生地址_路街'];
    }
    if (data['發生地址_段'] !== ' ') {
      if (isChineseNumberOrNumber(data['發生地址_段'])) {
        location += `${data['發生地址_段']}段`;
      } else {
        location += data['發生地址_段'];
      }
    }
    if (data['發生地址_巷'] !== ' ') {
      location += `${data['發生地址_巷']}巷`;
    }
    if (data['發生地址_弄'] !== ' ') {
      location += `${data['發生地址_弄']}弄`;
    }
    if (data['發生地址_號'] !== ' ') {
      if (isNumber(data['發生地址_號'])) {
        location += `${data['發生地址_號']}號`;
      } else {
        location += data['發生地址_號'];
      }
    }
    if (data['發生地址_其他'] !== ' ') {
      location += data['發生地址_其他'];
    }
    let intersection = '';
    if (data['發生交叉路口_路街口'] !== ' ') {
      intersection += data['發生交叉路口_路街口'];
    }
    if (data['發生交叉路口_段'] !== ' ') {
      if (isChineseNumberOrNumber(data['發生交叉路口_段'])) {
        intersection += `${data['發生交叉路口_段']}段`;
      } else {
        intersection += data['發生交叉路口_段'];
      }
    }
    if (data['發生交叉路口_巷'] !== ' ') {
      intersection += `${data['發生交叉路口_巷']}巷`;
    }
    if (data['發生交叉路口_弄'] !== ' ') {
      intersection += `${data['發生交叉路口_弄']}弄`;
    }
    if (intersection && data['發生交叉路口_村里名稱'] !== ' ') {
      intersection = data['發生交叉路口_村里名稱'] + intersection;
    }
    if (intersection) {
      location += `/${intersection}`;
    }

    if (this.verify) {
      if (!districtSections.every((s) => s.trim())) {
        console.log(data);
        console.log(districtSections);
        throw new Error(districtSections.toString());
      }
      const [required, optional, empty] = buildValidator(() => {
        console.log(data);
        console.log(addressSections);
        throw new Error(addressSections.toString());
      });

      if (data['地址類型名稱'] === '一般地址' || data['地址類型名稱'] === '交叉路口') {
        optional('發生地址_村里名稱', data['發生地址_村里名稱']);
        optional('發生地址_鄰', data['發生地址_鄰'], isNumber);
        required('發生地址_路街', data['發生地址_路街']);
        optional('發生地址_段', data['發生地址_段'], isChineseNumberOrNumber);
        optional('發生地址_巷', data['發生地址_巷'], isNumber);
        optional('發生地址_弄', data['發生地址_弄'], isNumber);
        optional('發生地址_號', data['發生地址_號'], isNumber);
        optional('發生地址_前幾公尺', normalizeMetersBefore(data['發生地址_前幾公尺']), isNumber);
        optional('發生地址_側名稱', data['發生地址_側名稱']);
      } else if (data['地址類型名稱'] === '無') {
        optional('發生地址_村里名稱', data['發生地址_村里名稱']);
        empty('發生地址_鄰', data['發生地址_鄰']);
        empty('發生地址_路街', data['發生地址_路街']);
        empty('發生地址_段', data['發生地址_段']);
        empty('發生地址_巷', data['發生地址_巷']);
        empty('發生地址_弄', data['發生地址_弄']);
        // some special this.cases have address number
        optional('發生地址_號', data['發生地址_號']);
        empty('發生地址_前幾公尺', normalizeMetersBefore(data['發生地址_前幾公尺']));
        empty('發生地址_側名稱', data['發生地址_側名稱']);
      } else if (data['地址類型名稱'] === '其他') {
        optional('發生地址_村里名稱', data['發生地址_村里名稱']);
        optional('發生地址_鄰', data['發生地址_鄰'], isNumber);
        optional('發生地址_路街', data['發生地址_路街']);
        optional('發生地址_段', data['發生地址_段'], isChineseNumberOrNumber);
        optional('發生地址_巷', data['發生地址_巷'], isNumber);
        optional('發生地址_弄', data['發生地址_弄'], isNumber);
        optional('發生地址_號', data['發生地址_號'], isNumber);
        optional('發生地址_前幾公尺', normalizeMetersBefore(data['發生地址_前幾公尺']), isNumber);
        optional('發生地址_側名稱', data['發生地址_側名稱']);
      }
      let good = false;
      if (data['地址類型名稱'] === '交叉路口') {
        good = !intersectionSections.every((s) => !s.trim());
      } else if (data['地址類型名稱'] === '一般地址') {
        good = intersectionSections.slice(1).every((s) => !s.trim());
        if (!data['發生交叉路口_村里名稱'].trim()) {
          console.log(data);
          console.warn(`normal address contains village name: ${data['發生交叉路口_村里名稱']}`);
        }
      } else if (data['地址類型名稱'] === '無') {
        good = intersectionSections.slice(1).every((s) => !s.trim());
        if (data['發生交叉路口_村里名稱'].trim()) {
          console.warn(`other address contains village name: ${data['發生交叉路口_村里名稱']}`);
        }
      } else if (data['地址類型名稱'] === '其他') {
        good = true;
      }
      if (!good) {
        console.log(data);
        console.log(intersectionSections);
        throw new Error(intersectionSections.toString());
      }
      good = true;
      if (data['地址類型名稱'] === '其他') {
        good = Boolean(data['發生地址_其他'].trim());
      } else if (data['地址類型名稱'] === '無') {
        good = !data['發生地址_其他'].trim();
      }
      if (!good) {
        console.log(data);
        console.log(data['地址類型名稱']);
        throw new Error(data['地址類型名稱']);
      }
    }
    // set1.add(data['地址類型名稱']);
    // const date = luxon.DateTime.fromFormat(
    //   `${data['發生日期']}${data['發生時間']}`,
    //   'yyyyMMddHHmmss',
    //   {
    //     zone: 'Asia/Taipei',
    //   },
    // );
  }

  private cases: Case[] = [];

  private prevCase: Case | null = null;

  private rowNumber = 1;

  private verify: boolean = false;
}
