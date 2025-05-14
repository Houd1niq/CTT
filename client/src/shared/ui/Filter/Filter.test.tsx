import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '../../../test/utils';
import {Filter} from './Filter';
import {FilterType} from '@shared/types/common';

const mockOptions: FilterType[] = [
  {id: 1, name: 'Option 1'},
  {id: 2, name: 'Option 2'},
  {id: 3, name: 'Option 3'},
];

const mockDeletable: FilterType[] = [
  {id: 2, name: 'Option 2'},
];

describe('Filter', () => {
  it('renders with title', () => {
    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
      />
    );
    expect(screen.getByText('Test Filter')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
      />
    );

    mockOptions.forEach(option => {
      expect(screen.getByText(option.name)).toBeInTheDocument();
    });
  });

  it('handles option selection', () => {
    const handleSelect = vi.fn();
    const handleRemove = vi.fn();

    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={handleSelect}
        onRemove={handleRemove}
      />
    );

    const checkbox = screen.getByLabelText('Option 1');
    fireEvent.click(checkbox);
    expect(handleSelect).toHaveBeenCalledWith(1);

    fireEvent.click(checkbox);
    expect(handleRemove).toHaveBeenCalledWith(1);
  });

  it('shows action buttons when isActionVisible is true', () => {
    const handleAdd = vi.fn();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
        isActionVisible={true}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletable={mockDeletable}
      />
    );

    // Check if add button is present
    // const addButton = screen.getByRole('button', {name: /add/i});
    const addButton = screen.getByTestId('add');
    expect(addButton).toBeInTheDocument();

    // Check if edit and delete buttons are present for each option
    mockOptions.forEach(option => {
      // const editButton = screen.getByRole('button', { name: new RegExp(`edit ${option.name}`, 'i') });
      const editButton = screen.getByTestId(`edit-${option.id}`);
      expect(editButton).toBeInTheDocument();

      if (mockDeletable.find(item => item.id === option.id)) {
        // const deleteButton = screen.getByRole('button', { name: new RegExp(`delete ${option.name}`, 'i') });
        const deleteButton = screen.getByTestId(`delete-${option.id}`);
        expect(deleteButton).toBeInTheDocument();
      }
    });
  });

  it('handles add action', () => {
    const handleAdd = vi.fn();

    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
        isActionVisible={true}
        onAdd={handleAdd}
      />
    );

    // const addButton = screen.getByRole('button', {name: /add/i});
    const addButton = screen.getByTestId('add');
    fireEvent.click(addButton);
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it('handles edit action', () => {
    const handleEdit = vi.fn();

    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
        isActionVisible={true}
        onEdit={handleEdit}
      />
    );

    // const editButton = screen.getByRole('button', {name: /edit option 1/i});
    const editButton = screen.getByTestId('edit-1');
    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledWith('Option 1', 1);
  });

  it('handles delete action for deletable options', () => {
    const handleDelete = vi.fn();

    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
        isActionVisible={true}
        onDelete={handleDelete}
        deletable={mockDeletable}
      />
    );

    // Option 2 should be deletable
    const deleteButton = screen.getByTestId('delete-2');
    fireEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalledWith('Option 2', 2);

    // Option 1 should not be deletable
    expect(screen.queryByRole('button', {name: /delete option 1/i})).not.toBeInTheDocument();
  });

  it('does not show action buttons when isActionVisible is false', () => {
    render(
      <Filter
        title="Test Filter"
        options={mockOptions}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
        isActionVisible={false}
        onAdd={() => {
        }}
        onEdit={() => {
        }}
        onDelete={() => {
        }}
        deletable={mockDeletable}
      />
    );

    expect(screen.queryByRole('button', {name: /add/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /edit/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /delete/i})).not.toBeInTheDocument();
  });

  it('renders correctly with no options', () => {
    render(
      <Filter
        title="Test Filter"
        options={[]}
        onSelect={() => {
        }}
        onRemove={() => {
        }}
      />
    );

    expect(screen.getByText('Test Filter')).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
