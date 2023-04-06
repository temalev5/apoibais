import { ConfigModule } from '@nestjs/config';
import { _ } from 'lodash';
import { Request } from 'express';

export function convertStrToDate(strDate, delimiter = '.') {
  // if (new Date(strDate).toString() != 'Invalid Date') return new Date(strDate);

  const splitedDate = strDate.split(delimiter);
  const day = splitedDate[0];
  const month = splitedDate[1];
  const year = splitedDate[2];

  return new Date(year, month - 1, day);
}

export function convertDateToStr(date: Date) {
  return (
    date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
  );
}

export function csvToArray(csvText: string, delimiter: string) {
  return csvText.split('\n').map((a) => a.split(delimiter));
}

export function transposeRes(data) {
  data.pop();
  const date = convertDateToStr(new Date(data.shift()[0]));
  const zip = _.unzip(data);
  const header = zip[2].map((z: string, i: number) => z + ' ' + zip[3][i]);
  zip.splice(0, 4);
  zip[0].shift();
  zip[0].unshift(date);

  return [zip, header];
}

export function extractTokenFromHeader(request: Request): string | undefined {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
