import { ActorRef, EventObject } from 'xstate';
import { actorIds, Actors } from './constants';

/**
 *
 * @see https://github.com/davidkpiano/xstate/discussions/1591
 */
export function assertEventType<TE extends EventObject, TType extends TE['type']>(
  event: TE,
  eventType: TType
): asserts event is TE & { type: TType } {
  if (event.type !== eventType) {
    throw new Error(`Invalid event: expected "${eventType}", got "${event.type}"`);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function nullActor(overrides?: Partial<ActorRef<any, any>>): ActorRef<any, any> {
  return {
    id: 'null',
    send: () => {},
    subscribe: () => ({ unsubscribe: () => {} }),
    getSnapshot: () => {},
    [Symbol.observable]: () => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
    ...overrides,
  };
}

export function getActor<K extends keyof typeof actorIds>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  service: any,
  id: K
): Actors[K] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const actor = service.children.get(id) as Actors[K] | undefined;
  if (!actor) {
    throw new Error(
      `programmer error, "${id}" not found in machine. Actor refs found: "${Array.from(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
        service.children.keys()
      ).join(',')}"`
    );
  }
  return actor;
}
