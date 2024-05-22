import { DynamicModule, ModuleMetadata } from '@nestjs/common';
import {
  ControllersType,
  ExportsType,
  CreateModuleArgs,
  CreateTestModuleArgs,
  INestModuleFactory,
  ITestModule,
  ImportsType,
  ProvidersType,
} from './types';
import { TestModule } from './nest-test-module';

export class NestModuleFactory implements INestModuleFactory {
  private readonly metadata: ModuleMetadata;

  public constructor(metadata: ModuleMetadata) {
    this.metadata = metadata;
  }

  getImports(): ImportsType {
    return this.metadata.imports;
  }

  getControllers(): ControllersType {
    return this.metadata.controllers;
  }

  getProviders(): ProvidersType {
    return this.metadata.providers;
  }

  getExports(): ExportsType {
    return this.metadata.exports;
  }

  createModule({ classType, global }: CreateModuleArgs): DynamicModule {
    return {
      module: classType,
      global: !!global,
      imports: this.metadata.imports,
      controllers: this.metadata.controllers,
      providers: this.metadata.providers,
      exports: this.metadata.exports,
    };
  }

  createTestModule(args?: CreateTestModuleArgs): ITestModule {
    return new TestModule(this.metadata, args?.createMockFn);
  }
}
