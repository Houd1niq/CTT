import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '../../../test/utils';
import {Button} from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button onClick={() => {
    }}>Click me</Button>);
    expect(screen.getByRole('button', {name: /click me/i})).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button', {name: /click me/i}));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button onClick={() => {
    }} className="custom-class">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });
});
