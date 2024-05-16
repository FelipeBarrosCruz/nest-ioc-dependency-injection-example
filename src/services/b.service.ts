import { Injectable } from '@nestjs/common';

@Injectable()
export class BService {
  getName(): string {
    return BService.name;
  }
}
