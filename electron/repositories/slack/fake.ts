import { ok } from '@shared/Result';
import type { SlackRepository } from './slack';

export const fakeSlackRepository = (): SlackRepository => ({
  async slackEndSnooze() {
    return Promise.resolve(ok({ ok: true }));
  },
  async slackSetProfile() {
    return Promise.resolve(ok({ ok: true }));
  },
  async slackSetSnooze() {
    return Promise.resolve(ok({ ok: true }));
  },
  async slackSetPresence() {
    return Promise.resolve(ok({ ok: true }));
  },
});
