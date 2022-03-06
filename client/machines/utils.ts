import { ActorRef, EventObject } from 'xstate';

// export type OptionsFromModel<A extends Model<any, any, any, any>> = Partial<
//   MachineOptions<ContextFrom<A>, EventFrom<A>, ModelActionsFrom<A>>
// >;

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
export const nullActor: ActorRef<any, any> = {
  id: 'null',
  send: () => {},
  subscribe: () => ({ unsubscribe: () => {} }),
  getSnapshot: () => {},
  [Symbol.observable]: () => ({
    subscribe: () => ({ unsubscribe: () => {} }),
  }),
};
