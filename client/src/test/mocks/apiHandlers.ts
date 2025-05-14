import { http, HttpResponse } from 'msw';
import { Patent } from '@entities/patent/model/types';
import { PatentType } from '@entities/patentType/model/types';
import { TechnologyField } from '@entities/technologyField/model/types';

const baseUrl = 'http://localhost:5000';

// Моковые данные
export const mockPatent: Patent = {
  id: 1,
  name: 'Test Patent',
  patentNumber: 'TEST123',
  dateOfRegistration: '2024-01-01',
  dateOfExpiration: '2024-12-31',
  contact: 'Test Contact',
  isPrivate: false,
  createdAt: '2024-01-01',
  patentLink: 'https://example.com/patent/123456',
  patentType: {
    id: 1,
    name: 'Test Patent Type'
  },
  technologyField: {
    id: 1,
    name: 'Test Technology Field'
  }
};

export const mockPatentType: PatentType = {
  id: 1,
  name: 'Test Patent Type'
};

export const mockTechnologyField: TechnologyField = {
  id: 1,
  name: 'Test Technology Field'
};

// Обработчики для патентов
export const patentHandlers = [
  http.get(`${baseUrl}/patent`, () => {
    return HttpResponse.json({
      patents: [mockPatent],
      totalPages: 1
    });
  }),

  http.get(`${baseUrl}/patent/search`, () => {
    return HttpResponse.json([mockPatent]);
  }),

  http.post(`${baseUrl}/patent`, async ({ request }) => {
    const formData = await request.formData();
    return HttpResponse.json({
      ...mockPatent,
      name: formData.get('name'),
      patentNumber: formData.get('patentNumber')
    });
  }),

  http.put(`${baseUrl}/patent/:id`, async ({ params, request }) => {
    const { id } = params;
    const data = await request.json() as Record<string, string>;
    return HttpResponse.json({
      ...mockPatent,
      id: Number(id),
      ...data
    });
  }),

  http.delete(`${baseUrl}/patent/:patentNumber`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.get(`${baseUrl}/files/:patentLink`, () => {
    return new HttpResponse(new Blob(['test content'], { type: 'application/pdf' }));
  })
];

// Обработчики для типов патентов
export const patentTypeHandlers = [
  http.get(`${baseUrl}/patent-type`, () => {
    return HttpResponse.json([mockPatentType]);
  }),

  http.get(`${baseUrl}/patent-type/deletable`, () => {
    return HttpResponse.json([mockPatentType]);
  }),

  http.post(`${baseUrl}/patent-type`, async ({ request }) => {
    const { name } = await request.json() as { name: string };
    return HttpResponse.json({
      ...mockPatentType,
      name
    });
  }),

  http.patch(`${baseUrl}/patent-type/:id`, async ({ params, request }) => {
    const { id } = params;
    const { name } = await request.json() as { name: string };
    return HttpResponse.json({
      ...mockPatentType,
      id: Number(id),
      name
    });
  }),

  http.delete(`${baseUrl}/patent-type/:id`, () => {
    return HttpResponse.json({ success: true });
  })
];

// Обработчики для технологических областей
export const technologyFieldHandlers = [
  http.get(`${baseUrl}/technology-field`, () => {
    return HttpResponse.json([mockTechnologyField]);
  }),

  http.get(`${baseUrl}/technology-field/deletable`, () => {
    return HttpResponse.json([mockTechnologyField]);
  }),

  http.post(`${baseUrl}/technology-field`, async ({ request }) => {
    const { name } = await request.json() as { name: string };
    return HttpResponse.json({
      ...mockTechnologyField,
      name
    });
  }),

  http.patch(`${baseUrl}/technology-field/:id`, async ({ params, request }) => {
    const { id } = params;
    const { name } = await request.json() as { name: string };
    return HttpResponse.json({
      ...mockTechnologyField,
      id: Number(id),
      name
    });
  }),

  http.delete(`${baseUrl}/technology-field/:id`, () => {
    return HttpResponse.json({ success: true });
  })
]; 