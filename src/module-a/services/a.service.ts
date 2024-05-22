import { Injectable } from '@nestjs/common';

@Injectable()
export class AService {
  getName(): string {
    console.log('Calling real method %s.getName()', AService.name);
    return AService.name;
  }
}
