import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
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

  it('should include level in TSKV output', () => {
    logger.error('error message');
    const callArg = consoleErrorSpy.mock.calls[0][0];
    expect(callArg).toContain('level=error');
    expect(callArg).toContain('message=error message');
  });

  it('should include timestamp in TSKV output', () => {
    logger.log('message');
    const callArg = consoleLogSpy.mock.calls[0][0];
    expect(callArg).toMatch(/timestamp=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
  });

  it('should include optional parameters', () => {
    logger.log('message', 'param1', 'param2');
    const callArg = consoleLogSpy.mock.calls[0][0];
    expect(callArg).toContain('param0=param1');
    expect(callArg).toContain('param1=param2');
  });

  it('should handle error level with optional params', () => {
    logger.error('error message', 'extra', 123);
    expect(consoleErrorSpy).toHaveBeenCalled();
    const callArg = consoleErrorSpy.mock.calls[0][0];
    expect(callArg).toContain('level=error');
    expect(callArg).toContain('message=error message');
    expect(callArg).toContain('param0=extra');
    expect(callArg).toContain('param1=123');
  });

  it('should handle warn level', () => {
    logger.warn('warning message');
    expect(consoleWarnSpy).toHaveBeenCalled();
    const callArg = consoleWarnSpy.mock.calls[0][0];
    expect(callArg).toContain('level=warn');
    expect(callArg).toContain('message=warning message');
  });
});