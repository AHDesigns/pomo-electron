import { act } from '@testing-library/react';

export function tick(duration: number) {
  act(() => {
    jest.advanceTimersByTime(duration * 1000);
  });
}
