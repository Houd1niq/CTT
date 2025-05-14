import {describe, it, expect, beforeAll, afterAll, afterEach} from 'vitest';
import {patentTypeApiSlice} from './patentTypeApiSlice';
import {PatentType} from '../model/types';
import {setupApiStore} from '@/test/utils/setupApiStore';
import {setupServer} from 'msw/node';
import {patentTypeHandlers, mockPatentType} from '@/test/mocks/apiHandlers';

const server = setupServer(...patentTypeHandlers);

describe('patentTypeApiSlice Integration Tests', () => {
  const store = setupApiStore([patentTypeApiSlice]);
  let testPatentType: PatentType;

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeAll(async () => {
    // Создаем тестовый тип патента
    const result = await store.dispatch(
      patentTypeApiSlice.endpoints.addPatentType.initiate({name: 'Test Patent Type'})
    );
    if ('data' in result) {
      testPatentType = result.data;
    }
  });

  afterAll(async () => {
    // Удаляем тестовый тип патента после всех тестов
    if (testPatentType) {
      await store.dispatch(
        patentTypeApiSlice.endpoints.deletePatentType.initiate(testPatentType.id)
      );
    }
  });

  describe('getPatentTypes', () => {
    it('should get all patent types', async () => {
      const result = await store.dispatch(
        patentTypeApiSlice.endpoints.getPatentTypes.initiate({})
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data[0]).toEqual(mockPatentType);
      }
    });
  });

  describe('getDeletablePatentTypes', () => {
    it('should get deletable patent types', async () => {
      const result = await store.dispatch(
        patentTypeApiSlice.endpoints.getDeletablePatentTypes.initiate()
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data[0]).toEqual(mockPatentType);
      }
    });
  });

  describe('addPatentType', () => {
    it('should create new patent type', async () => {
      const newPatentType = {
        name: 'New Patent Type'
      };

      const result = await store.dispatch(
        patentTypeApiSlice.endpoints.addPatentType.initiate(newPatentType)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data.name).toBe(newPatentType.name);
      }
    });
  });

  describe('editPatentType', () => {
    it('should edit existing patent type', async () => {
      const updatedData = {
        name: 'Updated Patent Type',
        id: mockPatentType.id
      };

      const result = await store.dispatch(
        patentTypeApiSlice.endpoints.editPatentType.initiate(updatedData)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data.name).toBe(updatedData.name);
      }
    });
  });

  describe('deletePatentType', () => {
    it('should delete patent type', async () => {
      const result = await store.dispatch(
        patentTypeApiSlice.endpoints.deletePatentType.initiate(mockPatentType.id)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data).toEqual({success: true});
      }
    });
  });
});
