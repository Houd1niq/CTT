declare global {
  function beforeAll(fn: () => Promise<void>): void;
  function afterAll(fn: () => Promise<void>): void;
  function beforeEach(fn: () => Promise<void>): void;
  function afterEach(fn: () => Promise<void>): void;
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => Promise<void>): void;
  function expect(value: any): any;
}

export {}; 