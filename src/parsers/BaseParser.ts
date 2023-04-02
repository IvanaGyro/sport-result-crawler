import Record from '../Record';

export default abstract class BaseParser {
  public abstract parse(source: string, verify: boolean): Promise<Record[]>;
}
