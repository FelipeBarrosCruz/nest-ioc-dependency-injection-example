import { Injectable } from '@nestjs/common';

@Injectable()
export class BService {
  getName(): string {
    console.log('Calling real method %s.getName()', BService.name);
    return BService.name;
  }
}
