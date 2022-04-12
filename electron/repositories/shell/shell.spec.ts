import { shell } from 'electron';
import { shellRepository } from './shell';

jest.unmock('electron');

describe('shellRepository', () => {
  it('should be electrons shell instance', () => {
    expect(shellRepository).toBe(shell);
  });
});
