import { BigQuery } from '@google-cloud/bigquery';
import { CredentialBody } from 'google-auth-library';

import convict from 'convict';
import toml from 'toml';
import AthleteResult from '../AthleteResult';

import { GPS } from '../SportEvent';

import enumToString from '../EnumToString';

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

interface TransformedAthleteResult {
  id: string;
  game: string;
  sport: string;
  event: string;
  category: string;
  division: string | undefined;
  round: string | undefined;
  date: string;
  location: string | undefined;
  gps: string | undefined;
  name: string;
  gender: string;
  isTrans: boolean;
  age: number | undefined;
  country: string | undefined;
  institution: string | undefined;
  rank: number;
  score: number;
}

function gpsToString(gps?: GPS): string | undefined {
  return gps && `POINT(${gps.lng} ${gps.lat})`;
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

    const rows: TransformedAthleteResult[] = records.map((athleteResult) => ({
      id: athleteResult.id,
      game: enumToString(athleteResult.event.game),
      sport: enumToString(athleteResult.event.sport),
      event: enumToString(athleteResult.event.event),
      category: enumToString(athleteResult.event.category),
      division: athleteResult.event.division,
      round: enumToString(athleteResult.event.round),
      date: athleteResult.event.date.toISO({ includeOffset: false }),
      location: athleteResult.event.location,
      gps: gpsToString(athleteResult.event.gps),
      name: athleteResult.name,
      gender: enumToString(athleteResult.gender),
      isTrans: athleteResult.isTrans,
      age: athleteResult.age,
      country: enumToString(athleteResult.country),
      institution: athleteResult.institution,
      rank: athleteResult.rank,
      score: athleteResult.score,
    }));

    // Insert data into a table
    await this.bigquery.dataset(this.datasetId).table(this.tableId).insert(rows);
    console.log(`Inserted ${rows.length} rows`);
  }
}
