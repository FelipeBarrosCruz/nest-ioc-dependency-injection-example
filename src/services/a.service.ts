import { Injectable } from '@nestjs/common';

@Injectable()
export class AService {
  getName(): string {
    return AService.name;
  }
}
