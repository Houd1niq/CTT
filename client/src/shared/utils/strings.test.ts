import {describe, it, expect} from 'vitest';
import {concatUrlWithQueryParams} from './strings';

describe('concatUrlWithQueryParams', () => {
  it('concatenates URL with single query parameter', () => {
    const url = 'https://api.example.com/patents';
    const params = {page: 1};

    expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents?page=1');
  });

  it('concatenates URL with multiple query parameters', () => {
    const url = 'https://api.example.com/patents';
    const params = {page: 1, limit: 10, sort: 'date'};

    expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents?page=1&limit=10&sort=date');
  });

  it('handles array parameters', () => {
    const url = 'https://api.example.com/patents';
    const params = {types: [1, 2, 3], status: 'active'};

    expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents?types=1,2,3&status=active');
  });

  it('ignores empty array parameters', () => {
    const url = 'https://api.example.com/patents';
    const params = {types: [], status: 'active'};

    expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents?status=active');
  });

  it('ignores falsy parameters', () => {
    const url = 'https://api.example.com/patents';
    const params = {page: 1, status: '', type: 0};

    expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents?page=1');
  });

  // it('handles URL with existing query parameters', () => {
  //   const url = 'https://api.example.com/patents?existing=true';
  //   const params = { page: 1 };
  //
  //   expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents?existing=true&page=1');
  // });
  //
  // it('returns original URL when no parameters provided', () => {
  //   const url = 'https://api.example.com/patents';
  //   const params = {};
  //
  //   expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents');
  // });

  it('handles URL with trailing slash', () => {
    const url = 'https://api.example.com/patents/';
    const params = {page: 1};

    expect(concatUrlWithQueryParams(url, params)).toBe('https://api.example.com/patents/?page=1');
  });
});
