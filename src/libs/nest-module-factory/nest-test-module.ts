import { DynamicModule, ModuleMetadata, Provider } from '@nestjs/common';
import {
  ControllerType,
  CreateMockType,
  ITestModule,
  ImportType,
  OverrideProvidersArgs,
} from './types';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import * as _ from 'lodash';

export class TestModule implements ITestModule {
  private metadata: ModuleMetadata;
  private moduleRef: TestingModuleBuilder;
  private overrideProviderArgs: OverrideProvidersArgs;
  private createMockFn: CreateMockType;
  private behaviorState = {
    imports: false,
    providers: false,
  };

  public constructor(metadata: ModuleMetadata, createMockFn?: CreateMockType) {
    this.metadata = metadata;
    this.createMockFn = createMockFn;
    this.createModuleRef();
  }

  private createModuleRef() {
    this.moduleRef = Test.createTestingModule(this.metadata);
  }

  private async loadDefaultCreateMockFn(): Promise<CreateMockType> {
    const library = await import('@golevelup/ts-jest');
    return library.createMock;
  }

  private async getCreateMockFn(): Promise<CreateMockType> {
    const defaultCreateMockFn = await this.loadDefaultCreateMockFn();
    return this.createMockFn ?? defaultCreateMockFn;
  }

  private getProvidersToOverride(): Provider[] {
    return this.metadata.providers
      .concat(this.overrideProviderArgs?.include)
      .filter(
        (provider: Provider) =>
          !this.overrideProviderArgs?.exclude?.includes(provider),
      );
  }

  private async applyOverrideProviders(providers: Provider[]) {
    const createMockFn = await this.getCreateMockFn();
    providers.forEach((provide: Provider) => {
      this.moduleRef
        .overrideProvider(provide)
        .useValue(createMockFn<typeof provide>());
    });
  }

  private async overrideProviders() {
    const providers = this.getProvidersToOverride();
    await this.applyOverrideProviders(providers);
  }

  private async overrideImports() {
    const exportedModuleProviders: Provider[] =
      this.metadata.imports?.reduce(
        (acc: Provider[], module: DynamicModule) => {
          return acc.concat(module.exports as Provider[]);
        },
        [] as Provider[],
      ) ?? [];

    for (const exportedModuleProvider of exportedModuleProviders) {
      this.addProvider(exportedModuleProvider);
    }

    this.metadata.imports = undefined;
    this.moduleRef = Test.createTestingModule(this.metadata);

    await this.applyOverrideProviders(exportedModuleProviders);
  }

  addProvider(provider: Provider): ITestModule {
    this.metadata.providers.push(provider);
    return this;
  }

  addController(controller: ControllerType): ITestModule {
    this.metadata.controllers.push(controller);
    return this;
  }

  addImport(importedModule: ImportType): ITestModule {
    this.metadata.imports.push(importedModule);
    return this;
  }

  setupCreateMockFn(createMockFn: CreateMockType): ITestModule {
    this.createMockFn = createMockFn;
    return this;
  }

  setupProviders(overrideProviderArgs?: OverrideProvidersArgs): ITestModule {
    this.overrideProviderArgs = overrideProviderArgs;
    this.behaviorState.providers = true;
    return this;
  }

  setupImports(): ITestModule {
    this.behaviorState.imports = true;
    return this;
  }

  getModuleRef(): TestingModuleBuilder {
    this.moduleRef = Test.createTestingModule(this.metadata);
    return this.moduleRef;
  }

  async compile(): Promise<TestingModule> {
    if (this.behaviorState.imports) {
      await this.overrideImports();
    }

    if (this.behaviorState.providers) {
      await this.overrideProviders();
    }

    return await this.moduleRef.compile();
  }
}
