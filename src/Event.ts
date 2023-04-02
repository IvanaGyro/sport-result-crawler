import luxon from 'luxon';

import { autoImplements } from './utilities';

export enum Game {
  TAIWAN_INTERCOLLEGIATE_GAMES = 1,
}

export enum Sport {
  TRACK = 1,
  FIELD = 2,
}

export enum EventType {
  RUN_400_METRES = 1,
}

export enum Category {
  FEMALE = 1,
  MALE = 2,
  MIXED = 3,
  OPEN = 4,
}

export interface GPS {
  lng: number;
  lat: number;
}

interface EventParameters {
  id: string;
  game: Game;
  sport: Sport;
  event: EventType;
  category: Category;
  division?: string;
  date: luxon.DateTime;
  location?: string;
  gps?: GPS;
}

/**
 * Class of sport events
 */
export default class Event extends autoImplements<EventParameters>() {}
