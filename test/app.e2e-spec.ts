import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { OperationTypeEnum } from '../src/enums/operation-type.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('(GET) - /A ', () => {
    return request(app.getHttpServer())
      .get(`/${OperationTypeEnum.A}`)
      .expect(200)
      .expect({
        status: 'ok',
        context:
          'BaseService Strategy A protected-method-from-abstract-base AService',
      });
  });
});
