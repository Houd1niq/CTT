import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { technologyFieldApiSlice } from './technologyFieldApiSlice';
import { TechnologyField } from '../model/types';
import { setupApiStore } from '@/test/utils/setupApiStore';
import { setupServer } from 'msw/node';
import { technologyFieldHandlers, mockTechnologyField } from '@/test/mocks/apiHandlers';

const server = setupServer(...technologyFieldHandlers);

describe('technologyFieldApiSlice Integration Tests', () => {
  const store = setupApiStore([technologyFieldApiSlice]);
  let testTechnologyField: TechnologyField;

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeAll(async () => {
    // Создаем тестовую технологическую область
    const result = await store.dispatch(
      technologyFieldApiSlice.endpoints.addTechnologyField.initiate({ name: 'Test Technology Field' })
    );
    if ('data' in result) {
      testTechnologyField = result.data;
    }
  });

  afterAll(async () => {
    // Удаляем тестовую технологическую область после всех тестов
    if (testTechnologyField) {
      await store.dispatch(
        technologyFieldApiSlice.endpoints.deleteTechnologyField.initiate(testTechnologyField.id)
      );
    }
  });

  describe('getTechnologyFields', () => {
    it('should get all technology fields', async () => {
      const result = await store.dispatch(
        technologyFieldApiSlice.endpoints.getTechnologyFields.initiate({})
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data[0]).toEqual(mockTechnologyField);
      }
    });
  });

  describe('getDeletableTechnologyFields', () => {
    it('should get deletable technology fields', async () => {
      const result = await store.dispatch(
        technologyFieldApiSlice.endpoints.getDeletableTechnologyFields.initiate()
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data[0]).toEqual(mockTechnologyField);
      }
    });
  });

  describe('addTechnologyField', () => {
    it('should create new technology field', async () => {
      const newTechnologyField = {
        name: 'New Technology Field'
      };

      const result = await store.dispatch(
        technologyFieldApiSlice.endpoints.addTechnologyField.initiate(newTechnologyField)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data.name).toBe(newTechnologyField.name);
      }
    });
  });

  describe('editTechnologyField', () => {
    it('should edit existing technology field', async () => {
      const updatedData = {
        name: 'Updated Technology Field',
        id: mockTechnologyField.id
      };

      const result = await store.dispatch(
        technologyFieldApiSlice.endpoints.editTechnologyField.initiate(updatedData)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data.name).toBe(updatedData.name);
      }
    });
  });

  describe('deleteTechnologyField', () => {
    it('should delete technology field', async () => {
      const result = await store.dispatch(
        technologyFieldApiSlice.endpoints.deleteTechnologyField.initiate(mockTechnologyField.id)
      );

      expect('data' in result).toBe(true);
      if ('data' in result && result.data) {
        expect(result.data).toEqual({ success: true });
      }
    });
  });
}); 