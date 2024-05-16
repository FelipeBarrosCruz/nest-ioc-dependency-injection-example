import { ResponseDTO } from '../dtos/response.dto';
import { IStrategy, BaseStrategy } from './base.strategy';
import { Injectable } from '@nestjs/common';
import { BService } from '../services/b.service';
import { CService } from '../services/c.service';
import { BaseService } from '../services/base.service';

@Injectable()
export class StrategyC extends BaseStrategy implements IStrategy {
  public readonly name: string = 'Strategy C';
  constructor(
    protected readonly bService: BService,
    protected readonly cService: CService,
  ) {
    super();
  }

  protected createResponse(): ResponseDTO {
    return new ResponseDTO({
      status: 'ok',
      context: this.formatContext([
        this.baseService.getName(),
        this.name,
        this.protectedMethodFromAbstractBase(),
        this.bService.getName(),
        this.cService.getName(),
      ]),
    });
  }
}
