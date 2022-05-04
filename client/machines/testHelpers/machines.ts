import { createMachine } from 'xstate';
import { actorIds } from '../constants';

interface Parent<Machine, MachineArgs> {
  parentEvents: string[];
  childMachine: Machine;
  id: keyof typeof actorIds;
  args: MachineArgs;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parentMachine<B, A extends (arg: B) => any>({
  childMachine,
  parentEvents,
  args,
  id,
}: Parent<A, B>) {
  return createMachine(
    {
      id: 'parent',
      initial: 'running',
      states: {
        running: {
          on: Object.fromEntries(
            parentEvents.map((e) => [
              e,
              {
                actions: 'spy',
              },
            ])
          ),
          invoke: {
            id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            src: childMachine(args),
          },
        },
      },
    },
    {
      actions: {
        spy: () => {},
      },
    }
  );
}
