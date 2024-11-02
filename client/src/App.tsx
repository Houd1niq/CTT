import React, {useEffect, useState} from 'react';
import './App.scss';

interface Patent {
    id: string;
    type: string;
    name: string;
    date: string;
    area: string;
    expirationDate?: string;
    contactPerson?: string;
    isPrivate?: boolean;
}

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
                                                       message,
                                                       type,
                                                       onClose,
                                                   }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <p>{message}</p>
        </div>
    );
};

const initialPatents: Patent[] = [
    {
        id: '2023685049',
        type: 'Программы для ЭВМ',
        name: 'Программа имитации работы режимов лабораторного макета',
        date: '22.11.2023',
        area: 'Робототехника, автоматика и управление',
    },
    {
        id: '2023685048',
        type: 'Программы для ЭВМ',
        name: 'Программа анализа производственных процессов',
        date: '18.10.2023',
        area: 'Автоматизация процессов',
    },
    {
        id: '2023685047',
        type: 'Программы для ЭВМ',
        name: 'Программа управления оборудованием',
        date: '05.09.2023',
        area: 'Промышленная автоматизация',
    },
    {
        id: '2023685046',
        type: 'Программы для ЭВМ',
        name: 'Программа для анализа данных в медицине',
        date: '12.08.2023',
        area: 'Медицинские технологии',
    },
    {
        id: '123',
        type: 'Программы для ЭВМ',
        name: 'Программа для анализа данных в медицине',
        date: '12.08.2023',
        area: 'Медицинские технологии',
    },
    {
        id: '1234',
        type: 'Программы для ЭВМ',
        name: 'Программа для анализа данных в медицине',
        date: '12.08.2023',
        area: 'Медицинские технологии',
    },
    {
        id: '12345',
        type: 'Программы для ЭВМ',
        name: 'Программа для анализа данных в медицине',
        date: '12.08.2023',
        area: 'Медицинские технологии',
    },
    {
        id: '123456',
        type: 'Программы для ЭВМ',
        name: 'Программа для анализа данных в медицине',
        date: '12.08.2023',
        area: 'Медицинские технологии',
    },
];

const Filter: React.FC<{ title: string; options: string[] }> = ({
                                                                    title,
                                                                    options,
                                                                }) => (
    <div className="filterSection">
        <div className="filterTitle">{title}</div>
        {options.map((option) => (
            <div className="filterOption" key={option}>
                <label>
                    <input type="checkbox"/>
                    <span>{option}</span>
                </label>
            </div>
        ))}
    </div>
);

const PatentCard: React.FC<
    Patent & {
    onDelete: (id: string, name: string) => void;
    onEdit: (patent: Patent) => void;
}
> = ({
         id,
         type,
         name,
         date,
         area,
         expirationDate,
         contactPerson,
         isPrivate,
         onDelete,
         onEdit,
     }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr.split('.').reverse().join('-'));
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <div className="card">
            <div className="cardContent">
                {[
                    {label: '№ патента/свидетельства', value: id},
                    {label: 'Вид', value: type},
                    {
                        label: 'Название',
                        value: name,
                    },
                    {label: 'Дата регистрации', value: formatDate(date)},
                    {label: 'Область техники', value: area},
                ].map(({label, value}) => (
                    <div className="cardRow" key={label}>
                        <span className="label">{label}</span>
                        <span className="value">{value}</span>
                    </div>
                ))}
            </div>
            <div className="buttonsCard">
                <div className="adminButtons">
                    <button
                        className="editButton"
                        onClick={() =>
                            onEdit({
                                id,
                                type,
                                name,
                                date,
                                area,
                                expirationDate,
                                contactPerson,
                                isPrivate,
                            })
                        }
                    >
                        Изменить
                    </button>
                    <button className="deleteButton" onClick={() => onDelete(id, name)}>
                        Удалить
                    </button>
                </div>
                <button className="moreButtonCard">Подробнее</button>
            </div>
        </div>
    );
};

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
                                                   totalPages,
                                                   currentPage,
                                                   onPageChange,
                                               }) => {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const createPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - 1 && i <= currentPage + 1)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    return (
        <div className="pagination">
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                ⬅
            </button>
            {createPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    className={currentPage === page ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                ⮕
            </button>
        </div>
    );
};

function App() {
    const [patents, setPatents] = useState<Patent[]>(initialPatents);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [patentToDelete, setPatentToDelete] = useState<Patent | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [patentDate, setPatentDate] = useState('');
    const [patentType, setPatentType] = useState('');
    const [patentName, setPatentName] = useState('');
    const [patentArea, setPatentArea] = useState('');
    const [patentId, setPatentId] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const itemsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(patents.length / itemsPerPage);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);
    const [patentToEdit, setPatentToEdit] = useState<Patent | null>(null);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);

    const handleInputChange = () => setIsFormDirty(true);

    const handleCloseOnOutsideClick = () => {
        handleCloseAddPopup();
    };

    const handleEditButtonClick = (patent: Patent) => {
        setPatentId(patent.id);
        setPatentType(patent.type);
        setPatentName(patent.name);
        setPatentDate(patent.date);
        setPatentArea(patent.area);
        setExpirationDate(patent.expirationDate || '');
        setContactPerson(patent.contactPerson || '');
        setIsPrivate(!!patent.isPrivate);
        setPatentToEdit(patent);
        setIsAddPopupOpen(true);
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({message, type});
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredPatents = patents.filter((patent) =>
        patent.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const currentPatents = filteredPatents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const sortPatents = (order: 'asc' | 'desc') => {
        return [...patents].sort((a, b) => {
            const dateA = new Date(a.date.split('.').reverse().join('-')).getTime();
            const dateB = new Date(b.date.split('.').reverse().join('-')).getTime();
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newOrder = event.target.value as 'asc' | 'desc';
        setSortOrder(newOrder);
        setPatents(sortPatents(newOrder));
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length) setFile(files[0]);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.length) setFile(event.target.files[0]);
    };

    const handleAddButtonClick = () => {
        setPatentToEdit(null);
        setIsPrivate(false);
        setIsAddPopupOpen(true);
    };
    const handleCloseAddPopup = (forceClose: boolean = false) => {
        if (!forceClose && isFormDirty) {
            const confirmClose = window.confirm(
                'Вы уверены, что хотите закрыть окно? Все несохраненные изменения будут потеряны.',
            );
            if (!confirmClose) return;
        }

        setPatentId('');
        setPatentType('');
        setPatentName('');
        setPatentDate('');
        setPatentArea('');
        setExpirationDate('');
        setContactPerson('');
        setFile(null);
        setPatentToEdit(null);
        setIsFormDirty(false);
        setIsAddPopupOpen(false);
    };

    const handleDeleteButtonClick = (id: string) => {
        const patentToRemove = patents.find((patent) => patent.id === id);
        if (patentToRemove) {
            setPatentToDelete(patentToRemove);
            setIsDeletePopupOpen(true);
        }
    };

    const handleCloseDeletePopup = () => {
        setPatentToDelete(null);
        setIsDeletePopupOpen(false);
    };

    const handleConfirmDelete = () => {
        if (patentToDelete) {
            setPatents(patents.filter((patent) => patent.id !== patentToDelete.id));
            handleCloseDeletePopup();
            showNotification('Патент успешно удален!', 'success');
        }
    };

    const handleAddPatent = (event: React.FormEvent) => {
        event.preventDefault();
        const updatedPatent: Patent = {
            id: patentId,
            type: patentType,
            name: patentName,
            date: patentDate,
            area: patentArea,
            expirationDate: expirationDate,
            contactPerson: contactPerson,
            isPrivate: isPrivate
        };

        if (patentToEdit) {
            setPatents(
                patents.map((pat) =>
                    pat.id === patentToEdit.id ? updatedPatent : pat
                ),
            );
            showNotification('Патент успешно обновлен!', 'success');
        } else {
            setPatents([...patents, updatedPatent]);
            showNotification('Патент успешно добавлен!', 'success');
        }

        handleCloseAddPopup(true);
    };


    useEffect(() => {
        const allPopups = isAddPopupOpen || isDeletePopupOpen;
        if (allPopups) {
            const scrollWidth =
                window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflowY = 'hidden';
            document.body.style.paddingRight = scrollWidth + 'px';
        } else {
            document.body.style.overflowY = 'auto';
            document.body.style.paddingRight = '0px';
        }
    }, [isAddPopupOpen, isDeletePopupOpen]);

    return (
        <div className="firstContainer">
            <div className="headerContainer">
                <div className="blueOverlay"></div>
                <img src="/image%204.png" alt="headerImage" className="image"/>
                <div className="transparentOverlay"></div>
                <img src="/image%202.png" alt="headerLogo" className="logo"/>
                <h1 className="title">
                    <span className="line1">Центр трансфера</span>
                    <span className="line2">технологий</span>
                </h1>
            </div>
            <div className="contentContainer">
                <div className="filterContainer">
                    <div className="filterHeading">Фильтрация</div>
                    <Filter
                        title="По видам"
                        options={[
                            'Определенный вид 1',
                            'Определенный вид 2',
                            'Определенный вид 3',
                            'Определенный вид 4',
                            'Определенный вид 5',
                            'Определенный вид 6',
                        ]}
                    />
                    <Filter
                        title="По области техники"
                        options={[
                            'Область техники 1',
                            'Область техники 2',
                            'Область техники 3',
                            'Область техники 4',
                            'Область техники 5',
                            'Область техники 6',
                        ]}
                    />
                </div>
                <div className="mainContainer">
                    <div className="moreSortContainer">
                        <div className="search">
                            <label className="searchLabel">Поиск</label>
                            <input
                                type="text"
                                className="searchInput"
                                placeholder="Введите для фильтрации"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="sortContainer">
                            <select
                                id="sortSelect"
                                value={sortOrder}
                                onChange={handleSortChange}
                            >
                                <option value="">Сортировать</option>
                                <option value="asc">По возрастанию даты регистрации</option>
                                <option value="desc">По убыванию даты регистрации</option>
                            </select>
                        </div>
                        <button className="addButton" onClick={handleAddButtonClick}>
                            Добавить
                        </button>
                    </div>
                    {currentPatents.map((patent) => (
                        <PatentCard
                            key={patent.id}
                            {...patent}
                            onDelete={handleDeleteButtonClick}
                            onEdit={handleEditButtonClick}
                        />
                    ))}
                </div>
            </div>
            <div className="pagination">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
            <div className="footerContainer">
                <footer className="footer">
                    <h3 className="footerTitle">Контакты</h3>
                    <div className="footerContacts">
                        <p>djasiasddasd</p>
                        <p>dasoijdioasdisajd</p>
                        <p>daskdsaodjsaid</p>
                    </div>
                </footer>
            </div>
            {isAddPopupOpen && (
                <div className="popupContainer" onClick={handleCloseOnOutsideClick}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleAddPatent}>
                            <div>
                                <label className="popupLabel">№ патента/свидетельства</label>
                                <input
                                    type="text"
                                    className="popupInput"
                                    value={patentId}
                                    required
                                    onChange={(e) => {
                                        setPatentId(e.target.value);
                                        handleInputChange();
                                    }}
                                />
                            </div>
                            <div>
                                <label className="popupLabel">Вид</label>
                                <input
                                    type="text"
                                    className="popupInput"
                                    value={patentType}
                                    required
                                    onChange={(e) => {
                                        setPatentType(e.target.value);
                                        handleInputChange();
                                    }}
                                />
                            </div>
                            <div>
                                <label className="popupLabel">Название</label>
                                <input
                                    type="text"
                                    className="popupInput"
                                    value={patentName}
                                    required
                                    onChange={(e) => {
                                        setPatentName(e.target.value);
                                        handleInputChange();
                                    }}
                                />
                            </div>
                            <div>
                                <label className="popupLabel">Дата регистрации</label>
                                <input
                                    type="date"
                                    className="popupInput"
                                    value={patentDate}
                                    required
                                    onChange={(e) => {
                                        setPatentDate(e.target.value);
                                        handleInputChange();
                                    }}
                                />
                            </div>
                            <div>
                                <label className="popupLabel">Область техники</label>
                                <input
                                    type="text"
                                    className="popupInput"
                                    value={patentArea}
                                    required
                                    onChange={(e) => {
                                        setPatentArea(e.target.value);
                                        handleInputChange();
                                    }}
                                />
                            </div>
                            <div>
                                <label className="popupLabel">Дата истечения патента</label>
                                <input
                                    type="date"
                                    className="popupInput"
                                    value={expirationDate}
                                    required
                                    onChange={(e) => {
                                        setExpirationDate(e.target.value);
                                        handleInputChange();
                                    }}
                                />
                            </div>
                            <div>
                                <label className="popupLabel">Контактное лицо</label>
                                <input
                                    type="text"
                                    className="popupInput"
                                    value={contactPerson}
                                    required
                                    onChange={(e) => {
                                        setContactPerson(e.target.value);
                                        handleInputChange();
                                    }}
                                />
                            </div>
                            <div>
                                <label className="checkboxPrivate">
                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={() => setIsPrivate(!isPrivate)}
                                    />
                                    Приватный
                                </label>
                            </div>
                            {!patentToEdit && (
                                <div
                                    className="fileUpload"
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <div className="fileUploadContent">
                                        <img
                                            src="../public/icons8-upload-file-48.png"
                                            alt="Upload Icon"
                                            className="uploadIcon"
                                        />
                                        <p className="uploadText">Перетащите файл сюда</p>
                                        <p className="orText">или</p>
                                        <label htmlFor="fileUpload" className="browseButton">
                                            Выберите файл
                                        </label>
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            className="fileInput"
                                            onChange={handleFileChange}
                                        />
                                        {file && <hr className="fileSeparator"/>}
                                        <div className="uploadedFileName">{file?.name}</div>
                                    </div>
                                </div>
                            )}
                            <div className="popupButtons">
                                <button
                                    type="button"
                                    className="closePopup"
                                    onClick={() => handleCloseAddPopup(false)}
                                >
                                    Закрыть
                                </button>
                                <button type="submit" className="popupSubmit">
                                    {patentToEdit ? 'Обновить патент' : 'Добавить патент'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isDeletePopupOpen && patentToDelete && (
                <div className="popupContainerDelete">
                    <div className="popupDelete">
                        <p>
                            Вы уверены, что хотите удалить патент "
                            <span className="patentName">{patentToDelete.name}</span>"?
                        </p>
                        <div className="popupButtonsDelete">
                            <button
                                className="confirmDeleteButton"
                                onClick={handleConfirmDelete}
                            >
                                Да
                            </button>
                            <button className="closeButton" onClick={handleCloseDeletePopup}>
                                Отменить
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}

export default App;
