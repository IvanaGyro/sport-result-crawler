import fs from 'fs';

import readline from 'readline';
import csv from 'csv-parser';

export interface ShapeOfFields {
  [field: string]: {
    values: Set<string>;
    valueFirstAppearances: {
      [value: string]: {
        filename: string;
        line: number;
      };
    };
    fieldFirstAppearances: {
      filename: string;
    };
  };
}

/**
 * Generate shape of fields from a csv file.
 *
 * A shape of fields is a map of field names to the set of values that appear in that field. The
 * first appearance of a value in a field is also recorded.
 *
 * @param filename filename of the csv file
 * @param excludedFields fields to exclude
 * @param outShape shape of fields to output. If not provided, a new shape of fields will be
 *                 created.
 */
export async function generateShapeOfFields(
  filename: string,
  excludedFields: Set<string>,
  outShape?: ShapeOfFields,
): Promise<ShapeOfFields> {
  const outShapeRef = outShape == null ? {} : outShape;
  const inStream = fs.createReadStream(filename);
  let line = 2;
  const outStream = csv()
    .on('headers', (headers: string[]) => {
      headers.forEach((header: string) => {
        if (!excludedFields.has(header) && outShapeRef[header] === undefined) {
          outShapeRef[header] = {
            values: new Set(),
            valueFirstAppearances: {},
            fieldFirstAppearances: {
              filename,
            },
          };
        }
      });
    })
    .on('data', (data: { [field: string]: string }) => {
      Object.keys(data).forEach((field: string) => {
        if (!excludedFields.has(field)) {
          const fieldShape = outShapeRef[field];
          const value = data[field];
          fieldShape.values.add(value);
          if (fieldShape.valueFirstAppearances[value] == null) {
            fieldShape.valueFirstAppearances[value] = {
              filename,
              line,
            };
          }
        }
      });
      line += 1;
    });

  const rl = readline.createInterface({
    input: inStream,
  });
  // eslint-disable-next-line no-restricted-syntax
  for await (const text of rl) {
    outStream.write(text);
    outStream.write('\n');
  }

  return outShapeRef;
}
