import { merge } from '@shared/merge';
import type { ShellRepository } from './shell';

export const fakeShell = (overrides?: Partial<ShellRepository>): ShellRepository =>
  merge(shellRepo, overrides);

const shellRepo: ShellRepository = {
  async openExternal(): Promise<void> {
    return Promise.resolve();
  },
};
