import { EntityManager } from '@mikro-orm/core';
import { InjectEntityManager } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  differenceInCalendarYears,
  format,
  getYear,
  isWithinInterval,
} from 'date-fns';
import { ExchangeRate } from 'src/entities/dummy.entity';
import {
  convertStrToDate,
  csvToArray,
  transposeRes,
} from 'src/helpers/helpers';
import { Cron } from '@nestjs/schedule';
import { _ } from 'lodash';
import { BankReport } from './entities/bank.entities';

@Injectable()
export class BankService {
  constructor(@InjectEntityManager('lr3') private readonly em: EntityManager) {}

  private saveExchangeRateToDb(oldExchangeRates, jsonDate: ExchangeRate[]) {
    jsonDate.map((jd) => {
      const oldExchangeRate = oldExchangeRates.find(
        (oxr) =>
          oxr.date.getTime() === jd.date.getTime() &&
          oxr.currency === jd.currency,
      );

      if (oldExchangeRate) {
        oldExchangeRate.value = Number(jd.value);
        this.em.persist(oldExchangeRate);
      } else {
        const exchangeRate = new ExchangeRate(
          jd.date,
          jd.currency,
          Number(jd.value.toFixed(3)),
        );
        this.em.persist(exchangeRate);
      }
    });
  }

  private filterJsonData(jsonData, dateFromDate, dateToDate): ExchangeRate[] {
    return jsonData.filter((jd) =>
      isWithinInterval(jd.date, { start: dateFromDate, end: dateToDate }),
    );
  }

  private async getJsonDateFromExchangeMarket(
    dateFromDate,
    dateToDate,
  ): Promise<ExchangeRate[]> {
    const countYears = differenceInCalendarYears(dateToDate, dateFromDate);

    let jsonDate: ExchangeRate[] = [];

    for (
      let i = getYear(dateFromDate);
      i <= getYear(dateToDate) + countYears;
      i++
    ) {
      const res = await axios.get<string>(
        `https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/year.txt?year=${i}`,
      );

      const data = csvToArray(res.data, '|');
      const header = data.shift();

      jsonDate = [...jsonDate, ...this.csvDateToJson(data, header)];
    }
    return jsonDate;
  }

  private csvDateToJson(data, header) {
    const jsonData = [];
    data.map((dateBydate) => {
      const date = convertStrToDate(dateBydate.shift());

      dateBydate.map((element, k) => {
        const currency = header[k + 1].split(' ')[1];
        const amount = Number(header[k + 1].split(' ')[0]);
        const value = Number(element) / amount;

        jsonData.push({
          date,
          currency,
          value,
        });
      });
    });
    return jsonData;
  }

  private filterByCurrency(jsonData, currency) {
    return jsonData.filter((jd) => currency.includes(jd.currency));
  }

  async getСurrencyByDate(): Promise<string> {
    const response = await axios.get<any, any>(
      'https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=27.07.2019',
    );
    console.log(response);

    return response.data;
  }

  async getCurrenceByDates(
    date_from: string,
    date_to: string,
  ): Promise<ExchangeRate[]> {
    const dateFromDate = convertStrToDate(date_from);
    const dateToDate = convertStrToDate(date_to);

    const oldExchangeRates = await this.em.find(ExchangeRate, {});
    const jsonData = await this.getJsonDateFromExchangeMarket(
      dateFromDate,
      dateToDate,
    );

    const filteredJsonData = this.filterJsonData(
      jsonData,
      dateFromDate,
      dateToDate,
    );

    this.saveExchangeRateToDb(oldExchangeRates, filteredJsonData);
    await this.em.flush();
    return jsonData;
  }

  async getCountByYear(
    date_from: string,
    date_to: string,
    currency: string[],
  ): Promise<BankReport[]> {
    const dateFromDate = convertStrToDate(date_from);
    const dateToDate = convertStrToDate(date_to);

    const jsonData = await this.getJsonDateFromExchangeMarket(
      dateFromDate,
      dateToDate,
    );

    const filteredJsonData = this.filterJsonData(
      jsonData,
      dateFromDate,
      dateToDate,
    );

    const filteredByCurrency = this.filterByCurrency(
      filteredJsonData,
      currency,
    );
    const groupByCurrency = _.groupBy(filteredByCurrency, 'currency');

    const result: BankReport[] = [];

    Object.keys(groupByCurrency).map((key) => {
      const values = groupByCurrency[key].map((gbc) => gbc.value);
      const min = Number(_.min(values).toFixed(3));
      const max = Number(_.max(values).toFixed(3));
      const avg = Number((_.sum(values) / values.length).toFixed(3));
      result.push({
        currency: key,
        count: {
          min,
          max,
          avg,
        },
      });
    });

    console.log(result);
    return result;
  }

  @Cron('* * * * *') // '0 15 * * *'
  async dailyUpdate() {
    const oldExchangeRates = await this.em.find(ExchangeRate, {});
    const today = format(new Date(), 'dd.MM.yyyy');
    const response = await axios.get<string, any>(
      `https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/daily.txt?date=${today}`,
    );

    const data = csvToArray(response.data, '|');
    const [tData, header] = transposeRes(data);
    const jsonData = this.csvDateToJson(tData, header);

    this.saveExchangeRateToDb(oldExchangeRates, jsonData);
    await this.em.flush();
    return jsonData;
  }
}
