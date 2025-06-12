import '@testing-library/jest-dom';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost'
});

(global as any).window = dom.window as unknown as Window & typeof globalThis;
(global as any).document = dom.window.document;
(global as any).navigator = {
  userAgent: 'node.js'
};