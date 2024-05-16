import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OperationTypeEnum } from './enums/operation-type.enum';
import { BaseService } from './services/base.service';
import { AService } from './services/a.service';
import { BService } from './services/b.service';
import { CService } from './services/c.service';
import { StrategyA } from './strategies/a.strategy';
import { StrategyB } from './strategies/b.strategy';
import { StrategyC } from './strategies/c.strategy';
import { ResponseDTO } from './dtos/response.dto';

describe('AppController', () => {
  let appController: AppController;
  let baseService: BaseService;
  let aService: AService;
  let bService: BService;
  let cService: CService;
  let strategyA: StrategyA;
  let strategyB: StrategyB;
  let strategyC: StrategyC;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        BaseService,
        AService,
        BService,
        CService,
        StrategyA,
        StrategyB,
        StrategyC,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    baseService = app.get<BaseService>(BaseService);
    aService = app.get<AService>(AService);
    bService = app.get<BService>(BService);
    cService = app.get<CService>(CService);
    strategyA = app.get<StrategyA>(StrategyA);
    strategyB = app.get<StrategyB>(StrategyB);
    strategyC = app.get<StrategyC>(StrategyC);
  });

  describe('root', () => {
    it('should test strategy A', async () => {
      const response = await appController.operation({
        operationType: OperationTypeEnum.A,
      });

      const context = baseService.formatContext([
        baseService.getName(),
        strategyA.name,
        strategyA.protectedNameValue,
        aService.getName(),
      ]);

      expect(response).toEqual(
        new ResponseDTO({
          context,
          status: 'ok',
        }),
      );
    });

    it('should test strategy B', async () => {
      const response = await appController.operation({
        operationType: OperationTypeEnum.B,
      });

      const context = baseService.formatContext([
        baseService.getName(),
        strategyB.name,
        strategyB.protectedNameValue,
        bService.getName(),
      ]);

      expect(response).toEqual(
        new ResponseDTO({
          context,
          status: 'ok',
        }),
      );
    });

    it('should test strategy C', async () => {
      const response = await appController.operation({
        operationType: OperationTypeEnum.C,
      });

      const context = baseService.formatContext([
        baseService.getName(),
        strategyC.name,
        strategyB.protectedNameValue,
        bService.getName(),
        cService.getName(),
      ]);

      expect(response).toEqual(
        new ResponseDTO({
          context,
          status: 'ok',
        }),
      );
    });
  });
});
