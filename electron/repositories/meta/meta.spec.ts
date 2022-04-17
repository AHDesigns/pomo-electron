import { Nodenv } from '@shared/asserts';
import { ok } from '@shared/Result';
import { metaRepo, MetaRepo } from './meta';

interface ITest {
  method: keyof MetaRepo;
  response: Nodenv | boolean;
}

describe('metaRepo', () => {
  test.concurrent.each`
    method      | response
    ${'nodenv'} | ${'test'}
    ${'isProd'} | ${false}
    ${'isTest'} | ${true}
    ${'isDev'} | ${false}
    ${'isIntegration'} | ${false}
  `('method "$method" should return "$response"', async ({ method, response }: ITest) => {
    expect(await metaRepo[method]()).toMatchResult(ok(response));
  });
});
