import { autoImplements } from './utilities';

import Event from './Event';

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  NON_BINARY = 3,
}

export enum Country {
  TAIWAN = 1,
}

interface RecordParameters {
  id: string;
  event: Event;
  name: string;
  gender: Gender;
  isTrans: boolean;
  age?: number;
  country: Country;
  institution?: string;
  rank: number;
  score: number;
}

export default class Record extends autoImplements<RecordParameters>() {}
