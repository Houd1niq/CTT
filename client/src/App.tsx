import './App.scss';
import React, { useState } from 'react';

interface Patent {
    id: string;
    type: string;
    name: string;
    date: string;
    area: string;
}

function App() {
    const initialPatents: Patent[] = [
        { id: '2023685049', type: 'Программы для ЭВМ', name: 'Программа имитации работы режимов лабораторного макета...', date: '22.11.2023', area: 'Робототехника, автоматика и управление' },
        { id: '2023685048', type: 'Программы для ЭВМ', name: 'Программа анализа производственных процессов...', date: '18.10.2023', area: 'Автоматизация процессов' },
        { id: '2023685047', type: 'Программы для ЭВМ', name: 'Программа управления оборудованием...', date: '05.09.2023', area: 'Промышленная автоматизация' },
        { id: '2023685046', type: 'Программы для ЭВМ', name: 'Программа для анализа данных в медицине...', date: '12.08.2023', area: 'Медицинские технологии' },
    ];

    const [patents, setPatents] = useState<Patent[]>(initialPatents);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

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

    const PatentCard: React.FC<Patent> = ({ id, type, name, date, area }) => (
        <div className="card">
            <div className="cardContent">
                <div className="cardRow"><span className="label">№ патента/свидетельства</span><span className="value">{id}</span></div>
                <div className="cardRow"><span className="label">Вид</span><span className="value">{type}</span></div>
                <div className="cardRow"><span className="label">Название</span><span className="value">{name}</span></div>
                <div className="cardRow"><span className="label">Дата регистрации</span><span className="value">{date}</span></div>
                <div className="cardRow"><span className="label">Область техники</span><span className="value">{area}</span></div>
            </div>
            <div className="buttonsCard">
                <div className="adminButtons">
                    <button className="editButton">Изменить</button>
                    <button className="deleteButton">Удалить</button>
                </div>
                <button className="moreButtonCard">Подробнее</button>
            </div>
        </div>
    );

    return (
        <div className="firstContainer">
            <div className="headerContainer">
                <img src="/headerImage.png" alt="headerImage" className="image"/>
            </div>
            <div className="contentContainer">
                <div className="filterContainer">
                    <div className="filterHeading">Фильтрация</div>
                    <div className="filterSection">
                        <div className="filterTitle">По видам</div>
                        <div className="filterOption"><input type="checkbox"/><span>Определенный вид</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Определенный вид</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Определенный вид</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Определенный вид</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Определенный вид</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Определенный вид</span></div>
                    </div>
                    <div className="filterSection">
                        <div className="filterTitle">По области техники</div>
                        <div className="filterOption"><input type="checkbox"/><span>Область техники</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Область техники</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Область техники</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Область техники</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Область техники</span></div>
                        <div className="filterOption"><input type="checkbox"/><span>Область техники</span></div>
                    </div>
                </div>
                <div className="mainContainer">
                    <div className="moreSortContainer">
                        <div className="search">
                            <label className="searchLabel">Поиск</label>
                            <input type="text" className="searchInput" placeholder="Введите название патента"/>
                        </div>
                        <div className="sortContainer">
                            <select id="sortSelect" value={sortOrder} onChange={handleSortChange}>
                                <option value="">Сортировать</option>
                                <option value="asc">По возрастанию даты регистрации</option>
                                <option value="desc">По убыванию даты регистрации</option>
                            </select>
                        </div>
                        <div>
                            <button className="addButton">Добавить</button>
                        </div>
                    </div>
                    {patents.map((patent) => <PatentCard key={patent.id} {...patent} />)}
                </div>
            </div>
            <div className="pagination">
                <h1 className="paginationText"> ⬅ 1 2 3 ...10 ⮕ </h1>
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
        </div>
    );
}

export default App;