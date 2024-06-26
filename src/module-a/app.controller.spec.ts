import { AppController } from './app.controller';
import { OperationTypeEnum } from './enums/operation-type.enum';
import { BaseService } from './services/base.service';
import { AService } from './services/a.service';
import { BService } from './services/b.service';
import { CService } from './services/c.service';
import { DService } from '../module-b/services/d.service';
import { StrategyA } from './strategies/a.strategy';
import { StrategyB } from './strategies/b.strategy';
import { StrategyC } from './strategies/c.strategy';
import { ResponseDTO } from './dtos/response.dto';
import { AppTestModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;
  let baseService: BaseService;
  let aService: AService;
  let bService: BService;
  let cService: CService;
  let dService: DService;
  let strategyA: StrategyA;
  let strategyB: StrategyB;
  let strategyC: StrategyC;

  beforeEach(async () => {
    const app = await AppTestModule.compile();

    appController = app.get<AppController>(AppController);
    baseService = app.get<BaseService>(BaseService);
    aService = app.get<AService>(AService);
    bService = app.get<BService>(BService);
    cService = app.get<CService>(CService);
    dService = app.get<DService>(DService);
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

    it('should test strategy D', async () => {
      const response = await appController.operation({
        operationType: OperationTypeEnum.D,
      });

      const context = baseService.formatContext([
        baseService.getName(),
        strategyC.name,
        strategyB.protectedNameValue,
        bService.getName(),
        cService.getName(),
        dService.getName(),
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
