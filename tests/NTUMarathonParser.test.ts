/* eslint-disable no-undef */
import fs from 'fs';
import * as luxon from 'luxon';
import NTUMarathonParser from '../src/parsers/NTUMarathonParser';
import AthleteResult, { Gender, Country } from '../src/AthleteResult';
import {
  Game, Sport, Category, FieldAndTrackEvent,
} from '../src/SportEvent';

test('parse NTU Marathon result of the attendee', async () => {
  const testPage = fs.readFileSync('./tests/NTUMarathon-2023-attended.html', 'utf8');
  const records: AthleteResult[] = await new NTUMarathonParser().parse(testPage);

  expect(records.length).toBe(1);

  const actualEvent = {
    game: Game.NTU_MARATHON,
    sport: Sport.FIELD_AND_TRACK,
    event: FieldAndTrackEvent.LONG_DISTANCE_5000M,
    category: Category.MALE,
    division: '25 分以下',
    date: luxon.DateTime.fromObject(
      {
        year: 2023,
        month: 4,
        day: 8,
        hour: 8,
        minute: 50,
      },
      {
        zone: 'Asia/Taipei',
      },
    ),
  };

  expect(records).toMatchObject([
    {
      event: actualEvent,
      name: '小光',
      gender: Gender.MALE,
      isTrans: false,
      country: Country.TAIWAN,
      rank: 649,
      score: 2144,
    },
  ]);
});

test('parse NTU Marathon result of who was absent', async () => {
  const testPage = fs.readFileSync('./tests/NTUMarathon-2023-absent.html', 'utf8');
  const records: AthleteResult[] = await new NTUMarathonParser().parse(testPage);

  expect(records.length).toBe(0);
});

test('althete number 3268 is trans', async () => {
  const testPage = fs.readFileSync('./tests/NTUMarathon-2023-isTrans.html', 'utf8');
  const records: AthleteResult[] = await new NTUMarathonParser().parse(testPage);

  expect(records.length).toBe(1);

  const actualEvent = {
    game: Game.NTU_MARATHON,
    sport: Sport.FIELD_AND_TRACK,
    event: FieldAndTrackEvent.LONG_DISTANCE_5000M,
    category: Category.MALE,
    division: '25-35 分',
    date: luxon.DateTime.fromObject(
      {
        year: 2023,
        month: 4,
        day: 8,
        hour: 8,
        minute: 50,
      },
      {
        zone: 'Asia/Taipei',
      },
    ),
  };

  expect(records).toMatchObject([
    {
      event: actualEvent,
      name: '小瓜',
      gender: Gender.MALE,
      isTrans: true,
      country: Country.TAIWAN,
      rank: 83,
      score: 1929,
    },
  ]);
});
