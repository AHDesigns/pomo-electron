import { Nodenv } from '@shared/asserts';
import * as constants from '@shared/constants';
import { ok, Result } from '@shared/Result';

export interface MetaRepo {
  nodenv(): Promise<Result<Nodenv>>;
  isProd(): Promise<Result<boolean>>;
  isTest(): Promise<Result<boolean>>;
  isDev(): Promise<Result<boolean>>;
  isIntegration(): Promise<Result<boolean>>;
}

export const metaRepo: MetaRepo = {
  async nodenv() {
    return Promise.resolve(ok(constants.nodenv));
  },
  async isProd() {
    return Promise.resolve(ok(constants.isProd));
  },
  async isTest() {
    return Promise.resolve(ok(constants.isTest));
  },
  async isDev() {
    return Promise.resolve(ok(constants.isDev));
  },
  async isIntegration() {
    return Promise.resolve(ok(constants.isIntegration));
  },
};
