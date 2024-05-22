import { DService } from './services/d.service';
import { EService } from './services/e.service';
import { NestModuleFactory } from '../libs/nest-module-factory';

export const ModuleFactory = new NestModuleFactory({
  providers: [DService, EService],
  exports: [DService],
});

export const AppModuleB = ModuleFactory.createModule({
  classType: class AppModuleB {},
  global: true,
});

export const AppTestModuleB = ModuleFactory.createTestModule();
