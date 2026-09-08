import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should format message as JSON', () => {
    logger.log('test message');
    expect(consoleLogSpy).toHaveBeenCalled();
    const callArg = consoleLogSpy.mock.calls[0][0];
    expect(() => JSON.parse(callArg)).not.toThrow();
  });

  it('should include level in JSON output', () => {
    logger.error('error message');
    const callArg = consoleErrorSpy.mock.calls[0][0];
    const parsed = JSON.parse(callArg);
    expect(parsed.level).toBe('error');
  });

  it('should include timestamp in ISO format', () => {
    logger.warn('warning message');
    const callArg = consoleWarnSpy.mock.calls[0][0];
    const parsed = JSON.parse(callArg);
    expect(parsed.timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    );
  });

  it('should include optional parameters', () => {
    logger.log('message', 'param1', 'param2');
    const callArg = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(callArg);
    expect(parsed.optionalParams).toEqual(['param1', 'param2']);
  });

  it('should handle error level', () => {
    logger.error('error message', 'extra');
    expect(consoleErrorSpy).toHaveBeenCalled();
    const callArg = consoleErrorSpy.mock.calls[0][0];
    const parsed = JSON.parse(callArg);
    expect(parsed.level).toBe('error');
    expect(parsed.optionalParams).toEqual(['extra']);
  });

  it('should handle warn level', () => {
    logger.warn('warning message');
    expect(consoleWarnSpy).toHaveBeenCalled();
    const callArg = consoleWarnSpy.mock.calls[0][0];
    const parsed = JSON.parse(callArg);
    expect(parsed.level).toBe('warn');
  });
});
