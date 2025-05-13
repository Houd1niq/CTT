import type {Meta, StoryObj} from '@storybook/react';
import {Input} from './Input';

const meta: Meta<typeof Input> = {
  title: 'Shared/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    title: {control: 'text'},
    value: {control: 'text'},
    type: {control: 'select', options: ['text', 'password', 'email', 'number']},
    placeholder: {control: 'text'},
    className: {control: 'text'},
    name: {control: 'text'},
  },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    name: 'name',
    value: '',
    type: 'text',
    onInput: () => {
    },
  },
};

export const WithLabel: Story = {
  args: {
    title: 'Имя',
    name: 'name',
    value: '',
    type: 'text',
    onInput: () => {
    },
  },
};

export const WithPlaceholder: Story = {
  args: {
    title: 'Email',
    name: 'email',
    value: '',
    type: 'email',
    placeholder: 'Введите email',
    onInput: () => {
    },
  },
};

export const Password: Story = {
  args: {
    title: 'Пароль',
    name: 'password',
    value: '',
    type: 'password',
    onInput: () => {
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    title: 'С кастомным классом',
    name: 'custom',
    value: '',
    className: 'my-custom-class',
    onInput: () => {
    },
  },
};
