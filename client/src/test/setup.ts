import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node'
import '@testing-library/jest-dom'
import * as matchers from '@testing-library/jest-dom/matchers';
import { handler } from '@mock/handler';

// Mock Server for test
export const server = setupServer(...handler);
// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);
// Start Server
beforeAll(() => {
  server.listen();
})
// Runs a cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Close Server
afterAll(() => {
  server.close();
})