import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { InstanceToken } from '@nestjs/core/injector/module';

const moduleMocker = new ModuleMocker(global);

const mockDependency = (token: InstanceToken) => {
  const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<
    any,
    any
  >;
  const Mock = moduleMocker.generateFromMetadata(mockMetadata);
  return new Mock();
};

export { mockDependency };
