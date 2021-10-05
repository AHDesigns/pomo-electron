import FakeTimers from '@sinonjs/fake-timers';

describe('timer play', () => {
  test('a normal timer takes the real amount of time to work', (done) => {
    const spy = jest.fn();

    function timer(): void {
      setTimeout(() => {
        spy();
      }, 1000);
    }

    // kick off timer
    timer();

    expect(spy).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
    }, 500);

    setTimeout(() => {
      expect(spy).toHaveBeenCalled();

      done();
    }, 1001);
  });

  test('a fake timer does not advance unless told to do so', (done) => {
    const spy = jest.fn();
    const clock = FakeTimers.createClock();

    function timer(): void {
      clock.setTimeout(() => {
        spy();
      }, 1000);
    }

    // kick off timer
    timer();

    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();

      done();
    }, 1001);
  });

  test('a fake timer can advance many timers', () => {
    const spy = jest.fn();
    const clock = FakeTimers.createClock();

    function timer(n: number): void {
      clock.setTimeout(() => {
        spy(n);
        timer(n + 1);
      }, 1000);
    }

    // kick off timer
    timer(1);

    // advance 60 seconds;
    clock.tick('01:00');
    expect(spy).toHaveBeenCalledTimes(60);
    expect(spy).toHaveBeenNthCalledWith(60, 60);
  }, 5);

  test('a fake timer advances quicker than real time', () => {
    const spy = jest.fn();
    const clock = FakeTimers.createClock();

    function timer(): void {
      clock.setTimeout(() => {
        spy();
      }, 1000);
    }

    // kick off timer
    timer();

    clock.tick(999);
    expect(spy).not.toHaveBeenCalled();

    clock.tick(1);
    expect(spy).toHaveBeenCalled();
  }, 5);

  test('promises (micro tasks) are called by the event loop before callbacks (macro tasks), even though the callback resolved first', (done) => {
    const spy = jest.fn();
    function taskFun(): void {
      setTimeout(() => {
        spy('y');
      }, 10);

      setImmediate(() => {
        spy('x');
      });

      Promise.resolve('foo')
        .then(() => {
          spy('a');
        })
        .then(() => {
          spy('b');
          Promise.resolve().then(() => {
            spy('c');
          });
        });

      spy('alpha');
    }

    taskFun();

    setTimeout(() => {
      expect(spy).toHaveBeenNthCalledWith(1, 'alpha');
      expect(spy).toHaveBeenNthCalledWith(2, 'a');
      expect(spy).toHaveBeenNthCalledWith(3, 'b');
      expect(spy).toHaveBeenNthCalledWith(4, 'c');
      expect(spy).toHaveBeenNthCalledWith(5, 'x');

      done();
    }, 100);
  });

  test('async/await (micro tasks) free up the event queue for (macro) tasks', (done) => {
    const spy = jest.fn();
    async function taskFun(): Promise<void> {
      setImmediate(() => {
        spy('y');
      });

      Promise.resolve().then(() => {
        spy('z');
      });

      await delay(5);

      spy('x');
    }

    taskFun();

    setTimeout(() => {
      expect(spy).toHaveBeenNthCalledWith(1, 'z');
      expect(spy).toHaveBeenNthCalledWith(2, 'y');
      expect(spy).toHaveBeenNthCalledWith(3, 'x');

      done();
    }, 10);
  });

  test('when the thread is blocked, promises jump the queue in front of callbacks', (done) => {
    const spy = jest.fn();
    async function taskFun(): Promise<void> {
      // immidiately added to the queue
      setImmediate(() => {
        spy('y');
      });

      await Promise.resolve();

      spy('x');
    }

    taskFun();

    setTimeout(() => {
      expect(spy).toHaveBeenNthCalledWith(1, 'x');
      expect(spy).toHaveBeenNthCalledWith(2, 'y');

      done();
    }, 10);
  });

  test('when the thread is blocked, promises jump the queue in front of callbacks', (done) => {
    const spy = jest.fn();
    async function taskFun(): Promise<void> {
      // immidiately added to the queue
      setImmediate(() => {
        spy('y');
      });

      await asyncBlock(5);

      spy('x');
    }

    taskFun();

    setTimeout(() => {
      expect(spy).toHaveBeenNthCalledWith(1, 'x');
      expect(spy).toHaveBeenNthCalledWith(2, 'y');

      done();
    }, 10);
  });

  test('sinon tickAsync lets promises resolve', async () => {
    const spy = jest.fn();
    const clock = FakeTimers.createClock();

    function timer(): void {
      clock.setTimeout(() => {
        spy('a');
        Promise.resolve().then(() => {
          spy('b');
        });
      }, 1000);
    }

    // kick off timer
    timer();

    clock.tick(999);
    expect(spy).not.toHaveBeenCalled();

    await clock.tickAsync(1);
    expect(spy).toHaveBeenNthCalledWith(1, 'a');
    expect(spy).toHaveBeenNthCalledWith(2, 'b');
  });

  test('when mocking global timers, a normal timer takes less time', () => {
    const spy = jest.fn();
    const clock = FakeTimers.withGlobal(global).install();

    function timer(): void {
      setTimeout(() => {
        spy();
      }, 1000);
    }

    // kick off timer
    timer();

    clock.tick(999);
    expect(spy).not.toHaveBeenCalled();

    clock.tick(1);
    expect(spy).toHaveBeenCalled();

    clock.uninstall();
  }, 5);

  test('after fake timers are reset, a normal timer takes the real amount of time to work', (done) => {
    const spy = jest.fn();
    const clock = FakeTimers.withGlobal(global).install();
    clock.uninstall();

    function timer(): void {
      setTimeout(() => {
        spy();
      }, 1000);
    }

    // kick off timer
    timer();

    expect(spy).not.toHaveBeenCalled();

    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
    }, 500);

    setTimeout(() => {
      expect(spy).toHaveBeenCalled();

      done();
    }, 1001);
  });
});

async function delay(duration = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, duration);
  });
}

function block(duration = 0): void {
  const d = new Date();
  const end = new Date(d.getTime() + duration);
  const endTime = end.getTime();
  while (endTime > Date.now()) {
    // blocking loop checking the time
  }
}

async function asyncBlock(duration = 0): Promise<void> {
  return new Promise((resolve) => {
    block(duration);
    resolve(undefined);
  });
}
