document.addEventListener("DOMContentLoaded", function () {
    let clients = JSON.parse(localStorage.getItem("clients")) || [];
    let bloggers = JSON.parse(localStorage.getItem("bloggers")) || [];
    let advertisers = JSON.parse(localStorage.getItem("advertisers")) || [];
    let tableData = JSON.parse(localStorage.getItem("tableData")) || [];
    let bloggerCounter = 1;
    let editMode = false;

    const dataForm = document.getElementById('dataForm');
    const agencySelect = document.getElementById("agency");
    const ordSelect = document.getElementById("ord");
    const clientSelect = document.getElementById("client");
    const advertiserSelect = document.getElementById("advertiser");
    const addBloggerBtn = document.getElementById("addBloggerBtn");
    const removeBloggerBtn = document.getElementById("removeBloggerBtn");
    const agencyFilter = document.getElementById("agencyFilter");
    const clientFilter = document.getElementById("clientFilter");
    const exportExcelBtn = document.getElementById("exportExcelBtn");
    const editTableBtn = document.getElementById('editTableBtn');
    const table = document.getElementById('dataTable');

    // Центрирование кнопки "Добавить новую запись"
    if (addBloggerBtn) {
        addBloggerBtn.style.display = 'block';
        addBloggerBtn.style.margin = '0 auto';
    }

    // Инициализация режима редактирования таблицы
    if (editTableBtn) {
        editTableBtn.addEventListener('click', function () {
            editMode = !editMode;
            toggleEditMode(); // Включение/выключение режима редактирования
        });
    }

    function toggleEditMode() {
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const editableCells = row.querySelectorAll('td');

            editableCells.forEach(cell => {
                if (editMode) {
                    cell.setAttribute('contenteditable', 'true');
                } else {
                    cell.removeAttribute('contenteditable');
                }
            });
        });

        if (editMode) {
            editTableBtn.textContent = 'Сохранить изменения'; // Меняем текст кнопки
        } else {
            editTableBtn.textContent = 'Редактировать таблицу'; // Возвращаем исходный текст
            saveEditedData(); // Сохраняем изменения при выходе из режима редактирования
        }
    }

    // Функция для сохранения отредактированных данных
    function saveEditedData() {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            let entry = {
                agency: cells[0].innerText,
                ord: cells[1].innerText,
                project: cells[2].innerText,
                client: cells[3].innerText,
                contract: cells[4].innerText,
                actDetails: cells[5].innerText,
                income: cells[6].innerText,
                blogger: cells[7].innerText,
                expenseContract: cells[8].innerText,
                expenseAct: cells[9].innerText,
                bloggerFee: cells[10].innerText,
                token: cells[11].innerText,
                publicationLink: cells[12].innerText,
                removeUntil: cells[13].innerText,
                publicationDate: cells[14].innerText,
                advertiser: cells[15].innerText,
                initialContract: cells[16].innerText,
                nds: cells[17].innerText
            };
            tableData[index] = entry;
        });
        localStorage.setItem('tableData', JSON.stringify(tableData));
        renderTable(); // обновляем отображение таблицы после сохранения
    }

    // Добавляем блогера
    function addBloggerField() {
        bloggerCounter++;
        const newBloggerDiv = document.createElement("div");
        newBloggerDiv.classList.add("blogger-field-group");
        newBloggerDiv.id = `bloggerField_${bloggerCounter}`;

        newBloggerDiv.innerHTML = `
            <label for="blogger_${bloggerCounter}">Блогер:</label>
            <select id="blogger_${bloggerCounter}" name="blogger_${bloggerCounter}"></select>
            <label for="expenseContract_${bloggerCounter}">Реквизиты расходного договора:</label>
            <input type="text" id="expenseContract_${bloggerCounter}" name="expenseContract_${bloggerCounter}">
            <label for="expenseAct_${bloggerCounter}">Реквизиты расходного акта:</label>
            <input type="text" id="expenseAct_${bloggerCounter}" name="expenseAct_${bloggerCounter}">
            <label for="bloggerFee_${bloggerCounter}">Сумма услуг блогера:</label>
            <input type="text" id="bloggerFee_${bloggerCounter}" name="bloggerFee_${bloggerCounter}">
            <label for="token_${bloggerCounter}">Токен:</label>
            <input type="text" id="token_${bloggerCounter}" name="token_${bloggerCounter}">
            <label for="publicationLink_${bloggerCounter}">Ссылка на публикацию:</label>
            <input type="text" id="publicationLink_${bloggerCounter}" name="publicationLink_${bloggerCounter}">
            <label for="removeUntil_${bloggerCounter}">Не удалять до:</label>
            <input type="date" id="removeUntil_${bloggerCounter}" name="removeUntil_${bloggerCounter}">
            <label for="publicationDate_${bloggerCounter}">Дата публикации:</label>
            <input type="date" id="publicationDate_${bloggerCounter}" name="publicationDate_${bloggerCounter}">
        `;

        addBloggerBtn.parentNode.insertBefore(newBloggerDiv, addBloggerBtn);

        const newBloggerSelect = document.getElementById(`blogger_${bloggerCounter}`);
        if (newBloggerSelect) {
            loadSelectOptions(newBloggerSelect, bloggers);
        }

        if (bloggerCounter > 1 && removeBloggerBtn) {
            removeBloggerBtn.style.display = 'block';
        }
    }

    // Удаляем блогера
    function removeBloggerField() {
        if (bloggerCounter > 1) {
            const lastBloggerField = document.getElementById(`bloggerField_${bloggerCounter}`);
            if (lastBloggerField) {
                lastBloggerField.remove();
                bloggerCounter--;
            }

            if (bloggerCounter === 1 && removeBloggerBtn) {
                removeBloggerBtn.style.display = 'none';
            }
        }
    }

    function loadSelectOptions(selectElement, data) {
        if (!selectElement) return;
        selectElement.innerHTML = '';
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                let option = document.createElement("option");
                option.value = item.name;
                option.textContent = item.name;
                selectElement.appendChild(option);
            });
        } else {
            let defaultOption = document.createElement("option");
            defaultOption.textContent = "Нет данных";
            defaultOption.disabled = true;
            selectElement.appendChild(defaultOption);
        }
    }

    // Загружаем данные в выпадающие списки формы
    if (clientSelect) loadSelectOptions(clientSelect, clients);
    if (advertiserSelect) loadSelectOptions(advertiserSelect, advertisers);
    const bloggerSelect = document.getElementById('blogger_1');
    if (bloggerSelect) loadSelectOptions(bloggerSelect, bloggers);

    if (addBloggerBtn) {
        addBloggerBtn.addEventListener('click', function () {
            addBloggerField();
        });
    }

    if (removeBloggerBtn) {
        removeBloggerBtn.addEventListener('click', function () {
            removeBloggerField();
        });
    }

    // Обработчик формы для добавления данных в таблицу
    if (dataForm) {
        dataForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const agency = agencySelect.value;
            const ord = ordSelect.value;
            const project = document.getElementById('project').value;
            const client = clientSelect.value;
            const contract = document.getElementById('contract').value;
            const actDetails = document.getElementById('actDetails').value;
            const income = document.getElementById('income').value;
            const advertiser = advertiserSelect.value;
            const initialContract = document.getElementById('initialContract').value;
            const nds = document.getElementById('nds').value;

            let bloggersData = [];
            const bloggerFields = document.querySelectorAll('.blogger-field-group');
            bloggerFields.forEach((field, index) => {
                const blogger = document.getElementById(`blogger_${index + 1}`).value;
                const expenseContract = document.getElementById(`expenseContract_${index + 1}`).value;
                const expenseAct = document.getElementById(`expenseAct_${index + 1}`).value;
                const bloggerFee = document.getElementById(`bloggerFee_${index + 1}`).value;
                const token = document.getElementById(`token_${index + 1}`).value;
                const publicationLink = document.getElementById(`publicationLink_${index + 1}`).value;
                const removeUntil = document.getElementById(`removeUntil_${index + 1}`).value;
                const publicationDate = document.getElementById(`publicationDate_${index + 1}`).value;

                bloggersData.push({
                    blogger,
                    expenseContract,
                    expenseAct,
                    bloggerFee,
                    token,
                    publicationLink,
                    removeUntil,
                    publicationDate
                });
            });

            const newEntry = {
                agency,
                ord,
                project,
                client,
                contract,
                actDetails,
                income,
                bloggersData,
                advertiser,
                initialContract,
                nds,
            };

            tableData.push(newEntry);
            localStorage.setItem('tableData', JSON.stringify(tableData));
            alert('Данные успешно добавлены в реестр!');
            renderTable(); 
            updateFilters();
        });
    }

    // Рендер таблицы с учетом фильтров
    function renderTable() {
        const tableBody = document.querySelector("#dataTable tbody");
        tableBody.innerHTML = ""; 

        const filteredData = tableData.filter(entry => {
            const selectedAgency = agencyFilter.value;
            const selectedClient = clientFilter.value;

            return (selectedAgency === "" || entry.agency === selectedAgency) &&
                   (selectedClient === "" || entry.client === selectedClient);
        });

        filteredData.forEach((entry, index) => {
            const bloggersCount = entry.bloggersData.length;

            for (let i = 0; i < bloggersCount; i++) {
                let row = '<tr>';

                if (i === 0) {
                    row += `
                        <td rowspan="${bloggersCount}">${entry.agency}</td>
                        <td rowspan="${bloggersCount}">${entry.ord}</td>
                        <td rowspan="${bloggersCount}">${entry.project}</td>
                        <td rowspan="${bloggersCount}">${entry.client}</td>
                        <td rowspan="${bloggersCount}" contenteditable="true">${entry.contract}</td>
                        <td rowspan="${bloggersCount}" contenteditable="true">${entry.actDetails}</td>
                        <td rowspan="${bloggersCount}" contenteditable="true">${entry.income}</td>
                    `;
                }

                row += `
                    <td contenteditable="true">${entry.bloggersData[i].blogger}</td>
                    <td contenteditable="true">${entry.bloggersData[i].expenseContract}</td>
                    <td contenteditable="true">${entry.bloggersData[i].expenseAct}</td>
                    <td contenteditable="true">${entry.bloggersData[i].bloggerFee}</td>
                    <td contenteditable="true">${entry.bloggersData[i].token || ''}</td>
                    <td contenteditable="true">${entry.bloggersData[i].publicationLink || ''}</td>
                    <td contenteditable="true">${entry.bloggersData[i].removeUntil || ''}</td>
                    <td contenteditable="true">${entry.bloggersData[i].publicationDate || ''}</td>
                `;

                if (i === 0) {
                    row += `
                        <td rowspan="${bloggersCount}" contenteditable="true">${entry.advertiser}</td>
                        <td rowspan="${bloggersCount}" contenteditable="true">${entry.initialContract}</td>
                        <td rowspan="${bloggersCount}" contenteditable="true">${entry.nds}</td>
                        <td class="delete-cell" rowspan="${bloggersCount}"><button class="delete-btn" data-index="${index}">&#10006;</button></td>
                    `;
                }

                row += '</tr>';
                tableBody.insertAdjacentHTML('beforeend', row);
            }
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                tableData.splice(index, 1);
                localStorage.setItem('tableData', JSON.stringify(tableData)); 
                renderTable();
                updateFilters();
            });
        });
    }

    // Обновляем фильтры
    function updateFilters() {
        const agencySet = new Set(tableData.map(entry => entry.agency));
        const clientSet = new Set(tableData.map(entry => entry.client));

        agencyFilter.innerHTML = `<option value="">Все агентства</option>`;
        clientFilter.innerHTML = `<option value="">Все клиенты</option>`;

        agencySet.forEach(agency => {
            const option = document.createElement("option");
            option.value = agency;
            option.textContent = agency;
            agencyFilter.appendChild(option);
        });

        clientSet.forEach(client => {
            const option = document.createElement("option");
            option.value = client;
            option.textContent = client;
            clientFilter.appendChild(option);
        });
    }

    agencyFilter.addEventListener('change', renderTable);
    clientFilter.addEventListener('change', renderTable);

    // Выгрузка таблицы в Excel с учетом фильтров
    exportExcelBtn.addEventListener('click', function () {
        const filteredTable = document.createElement('table');
        filteredTable.innerHTML = document.getElementById('dataTable').innerHTML;

        const selectedAgency = agencyFilter.value;
        const selectedClient = clientFilter.value;

        Array.from(filteredTable.querySelectorAll('tbody tr')).forEach(row => {
            const agency = row.querySelector('td:nth-child(1)').innerText;
            const client = row.querySelector('td:nth-child(4)').innerText;
            if ((selectedAgency && agency !== selectedAgency) || (selectedClient && client !== selectedClient)) {
                row.remove();
            }
        });

        let workbook = XLSX.utils.table_to_book(filteredTable, { sheet: "Реестр ОРД" });
        XLSX.writeFile(workbook, 'reestr_ord_filtered.xlsx');
    });

    renderTable(); 
    updateFilters();
});