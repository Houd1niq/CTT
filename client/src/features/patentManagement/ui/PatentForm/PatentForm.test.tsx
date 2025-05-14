import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {PatentForm} from './PatentForm';

describe('PatentForm', () => {
  const mockTechnologyFields = [
    {id: 1, name: 'Информационные технологии'},
    {id: 2, name: 'Машиностроение'}
  ];

  const mockPatentTypes = [
    {id: 1, name: 'Изобретение'},
    {id: 2, name: 'Полезная модель'}
  ];

  const mockPatent = {
    id: 1,
    name: 'Test Patent',
    patentNumber: '123456',
    dateOfRegistration: '2024-01-01T00:00:00.000Z',
    dateOfExpiration: '2024-12-31T00:00:00.000Z',
    contact: 'Test Contact',
    isPrivate: false,
    technologyField: {id: 1, name: 'Информационные технологии'},
    patentType: {id: 1, name: 'Изобретение'},
    createdAt: '2024-01-01T00:00:00.000Z',
    patentLink: 'https://example.com/patent/123456'
  };

  const defaultProps = {
    formType: 'add' as const,
    onSubmit: vi.fn(),
    technologyFields: mockTechnologyFields,
    patentTypes: mockPatentTypes
  };

  const renderForm = (props = {}) => {
    return render(<PatentForm {...defaultProps} {...props} />);
  };

  it('renders form with all required fields', () => {
    renderForm();

    expect(screen.getByLabelText('№ патента/свидетельства')).toBeInTheDocument();
    expect(screen.getByLabelText('Вид')).toBeInTheDocument();
    expect(screen.getByLabelText('Название')).toBeInTheDocument();
    expect(screen.getByLabelText('Дата регистрации')).toBeInTheDocument();
    expect(screen.getByLabelText('Область техники')).toBeInTheDocument();
    expect(screen.getByLabelText('Дата истечения патента')).toBeInTheDocument();
    expect(screen.getByLabelText('Контактное лицо')).toBeInTheDocument();
    expect(screen.getByLabelText('Приватный')).toBeInTheDocument();
  });

  it('renders file upload section in add mode', () => {
    renderForm();

    expect(screen.getByText('Перетащите файл сюда')).toBeInTheDocument();
    expect(screen.getByText('или')).toBeInTheDocument();
    expect(screen.getByText('Выберите файл')).toBeInTheDocument();
  });

  it('does not render file upload section in edit mode', () => {
    renderForm({formType: 'edit', patent: mockPatent});

    expect(screen.queryByText('Перетащите файл сюда')).not.toBeInTheDocument();
    expect(screen.queryByText('или')).not.toBeInTheDocument();
    expect(screen.queryByText('Выберите файл')).not.toBeInTheDocument();
  });

  it('pre-fills form fields in edit mode', () => {
    renderForm({formType: 'edit', patent: mockPatent});

    expect(screen.getByLabelText('№ патента/свидетельства')).toHaveValue(mockPatent.patentNumber);
    expect(screen.getByLabelText('Название')).toHaveValue(mockPatent.name);
    expect(screen.getByLabelText('Контактное лицо')).toHaveValue(mockPatent.contact);
    expect(screen.getByLabelText('Приватный')).not.toBeChecked();
  });

  it('handles input changes correctly', () => {
    renderForm();

    const patentNumberInput = screen.getByLabelText('№ патента/свидетельства');
    fireEvent.change(patentNumberInput, {target: {value: '654321'}});
    expect(patentNumberInput).toHaveValue('654321');

    const nameInput = screen.getByLabelText('Название');
    fireEvent.change(nameInput, {target: {value: 'New Patent'}});
    expect(nameInput).toHaveValue('New Patent');

    const contactInput = screen.getByLabelText('Контактное лицо');
    fireEvent.change(contactInput, {target: {value: 'New Contact'}});
    expect(contactInput).toHaveValue('New Contact');
  });

  it('handles select changes correctly', () => {
    renderForm();

    const patentTypeSelect = screen.getByLabelText('Вид');
    fireEvent.change(patentTypeSelect, {target: {value: '2'}});
    expect(patentTypeSelect).toHaveValue('2');

    const technologyFieldSelect = screen.getByLabelText('Область техники');
    fireEvent.change(technologyFieldSelect, {target: {value: '2'}});
    expect(technologyFieldSelect).toHaveValue('2');
  });

  it('handles checkbox changes correctly', () => {
    renderForm();

    const privateCheckbox = screen.getByLabelText('Приватный');
    fireEvent.click(privateCheckbox);
    expect(privateCheckbox).toBeChecked();
  });

  it('handles file upload via input', () => {
    renderForm();

    const file = new File(['test content'], 'test.pdf', {type: 'application/pdf'});
    const fileInput = screen.getByLabelText('Выберите файл');

    fireEvent.change(fileInput, {target: {files: [file]}});

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('handles file drop', () => {
    renderForm();

    const file = new File(['test content'], 'test.pdf', {type: 'application/pdf'});
    const dropZone = screen.getByText('Перетащите файл сюда').parentElement!;

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file]
      }
    });

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('shows different submit button text based on form type', () => {
    const {rerender} = renderForm();
    expect(screen.getByText('Добавить патент')).toBeInTheDocument();

    rerender(<PatentForm {...defaultProps} formType="edit" patent={mockPatent}/>);
    expect(screen.getByText('Обновить патент')).toBeInTheDocument();
  });
});
