import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../test/utils';
import { DeleteModal } from './DeleteModal';

describe('DeleteModal', () => {
  const defaultProps = {
    visible: true,
    name: 'Test Item',
    identifier: 1,
    title: 'Удалить элемент',
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  it('does not render when visible is false', () => {
    render(<DeleteModal {...defaultProps} visible={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not render when identifier is not provided', () => {
    render(<DeleteModal {...defaultProps} identifier={undefined} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with title and name when visible', () => {
    render(<DeleteModal {...defaultProps} />);
    
    expect(screen.getByText(/удалить элемент/i)).toBeInTheDocument();
    expect(screen.getByText(/test item/i)).toBeInTheDocument();
  });

  it('renders with different title and name', () => {
    render(
      <DeleteModal
        {...defaultProps}
        title="Удалить патент"
        name="Патент 123"
      />
    );
    
    expect(screen.getByText(/удалить патент/i)).toBeInTheDocument();
    expect(screen.getByText(/патент 123/i)).toBeInTheDocument();
  });

  it('calls onSubmit with identifier when confirm button is clicked', () => {
    render(<DeleteModal {...defaultProps} />);
    
    const confirmButton = screen.getByRole('button', { name: /да/i });
    fireEvent.click(confirmButton);
    
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(defaultProps.identifier);
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /отменить/i });
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with correct button text', () => {
    render(<DeleteModal {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /да/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /отменить/i })).toBeInTheDocument();
  });

  it('works with different identifier types', () => {
    const stringIdentifier = 'test-id';
    const { rerender } = render(
      <DeleteModal
        {...defaultProps}
        identifier={stringIdentifier}
      />
    );
    
    const confirmButton = screen.getByRole('button', { name: /да/i });
    fireEvent.click(confirmButton);
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(stringIdentifier);
    
    // Test with object identifier
    const objectIdentifier = { id: 1, type: 'test' };
    rerender(
      <DeleteModal
        {...defaultProps}
        identifier={objectIdentifier}
      />
    );
    
    fireEvent.click(confirmButton);
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(objectIdentifier);
  });

  it('applies correct styling to name in confirmation message', () => {
    render(<DeleteModal {...defaultProps} />);
    
    const nameElement = screen.getByText(defaultProps.name);
    expect(nameElement).toHaveClass('patentName');
  });
}); 