import { autoImplements } from './utilities';

import Event from './Event';

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  NON_BINARY = 3,
}

interface RecordParameters {
  id: string;
  event: Event;
  name: string;
  gender: Gender;
  isTrans: boolean;
  age: number;
  rank: number;
  score: number;
}

export default class Record extends autoImplements<RecordParameters>() {}
