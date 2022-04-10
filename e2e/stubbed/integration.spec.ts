// /* eslint-disable @typescript-eslint/await-thenable,@typescript-eslint/no-unsafe-call */
// import { app } from './init';

// describe('stubbed integration tests', () => {
//   beforeEach(async () => {
//     if (app.isRunning()) {
//       await app.restart();
//     } else {
//       await app.start();
//     }
//     // play around with this, but too fast (500) seemed to stop the window closing
//     // await app.client.setTimeout({ implicit: 1500 });
//   });

//   afterAll(async () => {
//     if (app.isRunning()) {
//       await app.stop();
//     }
//   });

//   it('opens an app with a visible window', async () => {
//     const title = await app.client.getTitle();

//     expect(title).toBe('Pancake');
//     expect(await app.browserWindow.isVisible()).toBe(true);
//     expect(await app.browserWindow.isClosable()).toBe(true);
//     // @ts-expect-error this is in the types - not sure what happened
//     expect(await app.browserWindow.isDevToolsOpened()).toBe(false);
//   });

//   it('logs the start up', async () => {
//     const logs = await app.client.getMainProcessLogs();
//     const log = logs.find((l) => l.includes('Logger initialised')) ?? '';
//     const [, payload] = log.split('initialised');
//     expect(JSON.parse(payload)).toStrictEqual(
//       expect.objectContaining({
//         env: 'production',
//         integration: true,
//         file: 'info',
//         console: 'info',
//       })
//     );
//   });

//   it('bridge event from client is logged by electron', async () => {
//     const button = await app.client.$('button=Test Button');
//     expect(await button.getText()).toBe('Test Button');
//     await button.click();
//     const logs = await app.client.getMainProcessLogs();
//     const [clickLog] = logs.reverse();
//     expect(clickLog).toContain('test message');
//   });
// });
