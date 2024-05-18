import { AppService } from './app.service';
import { OperationTypeEnum } from './enums/operation-type.enum';
import { StrategyA } from './strategies/a.strategy';
import { StrategyB } from './strategies/b.strategy';
import { StrategyC } from './strategies/c.strategy';
import { ResponseDTO } from './dtos/response.dto';
import { AppTestModule } from './app.module';

describe('AppService', () => {
  let appService: AppService;
  let strategyA: StrategyA;
  let strategyB: StrategyB;
  let strategyC: StrategyC;
  const providersExclusions = [AppService];

  beforeEach(async () => {
    const testModule = await AppTestModule.setupProviders({
      exclude: providersExclusions,
    });

    const app = await testModule.get().compile();

    appService = app.get<AppService>(AppService);
    strategyA = app.get<StrategyA>(StrategyA);
    strategyB = app.get<StrategyB>(StrategyB);
    strategyC = app.get<StrategyC>(StrategyC);
  });

  describe('root', () => {
    it('should test service call strategy A', async () => {
      const expected = new ResponseDTO({
        status: 'ok',
        context: 'testing strategy A',
      });

      jest.spyOn(strategyA, 'run').mockResolvedValue(expected);

      const currentStrategy = appService.getStrategy(OperationTypeEnum.A);
      const result = await currentStrategy.run({});
      expect(strategyA.run).toHaveBeenCalled();
      expect(result).toBe(expected);
    });
  });
});
