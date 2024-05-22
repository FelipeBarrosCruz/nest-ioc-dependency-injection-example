import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StrategyA } from './strategies/a.strategy';
import { AService } from './services/a.service';
import { BService } from './services/b.service';
import { CService } from './services/c.service';
import { StrategyB } from './strategies/b.strategy';
import { StrategyC } from './strategies/c.strategy';
import { StrategyD } from './strategies/d.strategy';
import { BaseService } from './services/base.service';
import { AppModuleB } from '../module-b/app.module';
import { NestModuleFactory } from '../libs/nest-module-factory';

export const ModuleFactory = new NestModuleFactory({
  imports: [AppModuleB],
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
    StrategyD,
  ],
});

export const AppModule = ModuleFactory.createModule({
  classType: class AppModuleA {},
  global: true,
});

export const AppTestModule = ModuleFactory.createTestModule();
