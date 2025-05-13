import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Widgets/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Подвал сайта с контактной информацией'
      }
    }
  }
};

export const WithCustomClass: Story = {
  args: {
    className: 'custom-footer'
  },
  parameters: {
    docs: {
      description: {
        story: 'Подвал сайта с дополнительным CSS классом'
      }
    }
  }
}; 