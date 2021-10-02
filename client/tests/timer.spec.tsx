describe('timer tests', () => {
  const settingsNoAutoStarts = {
    pomo: 10,
    shortBreak: 5,
    longBreak: 8,
  };

  describe(`given a timer has not been run and has settings "${JSON.stringify(
    settingsNoAutoStarts
  )}"`, () => {
    describe('when the timer is started', () => {
      it.todo('should start counting down for 10 minutes');
      it.todo("should show the user hasn't completed any timers yet");
      it.todo('should invoke the onStartHooks with pomo argument');

      describe('when the timer is paused', () => {
        it.todo('should pause the timer');
        it.todo('should invoke the onPauseHooks with pomo argument');

        describe('when play is pressed', () => {
          it.todo('should resume the countdown');
          it.todo('should invoke the onResumeHooks with pomo argument');

          describe('when stop is pressed', () => {
            it.todo('should stop the timer and reset to 10 minutes');
            it.todo("should show the user hasn't completed any timers yet");
            it.todo('should invoke the onStopHooks with pomo argument');
          });
        });
      });
    });

    describe('when the pomo timer is started and finishes', () => {
      it.todo('should transition to the short timer but not start');
      it.todo('should show a single pomo timer has been completed');
      it.todo('should invoke the onCompleteHooks with pomo argument');
    });
  });

  describe('given 3/4 pomo timers have finished', () => {
    describe('when the 4th pomo timer finishes', () => {
      it.todo('should transition to the long break but not start');
      it.todo('should show 4 pomo timers have been completed');
      it.todo('should invoke the onCompleteHooks with pomo argument');

      describe('when the long break is started', () => {
        it.todo('should start counting down for 8 minutes');
        it.todo("should show the user hasn't completed any long breaks yet");
        it.todo('should invoke the onStartHooks with long break argument');

        describe('when the timer is paused', () => {
          it.todo('should pause the timer');
          it.todo('should invoke the onPauseHooks with long break argument');

          describe('when play is pressed', () => {
            it.todo('should resume the countdown');
            it.todo('should invoke the onResumeHooks with long break argument');

            describe('when stop is pressed', () => {
              it.todo('should stop the timer and transition to pomo timer');
              it.todo('should show the user has completed 1 long break');
              // TODO on stop hook for break
              it.todo('should invoke the onStopHooks with long break argument');
            });
          });
        });
      });

      describe('when the long break is started and finishes', () => {
        it.todo('should transition to the pomo timer but not start');
        it.todo('should show the user has completed 1 long break');
        // TODO on stop hook for break
        it.todo('should invoke the onCompleteHooks with long break argument');
      });
    });
  });

  describe('# auto start tests', () => {
    const settingsShortAutoStart = {};

    describe(`given a timer has not been run and has settings "${JSON.stringify(
      settingsShortAutoStart
    )}"`, () => {
      describe('when the pomo timer is started and finishes', () => {
        it.todo('should transition to the short timer and start immediately');
        it.todo('should show a single pomo timer has been completed');
        it.todo('should invoke the onCompleteHooks with pomo argument');
        it.todo('should invoke the onStartHooks with short break argument');

        describe('when the short break is paused', () => {
          it.todo('should pause the timer');
          it.todo('should invoke the onPauseHooks with short break argument');

          describe('when break is resumed', () => {
            it.todo('should continue the timer');
            it.todo('should invoke the onResumeHooks with short break argument');
          });

          describe('when the break is stopped', () => {
            it.todo('should stop the timer and display the pomo timer');
            // TODO: there is no difference between onStop and onComplete for a short break,
            // so need something more elegant to handle this to prevent dev error
            it.todo('should invoke the onStopHooks with short break argument');
          });
        });

        describe('when the short break finishes', () => {
          it.todo('should stop the timer and display the pomo timer');
          // TODO on stop hook for break
          it.todo('should invoke the onCompleteHooks with short break argument');
        });
      });
    });

    const settingsShortAndPomoAutoStart = {};

    describe(`given a timer has not be run and has settings "${JSON.stringify(
      settingsShortAndPomoAutoStart
    )}"`, () => {
      describe('when the pomo and short break timer finishes', () => {
        it.todo('should transition to the pomo timer and start immediately');
        it.todo('should invoke the onStartHooks with pomo argument');
      });
    });

    const settingsAllAutoStarts = {};

    describe(`given a timer has not be run and has settings "${JSON.stringify(
      settingsAllAutoStarts
    )}"`, () => {
      describe('when the final pomo timer before a long break finishes', () => {
        it.todo('should transition to the long break and start immediately');
        it.todo('should invoke the onStartHooks with long break argument');
      });
    });
  });
});
