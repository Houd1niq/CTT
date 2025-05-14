import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { Input } from './Input';

describe('Input', () => {
  it('renders with title', () => {
    render(<Input title="Test Input" name="test" />);
    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<Input title="Test Input" name="test" className="custom-class" />);
    expect(screen.getByLabelText('Test Input').parentElement).toHaveClass('custom-class');
  });

  it('handles user input', () => {
    const handleChange = vi.fn();
    render(<Input title="Test Input" name="test" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Test Input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('renders with different input types', () => {
    const { rerender } = render(<Input title="Text Input" name="text" type="text" />);
    expect(screen.getByLabelText('Text Input')).toHaveAttribute('type', 'text');

    rerender(<Input title="Email Input" name="email" type="email" />);
    expect(screen.getByLabelText('Email Input')).toHaveAttribute('type', 'email');

    rerender(<Input title="Password Input" name="password" type="password" />);
    expect(screen.getByLabelText('Password Input')).toHaveAttribute('type', 'password');
  });

  it('renders with placeholder', () => {
    render(<Input title="Test Input" name="test" placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with required attribute', () => {
    render(<Input title="Test Input" name="test" required />);
    expect(screen.getByLabelText('Test Input')).toBeRequired();
  });

  it('renders with disabled attribute', () => {
    render(<Input title="Test Input" name="test" disabled />);
    expect(screen.getByLabelText('Test Input')).toBeDisabled();
  });

  it('renders with value', () => {
    render(<Input title="Test Input" name="test" value="initial value" readOnly />);
    expect(screen.getByLabelText('Test Input')).toHaveValue('initial value');
  });

  it('forwards additional HTML input attributes', () => {
    render(
      <Input
        title="Test Input"
        name="test"
        minLength={3}
        maxLength={10}
        pattern="[A-Za-z]{3}"
        inputTitle="Only letters allowed"
      />
    );
    
    const input = screen.getByLabelText('Test Input');
    expect(input).toHaveAttribute('minLength', '3');
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('pattern', '[A-Za-z]{3}');
    expect(input).toHaveAttribute('title', 'Only letters allowed');
  });
}); 