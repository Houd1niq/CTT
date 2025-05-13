import type { Meta, StoryObj } from '@storybook/react';
import { FilterModal } from './FilterModal';

const meta: Meta<typeof FilterModal> = {
  title: 'Shared/FilterModal',
  component: FilterModal,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    title: { control: 'select', options: ['вид патента', 'область техники'] },
    contentToEdit: { control: 'object' },
  },
};
export default meta;
type Story = StoryObj<typeof FilterModal>;

export const Opened: Story = {
  args: {
    visible: true,
    title: 'вид патента',
    onClose: () => alert('Закрыть'),
    onSubmit: (arg: { id: number, name: string }) => alert(`Добавить ${arg.name}`),
  },
};

export const WithContentToEdit: Story = {
  args: {
    visible: true,
    title: 'область техники',
    contentToEdit: { id: 2, name: 'Техника' },
    onClose: () => alert('Закрыть'),
    onSubmit: (arg: { id: number, name: string }) => alert(`Изменить ${arg.name}`),
  },
};

export const Closed: Story = {
  args: {
    visible: false,
    title: 'вид патента',
    onClose: () => {},
    onSubmit: () => {},
  },
}; 