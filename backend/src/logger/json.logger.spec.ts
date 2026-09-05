import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
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
});
