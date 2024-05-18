import { DynamicModule, ModuleMetadata, Provider } from '@nestjs/common';
import {
  ControllersType,
  CreateMockType,
  ExportsType,
  CreateModuleArgs,
  CreateTestModuleArgs,
  INestModuleFactory,
  ITestModule,
  ImportsType,
  OverrideProvidersArgs,
  ProvidersType,
} from './types';
import { Test, TestingModuleBuilder } from '@nestjs/testing';

class TestModule implements ITestModule {
  private readonly metadata: ModuleMetadata;
  private readonly moduleRef: TestingModuleBuilder;
  private createMockFn: CreateMockType;

  public constructor(metadata: ModuleMetadata, createMockFn?: CreateMockType) {
    this.metadata = metadata;
    this.moduleRef = Test.createTestingModule(this.metadata);
    this.createMockFn = createMockFn;
  }

  private async loadDefaultCreateMockFn(): Promise<CreateMockType> {
    const library = await import('@golevelup/ts-jest');
    return library.createMock;
  }

  private async getCreateMockFn(): Promise<CreateMockType> {
    return this.createMockFn ?? (await this.loadDefaultCreateMockFn());
  }

  private async getProvidersToOverride(args: OverrideProvidersArgs) {
    const createMockFn = await this.getCreateMockFn();

    return this.metadata.providers
      .concat(args.include)
      .filter((provider: Provider) => !args.exclude?.includes(provider))
      .map((provide: Provider) => ({
        provide,
        useValue: createMockFn<typeof provide>(),
      }));
  }

  async setupCreateMockFn(createMockFn: CreateMockType): Promise<ITestModule> {
    this.createMockFn = createMockFn;
    return this;
  }

  async setupProviders(args: OverrideProvidersArgs): Promise<ITestModule> {
    const providers = await this.getProvidersToOverride(args);

    providers.forEach(({ provide, useValue }) => {
      this.moduleRef.overrideProvider(provide).useValue(useValue);
    });

    return this;
  }

  get(): TestingModuleBuilder {
    return this.moduleRef;
  }
}

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
