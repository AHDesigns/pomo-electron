import { FakeIpcMain } from '@test/FakeIpcMain';
import { FakeIpcRenderer } from '@test/FakeIpcRenderer';

describe('fake ipc', () => {
  it('should send and receive messages from Renderer to Main', () => {
    const mockIpcMain = new FakeIpcMain();
    const mockIpcRenderer = new FakeIpcRenderer(mockIpcMain);

    const spy = jest.fn();
    mockIpcMain.on('foo', spy);

    mockIpcRenderer.send('fake-news', 'trump');
    mockIpcRenderer.send('foo', 'bacon');
    mockIpcRenderer.send('foo', 'cheese');

    // null here for now as we don't need the ipcMainEvent, and it can be null
    expect(spy).not.toHaveBeenCalledWith(null, 'trump');
    expect(spy).toHaveBeenCalledWith(null, 'bacon');
    expect(spy).toHaveBeenCalledWith(null, 'cheese');
  });

  it('should invoke and handle messages from Renderer to Main', async () => {
    const mockIpcMain = new FakeIpcMain();
    const mockIpcRenderer = new FakeIpcRenderer(mockIpcMain);

    mockIpcMain.handle('foo', async (_, msg) => Promise.resolve(`${msg as string} sandwich`));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: string = await mockIpcRenderer.invoke('foo', 'bacon');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result2: string = await mockIpcRenderer.invoke('foo', 'cheese');

    expect(result).toBe('bacon sandwich');
    expect(result2).toBe('cheese sandwich');
  });
});
