import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { FilterModal } from './FilterModal';

describe('FilterModal', () => {
  const defaultProps = {
    title: 'вид патента' as const,
    visible: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  it('does not render when visible is false', () => {
    render(<FilterModal {...defaultProps} visible={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with title when visible', () => {
    render(<FilterModal {...defaultProps} />);
    expect(screen.getByText('Введите вид патента')).toBeInTheDocument();
  });

  it('renders with different title', () => {
    render(<FilterModal {...defaultProps} title="область техники" />);
    expect(screen.getByText('Введите область техники')).toBeInTheDocument();
  });

  it('renders with content to edit', () => {
    const contentToEdit = { id: 1, name: 'Test Patent' };
    render(<FilterModal {...defaultProps} contentToEdit={contentToEdit} />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Test Patent');
  });

  it('handles input change', () => {
    render(<FilterModal {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Patent' } });
    
    expect(input).toHaveValue('New Patent');
  });

  it('calls onSubmit with correct data when adding new item', () => {
    render(<FilterModal {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Patent' } });
    
    const submitButton = screen.getByRole('button', { name: /добавить/i });
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      id: 0,
      name: 'New Patent'
    });
  });

  it('calls onSubmit with correct data when editing existing item', () => {
    const contentToEdit = { id: 1, name: 'Existing Patent' };
    render(<FilterModal {...defaultProps} contentToEdit={contentToEdit} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Updated Patent' } });
    
    const submitButton = screen.getByRole('button', { name: /добавить/i });
    fireEvent.click(submitButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith({
      id: 1,
      name: 'Updated Patent'
    });
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<FilterModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /отменить/i });
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with correct button text', () => {
    render(<FilterModal {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /добавить/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отменить/i })).toBeInTheDocument();
  });

  it('maintains input value between renders', () => {
    const { rerender } = render(<FilterModal {...defaultProps} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test Value' } });
    
    rerender(<FilterModal {...defaultProps} />);
    expect(input).toHaveValue('Test Value');
  });
}); 