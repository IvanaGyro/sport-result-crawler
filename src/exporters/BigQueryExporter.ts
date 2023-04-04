import { BigQuery } from '@google-cloud/bigquery';
import { CredentialBody } from 'google-auth-library';
import AthleteResult from '../AthleteResult';

interface CorrectCredentialBody extends CredentialBody {
  type?: string;
  // eslint-disable-next-line camelcase
  client_id: string;
  // eslint-disable-next-line camelcase
  client_secret: string;
  // eslint-disable-next-line camelcase
  refresh_token: string;
}

const projectId = 'projectId';
const clientId = 'clientId';
const clientSecret = 'clientSecret';
const refreshToken = 'refreshToken';
const datasetId = 'my_dataset';
const tableId = 'my_table';
const credentials: CorrectCredentialBody = {
  type: 'authorized_user',
  client_id: clientId,
  client_secret: clientSecret,
  refresh_token: refreshToken,
};

export default class BigQueryExporter {
  static async export(records: AthleteResult[]): Promise<void> {
    const bigquery = new BigQuery({
      credentials,
      projectId,
    });

    let rows: any[] = records.map((record) => record); // TODO
    rows = [
      {
        id: '1234',
        game: '1234',
        sport: '1234',
        event: '1234',
        category: '1234',
        division: '1234',
        round: '1234',
        date: '2022-09-08 09:00:10',
        location: '1234',
        gps: 'POINT(1 1)',
        name: '1234',
        gender: '1234',
        isTrans: false,
        age: 12,
        country: '1234',
        institution: '1234',
        rank: 5,
        score: 123.123,
      },
    ];

    // Insert data into a table
    const result = await bigquery.dataset(datasetId).table(tableId).insert(rows);
    console.log(result);
    console.log(`Inserted ${rows.length} rows`);
  }
}
