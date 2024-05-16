import { Controller, Get, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { OperationTypeEnum } from './enums/operation-type.enum';
import { ResponseDTO } from './dtos/response.dto';
import { IStrategy } from './strategies/base.strategy';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:operationType')
  async operation(
    @Param() { operationType }: { operationType: OperationTypeEnum },
  ): Promise<ResponseDTO> {
    const strategy: IStrategy = this.appService.getStrategy(operationType);
    const response: ResponseDTO = await strategy.run({});
    return response;
  }
}
