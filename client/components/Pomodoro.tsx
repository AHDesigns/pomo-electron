// import React, { FC, useEffect, useRef, useState } from 'react';
// import { useActor, useInterpret, useMachine, useSelector } from '@xstate/react';
// import { useConfig } from '@client/contexts';
// import { pomodoroModel, HookInfo } from '@client/machines/timer/pomodoroModel';
// import { assertEventType } from '@client/machines/utils';

// export interface IPomo {
//   hooks: {
//     start: (info: HookInfo) => void;
//     tick: (info: HookInfo) => void;
//     pause: (info: HookInfo) => void;
//     play: (info: HookInfo) => void;
//     stop: (info: HookInfo) => void;
//   };
// }
//
export const Pomodoro = () => null;

// export const Pomodoro: FC<IPomo> = ({ hooks }) => {
//   const { config } = useConfig();

//   const service = useInterpret(
//     pomodoroMachine.withContext({
//       ...pomodoroModel.initialContext,
//       timers: config.timers,
//     }),
//     {
//       actions: {
//         onStartHooks: (_c, event) => {
//           assertEventType(event, 'start');
//           hooks.start({ ...event });
//         },
//         onTickHooks: (_c, event) => {
//           assertEventType(event, 'tick');
//           hooks.tick({ ...event });
//         },
//         onPauseHooks: (_c, event) => {
//           assertEventType(event, 'pause');
//           hooks.pause({ ...event });
//         },
//         onPlayHooks: (_c, event) => {
//           assertEventType(event, 'play');
//           hooks.play({ ...event });
//         },
//         onStopHooks: (_c, event) => {
//           assertEventType(event, 'stop');
//           hooks.stop({ ...event });
//         },
//       },
//     }
//   );

//   const timer = useSelector(
//     service,
//     (state) => state.context.pomodoro,
//     (prev, curr) => prev?.id === curr?.id
//   );
//   const { long, pomos } = useSelector(service, (state) => state.context.completed);
//   const value = useSelector(service, (state) => state.value);

//   return (
//     <>
//       {value}
//       <p>completed pomos: {pomos}</p>
//       <p>completed breaks: {long}</p>
//       <p>timer</p>
//       {timer && <Timer key={timer.id} timer={timer} />}
//     </>
//   );
// };

// const Timer: FC<{ timer: TimerActor }> = ({ timer }) => {
//   const [state, send] = useActor(timer);

//   const { mins, seconds } = state.context.timeLeft;

//   return (
//     <div>
//       <p>{state.value}</p>
//       <p>
//         {mins} : {seconds >= 10 ? seconds : `0${seconds}`}
//       </p>
//       <button type="button" onClick={() => send(timerModel.events.play())}>
//         start
//       </button>
//       <button type="button" onClick={() => send(timerModel.events.pause())}>
//         pause
//       </button>
//       <button type="button" onClick={() => send(timerModel.events.stop())}>
//         stop
//       </button>
//       <button type="button" onClick={() => send(timerModel.events.play())}>
//         play
//       </button>
//       <button type="button" onClick={() => send(timerModel.events.complete())}>
//         complete
//       </button>
//     </div>
//   );
// };
