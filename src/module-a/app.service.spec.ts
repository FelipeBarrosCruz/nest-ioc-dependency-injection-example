import { AppService } from './app.service';
import { DService } from '../module-b/services/d.service';
import { OperationTypeEnum } from './enums/operation-type.enum';
import { StrategyA } from './strategies/a.strategy';
import { StrategyD } from './strategies/d.strategy';
import { ResponseDTO } from './dtos/response.dto';
import { AppTestModule } from './app.module';
import { createMock } from '@golevelup/ts-jest';
import { BaseService } from './services/base.service';
import { Controller, Injectable } from '@nestjs/common';

@Injectable()
class FakeProvider {
  public getName(): string {
    return 'fake';
  }
}

@Controller('app')
class FakeController {}

describe('AppService', () => {
  let appService: AppService;
  let dService: DService;
  let strategyA: StrategyA;
  let strategyD: StrategyD;
  let baseService: BaseService;
  let fakeProvider: FakeProvider;
  const providersExclusions = [
    AppService,
    BaseService,
    StrategyD,
    FakeProvider,
  ];

  beforeEach(async () => {
    // const app = await AppTestModule.setupProviders()
    //   .getModuleRef()
    //   .overrideProvider(AppService)
    //   .useClass(AppService)
    //   .compile();

    // const app = await AppTestModule.setupProviders({
    //   exclude: providersExclusions,
    // })
    //   .setupCreateMockFn(createMock)
    //   .compile();

    const app = await AppTestModule.addController(FakeController)
      .addProvider(FakeProvider)
      .setupProviders({
        exclude: providersExclusions,
      })
      .compile();

    appService = app.get<AppService>(AppService);
    dService = app.get<DService>(DService);
    strategyA = app.get<StrategyA>(StrategyA);
    strategyD = app.get<StrategyD>(StrategyD);
    baseService = app.get<BaseService>(BaseService);
    fakeProvider = app.get<FakeProvider>(FakeProvider);
  });

  afterEach(async () => {
    await jest.restoreAllMocks();
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

    it('should test service call strategy D with real D service of module B', async () => {
      const expected = new ResponseDTO({
        status: 'ok',
        context:
          'BaseService Strategy C protected-method-from-abstract-base BService CService DService',
      });

      jest
        .spyOn(baseService, 'formatContext')
        .mockReturnValue(expected.context);

      const currentStrategy = appService.getStrategy(OperationTypeEnum.D);
      const result = await currentStrategy.run({});
      expect(result).toEqual(expected);
    });

    it('should test service call strategy D with mocked D service of module B explicity with jest', async () => {
      const expected = new ResponseDTO({
        status: 'ok',
        context:
          'BaseService Strategy C protected-method-from-abstract-base BService CService DService',
      });

      jest
        .spyOn(baseService, 'formatContext')
        .mockReturnValue(expected.context);

      jest.spyOn(dService, 'getName').mockReturnValue(DService.name);

      const currentStrategy = appService.getStrategy(OperationTypeEnum.D);
      const result = await currentStrategy.run({});
      expect(baseService.formatContext).toHaveBeenCalled();
      expect(dService.getName).toHaveBeenCalled();
      // expect(strategyD.run).toHaveBeenCalled(); // fails because isn't a mock, we exclude to mock it in before each declaration
      expect(result).toEqual(expected);
    });

    it('should test service call strategy D with mocked D service of module B auto with include', async () => {
      const app = await AppTestModule.setupProviders({
        exclude: providersExclusions,
        include: [DService],
      }).compile();

      appService = app.get<AppService>(AppService);
      dService = app.get<DService>(DService);
      strategyD = app.get<StrategyD>(StrategyD);
      baseService = app.get<BaseService>(BaseService);

      const expected = new ResponseDTO({
        status: 'ok',
        context:
          'BaseService Strategy C protected-method-from-abstract-base BService CService DService',
      });

      jest
        .spyOn(baseService, 'formatContext')
        .mockReturnValue(expected.context);

      const currentStrategy = appService.getStrategy(OperationTypeEnum.D);
      const result = await currentStrategy.run({});

      expect(baseService.formatContext).toHaveBeenCalled();
      expect(dService.getName).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('should test service call strategy D with mocked D service of module B auto and override imports', async () => {
      const app = await AppTestModule.setupImports()
        .setupProviders({
          exclude: providersExclusions,
        })
        .compile();

      appService = app.get<AppService>(AppService);
      dService = app.get<DService>(DService);
      strategyD = app.get<StrategyD>(StrategyD);
      baseService = app.get<BaseService>(BaseService);

      const expected = new ResponseDTO({
        status: 'ok',
        context:
          'BaseService Strategy C protected-method-from-abstract-base BService CService DService',
      });

      jest
        .spyOn(baseService, 'formatContext')
        .mockReturnValue(expected.context);

      const currentStrategy = appService.getStrategy(OperationTypeEnum.D);
      const result = await currentStrategy.run({});

      expect(baseService.formatContext).toHaveBeenCalled();
      expect(dService.getName).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });

    it('test fake provider is mocked', () => {
      const expected = 'fake';

      jest.spyOn(fakeProvider, 'getName');

      const result = fakeProvider.getName();
      expect(fakeProvider.getName).toHaveBeenCalled();
      expect(result).toBe(expected);
    });
  });
});
