import type {Meta, StoryObj} from '@storybook/react';
import {PatentCard} from './PatentCard';
import {Patent} from '@entities/patent/model/types';

const mockPatent: Patent = {
  id: 1,
  createdAt: '2024-03-20T10:00:00.000Z',
  patentNumber: 'RU123456',
  name: 'Способ получения наночастиц золота',
  dateOfRegistration: '2024-01-15',
  dateOfExpiration: '2034-01-15',
  contact: 'example@mail.ru',
  isPrivate: false,
  patentLink: 'patent.pdf',
  institute: {
    id: 1,
    name: 'Институт'
  },
  patentType: {
    id: 1,
    name: 'Изобретение'
  },
  technologyField: {
    id: 1,
    name: 'Нанотехнологии'
  }
};

const mockPrivatePatent: Patent = {
  ...mockPatent,
  id: 2,
  patentNumber: 'RU789012',
  name: 'Секретная технология',
  isPrivate: true
};

const meta: Meta<typeof PatentCard> = {
  title: 'Entities/PatentCard',
  component: PatentCard,
  tags: ['autodocs'],
  argTypes: {
    data: {control: 'object'},
    isActionsGranted: {control: 'boolean'},
    onDelete: {action: 'delete'},
    onEdit: {action: 'edit'}
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PatentCard>;

export const Default: Story = {
  args: {
    data: mockPatent,
    isActionsGranted: false,
    onDelete: (id: number, name: string) => alert(`Удалить патент ${name} (${id})`),
    onEdit: (patent: Patent) => alert(`Редактировать патент ${patent.name}`),
  },
};

export const WithActions: Story = {
  args: {
    data: mockPatent,
    isActionsGranted: true,
    onDelete: (id: number, name: string) => alert(`Удалить патент ${name} (${id})`),
    onEdit: (patent: Patent) => alert(`Редактировать патент ${patent.name}`),
  },
};

export const PrivatePatent: Story = {
  args: {
    data: mockPrivatePatent,
    isActionsGranted: true,
    onDelete: (id: number, name: string) => alert(`Удалить патент ${name} (${id})`),
    onEdit: (patent: Patent) => alert(`Редактировать патент ${patent.name}`),
  },
};
