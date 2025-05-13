import type { Meta, StoryObj } from '@storybook/react';
import { DeleteModal } from './DeleteModal';

const meta: Meta<typeof DeleteModal> = {
  title: 'Shared/DeleteModal',
  component: DeleteModal,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    name: { control: 'text' },
    title: { control: 'text' },
    identifier: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof DeleteModal>;

export const Opened: Story = {
  args: {
    visible: true,
    name: 'Патент 123',
    identifier: 1,
    title: 'Удалить патент',
    onClose: () => alert('Закрыть'),
    onSubmit: (identifier: any) => alert(`Удалить ${identifier}`),
  },
};

export const Closed: Story = {
  args: {
    visible: false,
    name: 'Патент 123',
    identifier: 1,
    title: 'Удалить патент',
    onClose: () => {},
    onSubmit: (identifier: any) => alert(`Удалить ${identifier}`),
  },
};

export const WithDifferentName: Story = {
  args: {
    visible: true,
    name: 'Документ X',
    identifier: 42,
    title: 'Удалить документ',
    onClose: () => alert('Закрыть'),
    onSubmit: (identifier: any) => alert(`Удалить ${identifier}`),
  },
}; 