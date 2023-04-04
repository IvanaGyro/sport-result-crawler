import { BigQuery } from '@google-cloud/bigquery';
import { CredentialBody } from 'google-auth-library';

import convict from 'convict';
import toml from 'toml';
import AthleteResult from '../AthleteResult';

convict.addParser({ extension: 'toml', parse: toml.parse });

interface Config {
  googleCloud: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    projectId: string;
    datasetId: string;
    tableId: string;
  };
}

const config = convict<Config>({
  googleCloud: {
    clientId: {
      doc: 'The client ID for accessing Google Cloud services.',
      format: String,
      default: '',
      env: 'GOOGLE_CLOUD_CLIENT_ID',
    },
    clientSecret: {
      doc: 'The client secret for accessing Google Cloud services.',
      format: String,
      default: '',
      env: 'GOOGLE_CLOUD_CLIENT_SECRET',
    },
    refreshToken: {
      doc: 'The OAuth2 refresh token for accessing Google Cloud services.',
      format: String,
      default: '',
      env: 'GOOGLE_CLOUD_REFRESH_TOKEN',
    },
    projectId: {
      doc: 'The ID of the Google Cloud project to access.',
      format: String,
      default: '',
      env: 'GOOGLE_CLOUD_PROJECT_ID',
    },
    datasetId: {
      doc: 'The ID of the BigQuery dataset to access.',
      format: String,
      default: '',
      env: 'GOOGLE_CLOUD_DATASET_ID',
    },
    tableId: {
      doc: 'The ID of the BigQuery table to access.',
      format: String,
      default: '',
      env: 'GOOGLE_CLOUD_TABLE_ID',
    },
  },
});

interface CorrectCredentialBody extends CredentialBody {
  type?: string;
  // eslint-disable-next-line camelcase
  client_id: string;
  // eslint-disable-next-line camelcase
  client_secret: string;
  // eslint-disable-next-line camelcase
  refresh_token: string;
}

export default class BigQueryExporter {
  static bigquery: BigQuery | null = null;

  static datasetId: string | null = null;

  static tableId: string | null = null;

  private static auth() {
    // Load required configs from the config file
    config.loadFile('config.toml');
    config.validate({ allowed: 'strict' });
    const googleCloudConfig = config.get('googleCloud');
    const { clientId } = googleCloudConfig;
    const { clientSecret } = googleCloudConfig;
    const { refreshToken } = googleCloudConfig;
    const { projectId } = googleCloudConfig;
    this.datasetId = googleCloudConfig.datasetId;
    this.tableId = googleCloudConfig.tableId;

    // auth to google cloud
    const credentials: CorrectCredentialBody = {
      type: 'authorized_user',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    };
    this.bigquery = new BigQuery({
      credentials,
      projectId,
    });
  }

  static async export(records: AthleteResult[]): Promise<void> {
    if (this.bigquery == null) {
      this.auth();
    }
    if (this.bigquery == null || this.datasetId == null || this.tableId == null) {
      throw Error('Fail to auth to Google Cloud or fail to get dataset ID and table ID.');
    }

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
    const result = await this.bigquery
      .dataset(this.datasetId)
      .table(this.tableId)
      .insert(rows);
    console.log(result);
    console.log(`Inserted ${rows.length} rows`);
  }
}
