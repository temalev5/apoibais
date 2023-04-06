import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { JWT_SECRET } from 'src/env';
import * as crypto from 'crypto';

import { simpleParser } from 'mailparser';

import { _ } from 'lodash';

import * as fs from 'node:fs/promises';
import * as path from 'path';

import * as imaps from 'imap-simple';

@Injectable()
export class MailService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getTextAndSign(letter) {
    const all = _.find(letter.parts, { which: 'TEXT' });
    const text = all.body.split('\r\n')[0];
    const signArray = all.body.split('\r\n');
    const sign = signArray
      .slice(1)
      .join('')
      .replaceAll('\r', '')
      .replaceAll('\n', '')
      .replaceAll('=', '')
      .replace('SIGN: ', '');

    const decodedBase64Sign = Buffer.from(sign, 'base64');

    return [text, decodedBase64Sign];
  }

  async loginSmtp(email, password) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.com',
      auth: {
        user: email, // generated ethereal user
        pass: password, // generated ethereal password
      },
    });

    const res = await transporter.verify();
    const payload = { email: email, password: password };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async sendMessage(to, subject, text, user) {
    __dirname;
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.com',
      auth: {
        user: user.email, // generated ethereal user
        pass: user.password, // generated ethereal password
      },
    });

    const key = await fs.readFile(
      path.resolve(process.cwd(), 'keys/private_key.pem'),
    );
    const sign = crypto.sign('SHA256', text, key);
    const base64sign = sign.toString('base64url');

    await transporter.sendMail({
      from: `"Fred Foo 👻" <${user.email}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text: text + '\n' + `SIGN: ${base64sign}`, // plain text body
    });

    return '';
  }

  async getMessage(user) {
    const config = {
      imap: {
        user: user.email,
        password: user.password,
        host: 'imap.yandex.com',
        port: 993,
        tls: true,
        authTimeout: 3000,
      },
    };

    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');
    const letters = await connection.search(['UNSEEN'], {
      bodies: ['HEADER', 'TEXT'],
      markSeen: false,
    });

    const letter = letters[letters.length - 1];

    const [text, sing] = await this.getTextAndSign(letter);
    const key = await fs.readFile(
      path.resolve(process.cwd(), 'keys/public_key.pem'),
    );

    const verify = crypto.verify('SHA256', text, key, sing);

    return {
      msg: verify
        ? 'Проверка подписи прошла успешно'
        : 'Ошибка проверки подписи',
      verify,
    };
  }
}
