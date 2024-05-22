import { Injectable } from '@nestjs/common';

@Injectable()
export class CService {
  getName(): string {
    console.log('Calling real method %s.getName()', CService.name);
    return CService.name;
  }
}
