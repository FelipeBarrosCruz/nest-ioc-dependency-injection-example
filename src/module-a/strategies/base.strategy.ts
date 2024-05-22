import { Inject, Injectable } from '@nestjs/common';
import { ResponseDTO } from '../dtos/response.dto';
import { BaseService } from '../services/base.service';

export interface IStrategy {
  run(requestBody: any): Promise<ResponseDTO>;
}

@Injectable()
export abstract class BaseStrategy {
  public readonly protectedNameValue: string =
    'protected-method-from-abstract-base';

  @Inject(BaseService)
  protected readonly baseService: BaseService;

  protected protectedMethodFromAbstractBase(): string {
    return this.protectedNameValue;
  }

  protected formatContext(args: string[]): string {
    return this.baseService.formatContext(args);
  }

  protected abstract createResponse(): ResponseDTO;

  async run(requestBody: any): Promise<ResponseDTO> {
    return this.createResponse();
  }
}
