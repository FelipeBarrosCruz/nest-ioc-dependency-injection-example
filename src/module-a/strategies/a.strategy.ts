import { ResponseDTO } from '../dtos/response.dto';
import { IStrategy, BaseStrategy } from './base.strategy';
import { AService } from '../services/a.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StrategyA extends BaseStrategy implements IStrategy {
  public readonly name: string = 'Strategy A';

  constructor(protected readonly aService: AService) {
    super();
  }

  protected createResponse(): ResponseDTO {
    return new ResponseDTO({
      status: 'ok',
      context: this.formatContext([
        this.baseService.getName(),
        this.name,
        this.protectedMethodFromAbstractBase(),
        this.aService.getName(),
      ]),
    });
  }
}
