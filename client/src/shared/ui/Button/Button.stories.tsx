import type {Meta, StoryObj} from '@storybook/react';
import {Button} from './Button';
import cls from './button.module.scss'

const meta: Meta<typeof Button> = {
  title: 'Shared/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    onClick: {action: 'clicked'},
    children: {control: 'text'},
    className: {control: 'text'}
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Кнопка',
    onClick: () => alert('Кнопка нажата')
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'Кнопка с классом',
    className: cls.customButton,
    onClick: () => alert('Кнопка с классом нажата')
  },
  parameters: {
    docs: {
      description: {
        story: 'Кнопка с дополнительным CSS классом'
      }
    }
  }
};
