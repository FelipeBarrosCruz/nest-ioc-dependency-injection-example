import { ResponseDTO } from '../dtos/response.dto';
import { IStrategy, BaseStrategy } from './base.strategy';
import { Injectable } from '@nestjs/common';
import { BService } from '../services/b.service';
import { CService } from '../services/c.service';
import { DService } from '../../module-b/services/d.service';

@Injectable()
export class StrategyD extends BaseStrategy implements IStrategy {
  public readonly name: string = 'Strategy C';
  constructor(
    protected readonly bService: BService,
    protected readonly cService: CService,
    protected readonly dService: DService,
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
        this.dService.getName(),
      ]),
    });
  }
}
