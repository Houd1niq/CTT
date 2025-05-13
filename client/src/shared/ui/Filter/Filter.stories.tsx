import type { Meta, StoryObj } from '@storybook/react';
import { Filter } from './Filter';
import { FilterType } from '@shared/types/common';

const options: FilterType[] = [
  { id: 1, name: 'Патенты' },
  { id: 2, name: 'Изобретения' },
  { id: 3, name: 'Полезные модели' },
];

const deletable: FilterType[] = [
  { id: 2, name: 'Изобретения' },
];

const meta: Meta<typeof Filter> = {
  title: 'Shared/Filter',
  component: Filter,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    options: { control: 'object' },
    isActionVisible: { control: 'boolean' },
    deletable: { control: 'object' },
  },
};
export default meta;
type Story = StoryObj<typeof Filter>;

export const Default: Story = {
  args: {
    title: 'Тип патента',
    options,
    onSelect: (id: number) => alert(`Выбрано: ${id}`),
    onRemove: (id: number) => alert(`Удалено: ${id}`),
  },
};

export const WithActions: Story = {
  args: {
    title: 'Тип патента',
    options,
    isActionVisible: true,
    onSelect: (id: number) => alert(`Выбрано: ${id}`),
    onRemove: (id: number) => alert(`Удалено: ${id}`),
    onAdd: () => alert('Добавить'),
    onEdit: (name: string, id: number) => alert(`Редактировать: ${name} (${id})`),
    onDelete: (name: string, id: number) => alert(`Удалить: ${name} (${id})`),
    deletable,
  },
};

export const NoOptions: Story = {
  args: {
    title: 'Тип патента',
    options: [],
    onSelect: () => {},
    onRemove: () => {},
  },
}; 