import { DynamicModule, ModuleMetadata, Provider } from '@nestjs/common';
import { CreateMockType, ITestModule, OverrideProvidersArgs } from './types';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
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
    const imports = this.metadata.imports;

    const modulesProviders: Provider[][] = imports.map(
      (module: DynamicModule) => {
        return module.exports as Provider[];
      },
    );

    const providers: Provider[] = _.flatten<Provider[]>(modulesProviders);

    this.metadata.providers = this.metadata.providers.concat(providers);
    this.moduleRef = Test.createTestingModule(this.metadata);

    this.metadata.imports = undefined;

    this.moduleRef = Test.createTestingModule(this.metadata);

    await this.applyOverrideProviders(providers);
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
