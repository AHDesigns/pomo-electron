import T from '@client/copy';
import { displayNum } from '@shared/format';
import { screen } from './rtl';

interface Time {
  mins: number;
  secs?: number;
}

export const pageModel = {
  header: {
    h1: () => screen.getByRole('h1'),
    status: () => screen.getByText('Beta'),
  },
  nav: {
    toSettings: () => screen.getByRole('button', { name: 'settings' }),
    toTimer: () => screen.getByRole('button', { name: 'timer' }),
  },
  pomo: {
    title: () => screen.getByText('Pomodoro'),
    timer: {
      current: ({ mins, secs }: Time) =>
        !secs && secs !== 0
          ? screen.getByText(new RegExp(`${displayNum(mins)} : \\d\\d`))
          : screen.getByText(`${displayNum(mins)} : ${displayNum(secs)}`),
      startButton: () => screen.getByRole('button', { name: T.pomoTimer.start }),
      startButtonQuery: () => screen.queryByRole('button', { name: T.pomoTimer.start }),
      pauseButton: () => screen.getByRole('button', { name: T.pomoTimer.pause }),
      playButton: () => screen.getByRole('button', { name: T.pomoTimer.play }),
      stopButton: () => screen.getByRole('button', { name: T.pomoTimer.stop }),
    },
    records: {
      pomos: (count: number) => screen.getByText(`completed pomos: ${count}`),
      short: (count: number) => screen.getByText(`completed short breaks: ${count}`),
      long: (count: number) => screen.getByText(`completed breaks: ${count}`),
    },
  },
  settings: {
    title: () => screen.getByText('Settings'),
    timer: {
      pomo: () => screen.getByLabelText('Pomodoro'),
    },
  },
} as const;

interface TimeAndProgress extends Time {
  pomos: number;
  long: number;
}

export const assert = {
  timerAndProgress({ long, mins, pomos, secs }: TimeAndProgress): void {
    const { timer, records } = pageModel.pomo;
    expect(timer.current({ mins, secs })).toBeInTheDocument();
    expect(records.pomos(pomos)).toBeInTheDocument();
    expect(records.long(long)).toBeInTheDocument();
  },
};
