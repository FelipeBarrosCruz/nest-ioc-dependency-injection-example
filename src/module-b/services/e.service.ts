import { Injectable } from '@nestjs/common';

@Injectable()
export class EService {
  getName(): string {
    console.log('Calling real method %s.getName()', EService.name);
    return EService.name;
  }
}
