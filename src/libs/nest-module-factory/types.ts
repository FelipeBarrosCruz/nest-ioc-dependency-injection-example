import {
  Abstract,
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
import { TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { DeepMocked, MockOptions, PartialFuncReturn } from '@golevelup/ts-jest';

export type ImportType =
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference;

export type ImportsType = Array<ImportType>;

export type ControllerType = Type<any>;

export type ControllersType = ControllerType[];

export type ProvidersType = Provider[];

export type ExportsType = Array<
  | DynamicModule
  | Promise<DynamicModule>
  | string
  | symbol
  | Provider
  | ForwardReference
  | Abstract<any>
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function
>;

export type CreateMockType = <T extends object>(
  partial?: PartialFuncReturn<T>,
  options?: MockOptions,
) => DeepMocked<T>;

export type OverrideProvidersArgs = {
  exclude?: Provider[];
  include?: Provider[];
};

export type CreateModuleArgs = {
  classType: Type<any>;
  global?: boolean;
};

export type CreateTestModuleArgs = {
  createMockFn?: CreateMockType;
};

export interface ITestModule {
  addImport(imported: ImportType): ITestModule;
  addProvider(provider: Provider): ITestModule;
  addController(controller: ControllerType): ITestModule;
  getModuleRef(): TestingModuleBuilder;
  setupCreateMockFn(createMockFn: CreateMockType): ITestModule;
  setupProviders(args?: OverrideProvidersArgs): ITestModule;
  setupImports(): ITestModule;
  compile(): Promise<TestingModule>;
}

export interface INestModuleFactory {
  getImports: () => ImportsType;
  getControllers: () => ControllersType;
  getProviders: () => ProvidersType;
  getExports: () => ExportsType;
  createModule(args: CreateModuleArgs): DynamicModule;
  createTestModule(args?: CreateTestModuleArgs): ITestModule;
}
