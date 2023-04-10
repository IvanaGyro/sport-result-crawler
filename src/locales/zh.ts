import {
  Game, Sport, EventType, Category, Round, FieldAndTrackEvent,
} from '../SportEvent';

import { Gender, Country } from '../AthleteResult';

function gameToString(game: Game): string {
  const mapping = {
    [Game.TAIWAN_INTERCOLLEGIATE_GAMES]: '全大運',
  };
  return mapping[game];
}

function sportToString(sport: Sport): string {
  const mapping = {
    [Sport.FIELD_AND_TRACK]: '田徑',
  };
  return mapping[sport];
}

function eventTypeToString(eventType: EventType): string {
  const mapping = {
    [FieldAndTrackEvent.SPRINT_400M]: '400 公尺',
  };
  return mapping[eventType];
}

function categoryToString(category: Category): string {
  const mapping = {
    [Category.FEMALE]: '女子組',
    [Category.MALE]: '男子組',
    [Category.MIXED]: '混合',
    [Category.OPEN]: '公開組',
  };
  return mapping[category];
}

function roundToString(round?: Round): string | undefined {
  const mapping = {
    [Round.PRELIMINARY]: '預賽',
    [Round.SEMI_FINAL]: '準決賽',
    [Round.FINAL]: '決賽',
  };
  return round && mapping[round];
}

function genderToString(gender: Gender): string {
  const mapping = {
    [Gender.MALE]: '男',
    [Gender.FEMALE]: '女',
    [Gender.NON_BINARY]: '非二元',
  };
  return mapping[gender];
}

function countryToString(country: Country): string {
  const mapping = {
    [Country.TAIWAN]: '台灣',
  };
  return mapping[country];
}

export {
  gameToString,
  sportToString,
  eventTypeToString,
  categoryToString,
  roundToString,
  genderToString,
  countryToString,
};
