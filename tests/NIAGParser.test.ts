/* eslint-disable no-undef */
import fs from 'fs';
import * as luxon from 'luxon';
import NIAGParser from '../src/parsers/NIAGParser';
import AthleteResult, { Gender, Country } from '../src/AthleteResult';
import {
  Game, Sport, Category, Round, FieldAndTrackEvent,
} from '../src/SportEvent';

test('parse NIAG records', async () => {
  const testPage = fs.readFileSync('./tests/NIAG2022.html', 'utf8');
  const records: AthleteResult[] = await new NIAGParser().parse(testPage, true);

  expect(records.length).toBe(2);

  const actualEvent = {
    game: Game.TAIWAN_INTERCOLLEGIATE_GAMES,
    sport: Sport.FIELD_AND_TRACK,
    event: FieldAndTrackEvent.SPRINT_400M,
    category: Category.FEMALE,
    division: '一般',
    round: Round.PRELIMINARY,
    date: luxon.DateTime.fromObject(
      {
        year: 2022,
        month: 5,
        day: 8,
        hour: 9,
        minute: 0,
      },
      {
        zone: 'Asia/Taipei',
      },
    ),
  };

  expect(records).toMatchObject([
    {
      event: actualEvent,
      name: '王于嘉',
      gender: Gender.FEMALE,
      isTrans: false,
      country: Country.TAIWAN,
      institution: '清華大學',
      rank: 1,
      score: expect.closeTo(60.33, 4),
    },
    {
      event: actualEvent,
      name: '張心怡',
      gender: Gender.FEMALE,
      isTrans: false,
      country: Country.TAIWAN,
      institution: '文藻大學',
      rank: 7,
      score: expect.closeTo(78.46, 4),
    },
  ]);
});
