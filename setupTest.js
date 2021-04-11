jest.setTimeout(30000);
jest.mock('redis', () => jest.requireActual('redis-mock'));

afterEach(() => {
  return jest.clearAllMocks();
});