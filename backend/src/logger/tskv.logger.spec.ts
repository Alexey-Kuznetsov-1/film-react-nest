import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should format message as TSKV with tabs', () => {
    logger.log('test message');
    expect(consoleLogSpy).toHaveBeenCalled();
    const callArg = consoleLogSpy.mock.calls[0][0];
    expect(callArg).toContain('\t');
    expect(callArg).toContain('level=log');
    expect(callArg).toContain('message=test message');
  });
});
