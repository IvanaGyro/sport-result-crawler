import { autoImplements } from './utilities';

import SportEvent from './SportEvent';

export enum Gender {
  FEMALE = 100,
  MALE,
  NON_BINARY,
}

export enum Country {
  TAIWAN = 200,
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
