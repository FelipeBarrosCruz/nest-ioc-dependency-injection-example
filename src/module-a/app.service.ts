import { Injectable, NotImplementedException } from '@nestjs/common';
import { IStrategy } from './strategies/base.strategy';
import { OperationTypeEnum } from './enums/operation-type.enum';
import { StrategyA } from './strategies/a.strategy';
import { StrategyB } from './strategies/b.strategy';
import { StrategyC } from './strategies/c.strategy';
import { StrategyD } from './strategies/d.strategy';

@Injectable()
export class AppService {
  constructor(
    private readonly strategyA: StrategyA,
    private readonly strategyB: StrategyB,
    private readonly strategyC: StrategyC,
    private readonly strategyD: StrategyD,
  ) {}

  getStrategy(operationType: OperationTypeEnum): IStrategy {
    switch (operationType) {
      case OperationTypeEnum.A:
        return this.strategyA;
      case OperationTypeEnum.B:
        return this.strategyB;
      case OperationTypeEnum.C:
        return this.strategyC;
      case OperationTypeEnum.D:
        return this.strategyD;
      default:
        throw new NotImplementedException('Invalid operation type');
    }
  }
}
