import { ResponseDTO } from '../dtos/response.dto';
import { IStrategy, BaseStrategy } from './base.strategy';
import { Injectable } from '@nestjs/common';
import { BService } from '../services/b.service';

@Injectable()
export class StrategyB extends BaseStrategy implements IStrategy {
  public readonly name: string = 'Strategy B';
  constructor(protected readonly bService: BService) {
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
      ]),
    });
  }
}
