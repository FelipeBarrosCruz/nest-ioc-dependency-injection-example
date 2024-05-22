import { Injectable } from '@nestjs/common';

@Injectable()
export class DService {
  getName(): string {
    console.log('Calling real method %s.getName()', DService.name);
    return DService.name;
  }
}
