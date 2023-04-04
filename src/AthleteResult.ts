import { autoImplements } from './utilities';

import SportEvent from './SportEvent';

export enum Gender {
  FEMALE = 1,
  MALE = 2,
  NON_BINARY = 3,
}

export enum Country {
  TAIWAN = 1,
}

interface AthleteResultParameters {
  id: string;
  event: SportEvent;
  name: string;
  gender: Gender;
  isTrans: boolean;
  age?: number;
  country: Country;
  institution?: string;
  rank: number;
  score: number;
}

export default class AthleteResult extends autoImplements<AthleteResultParameters>() {}
