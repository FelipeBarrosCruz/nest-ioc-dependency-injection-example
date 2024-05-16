import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseService {
  formatContext(args: string[]): string {
    return args.join(' ');
  }

  getName(): string {
    return BaseService.name;
  }
}
