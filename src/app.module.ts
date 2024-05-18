import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StrategyA } from './strategies/a.strategy';
import { AService } from './services/a.service';
import { BService } from './services/b.service';
import { CService } from './services/c.service';
import { StrategyB } from './strategies/b.strategy';
import { StrategyC } from './strategies/c.strategy';
import { BaseService } from './services/base.service';
import { NestModuleFactory } from './libs/nest-module-factory';

export const ModuleFactory = new NestModuleFactory({
  controllers: [AppController],
  providers: [
    BaseService,
    AService,
    BService,
    CService,
    AppService,
    StrategyA,
    StrategyB,
    StrategyC,
  ],
});

export const AppModule = ModuleFactory.createModule({
  classType: class AppModule {},
  global: true,
});

export const AppTestModule = ModuleFactory.createTestModule();
