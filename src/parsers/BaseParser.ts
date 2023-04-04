import AthleteResult from '../AthleteResult';

export default abstract class BaseParser {
  public abstract parse(source: string, verify: boolean): Promise<AthleteResult[]>;
}
