import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StrategyA } from './strategies/a.strategy';
import { AService } from './services/a.service';
import { BService } from './services/b.service';
import { CService } from './services/c.service';
import { StrategyB } from './strategies/b.strategy';
import { StrategyC } from './strategies/c.strategy';
import { BaseService } from './services/base.service';

@Module({
  imports: [],
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
})
export class AppModule {}
