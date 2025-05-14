import {describe, it, expect, beforeAll, afterAll, afterEach} from 'vitest';
import {patentsApiSlice} from './patentsApiSlice';
import {setupApiStore} from '@/test/utils/setupApiStore';
import {setupServer} from 'msw/node';
import {patentHandlers, mockPatent} from '@/test/mocks/apiHandlers';

const server = setupServer(...patentHandlers);

describe('patentsApiSlice Integration Tests', () => {
  const store = setupApiStore([patentsApiSlice]);

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('createPatent', () => {
    it('should create new patent', async () => {
      const formData = new FormData();
      formData.append('name', 'New Test Patent');
      formData.append('patentNumber', 'TEST456');
      formData.append('dateOfRegistration', '2024-01-01');
      formData.append('dateOfExpiration', '2024-12-31');
      formData.append('contact', 'Test Contact');
      formData.append('isPrivate', 'false');
      formData.append('technologyFieldId', '1');
      formData.append('patentTypeId', '1');

      const result = await store.dispatch(
        patentsApiSlice.endpoints.createPatent.initiate(formData)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data.name).toBe('New Test Patent');
        expect(result.data.patentNumber).toBe('TEST456');
      }
    });
  });

  describe('editPatent', () => {
    it('should edit existing patent', async () => {
      const updatedData = {
        name: 'Updated Test Patent',
        contact: 'Updated Contact'
      };

      const result = await store.dispatch(
        patentsApiSlice.endpoints.editPatent.initiate({
          data: updatedData,
          id: mockPatent.id
        })
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data.name).toBe(updatedData.name);
        expect(result.data.contact).toBe(updatedData.contact);
      }
    });
  });

  describe('deletePatent', () => {
    it('should delete patent', async () => {
      const result = await store.dispatch(
        patentsApiSlice.endpoints.deletePatent.initiate(mockPatent.patentNumber)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data).toEqual({success: true});
      }
    });
  });

  describe('searchPatents', () => {
    it('should search patents', async () => {
      const searchBody = {
        query: 'Test',
        page: 1,
        patentSort: 'asc'
      };

      const result = await store.dispatch(
        patentsApiSlice.endpoints.searchPatents.initiate(searchBody)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data[0]).toEqual(mockPatent);
      }
    });
  });

  describe('getPatents', () => {
    it('should get patents with pagination', async () => {
      const body = {
        page: 1,
        patentSort: 'asc'
      };

      const result = await store.dispatch(
        patentsApiSlice.endpoints.getPatents.initiate(body)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data.patents).toBeDefined();
        expect(Array.isArray(result.data.patents)).toBe(true);
        expect(result.data.patents[0]).toEqual(mockPatent);
        expect(result.data.totalPages).toBe(1);
      }
    });
  });
});
