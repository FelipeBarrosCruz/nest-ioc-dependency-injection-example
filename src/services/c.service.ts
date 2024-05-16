import { Injectable } from '@nestjs/common';

@Injectable()
export class CService {
  getName(): string {
    return CService.name;
  }
}
