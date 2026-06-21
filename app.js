// БАЗА ДАНИХ ДЛЯ КНИГИ ГРАВЦЯ
const handbookData = {
    spells: [
        { name: "Вогняна куля (Fireball)", desc: "Клас: Маг/Чародій. Дистанція: 150 футів. Завдає 8d6 вогняної шкоди у радіусі 20 футів." },
        { name: "Магічна стріла (Magic Missile)", desc: "Клас: Маг. Створює три магічні стріли, які влучають АВТОМАТИЧНО і наносять 1d4+1 кожна." },
        { name: "Зцілення ран (Cure Wounds)", desc: "Клас: Жрець/Друїд. Торкання. Відновлює 1d8 + модифікатор характеристики." }
    ],
    items: [
        { name: "Довгий меч (Longsword)", desc: "Шкода: 1d8 колючої (1d10 дворучна). Властивість: Універсальне." },
        { name: "Зілля зцілення (Potion of Healing)", desc: "Відновлює 2d4 + 2 хітів при випиванні." },
        { name: "Латна броня (Plate Armor)", desc: "Важка броня. Клас Обладунку (AC): 18. Вимагає Силу 15. Поміха на Скритність." }
    ],
    rules: [
        { name: "Перевага / Поміха (Advantage/Disadvantage)", desc: "При перевазі кидаються два d20 і обирається НАЙВИЩЕ число. При помісі — НАЙНИЖЧЕ." },
        { name: "Короткий відпочинок (Short Rest)", desc: "Тривалість не менше 1 години. Дозволяє витратити Кості Хітів (Hit Dice) для лікування." },
        { name: "Критичний успіх/провал", desc: "20 на d20 — автоматичний успіх (подвійна шкода). 1 на d20 — критична невдача." }
    ]
};

let currentHandbookTab = 'spells';

// Перемикання Вхід/Реєстрація
function switchAuth(type) {
    document.querySelectorAll('.toggle-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    if (type === 'login') {
        document.getElementById('view-login').classList.add('active');
        document.getElementById('tab-login-btn').classList.add('active');
    } else {
        document.getElementById('view-register').classList.add('active');
        document.getElementById('tab-register-btn').classList.add('active');
    }
}

// Вхід у додаток
function enterApp() {
    document.getElementById('screen-auth').style.display = 'none';
    document.getElementById('screen-app').style.display = 'block';
    renderCharacters();
    renderSessions();
    renderHandbook();
}

// Навігація
function switchTab(tabName) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`sec-${tabName}`).classList.add('active');
    document.getElementById(`nav-${tabName}`).classList.add('active');
}

// Кубик d20
function rollD20() {
    const resultElement = document.getElementById('d20-res');
    let counter = 0;
    const interval = setInterval(() => {
        resultElement.innerText = Math.floor(Math.random() * 20) + 1;
        counter++;
        if (counter > 8) {
            clearInterval(interval);
            const finalRoll = Math.floor(Math.random() * 20) + 1;
            resultElement.innerText = finalRoll;
            if(finalRoll === 20) resultElement.style.color = 'var(--accent)';
            else if(finalRoll === 1) resultElement.style.color = 'var(--danger)';
            else resultElement.style.color = 'white';
        }
    }, 50);
}

// ПЕРСОНАЖІ
function getCharacters() {
    return JSON.parse(localStorage.getItem('dnd_characters')) || [];
}

// Зробимо функцію доступною глобально, щоб inline-події onclick її бачили
window.addCharacter = function() {
    const name = document.getElementById('char-name').value.trim();
    const race = document.getElementById('char-race').value.trim();
    const charClass = document.getElementById('char-class').value.trim();

    if (!name || !race || !charClass) {
        alert('Будь ласка, заповніть всі поля героя!');
        return;
    }

    const characters = getCharacters();
    characters.push({ id: Date.now(), name, race, class: charClass });
    localStorage.setItem('dnd_characters', JSON.stringify(characters));

    document.getElementById('char-name').value = '';
    document.getElementById('char-race').value = '';
    document.getElementById('char-class').value = '';

    renderCharacters();
}

window.deleteCharacter = function(id) {
    let characters = getCharacters();
    characters = characters.filter(c => c.id !== id);
    localStorage.setItem('dnd_characters', JSON.stringify(characters));
    renderCharacters();
}

function renderCharacters() {
    const listContainer = document.getElementById('characters-list');
    const characters = getCharacters();
    
    if (characters.length === 0) {
        listContainer.innerHTML = '<div style="color: var(--text-muted); text-align:center; font-style:italic;">Героїв поки немає. Створіть свого першого захисника вище!</div>';
        return;
    }

    listContainer.innerHTML = characters.map(c => `
        <div class="list-item">
            <h4>🛡️ ${c.name}</h4>
            <p>Раса: ${c.race} | Клас: ${c.class}</p>
            <button class="delete-btn" onclick="deleteCharacter(${c.id})">Видалити</button>
        </div>
    `).join('');
}

// СЕСІЇ ДМ
function getSessions() {
    return JSON.parse(localStorage.getItem('dnd_sessions')) || [];
}

window.addSession = function() {
    const title = document.getElementById('sess-title').value.trim();
    const notes = document.getElementById('sess-notes').value.trim();

    if (!title) {
        alert('Назва сесії є обов’язковою!');
        return;
    }

    const sessions = getSessions();
    const dateStr = new Date().toLocaleDateString('uk-UA');
    sessions.push({ id: Date.now(), title, notes, date: dateStr });
    localStorage.setItem('dnd_sessions', JSON.stringify(sessions));

    document.getElementById('sess-title').value = '';
    document.getElementById('sess-notes').value = '';

    renderSessions();
}

window.deleteSession = function(id) {
    let sessions = getSessions();
    sessions = sessions.filter(s => s.id !== id);
    localStorage.setItem('dnd_sessions', JSON.stringify(sessions));
    renderSessions();
}

function renderSessions() {
    const listContainer = document.getElementById('sessions-list');
    const sessions = getSessions();

    if (sessions.length === 0) {
        listContainer.innerHTML = '<div style="color: var(--text-muted); text-align:center; font-style:italic;">Жодної сесії не заплановано. Створіть гру як DM!</div>';
        return;
    }

    listContainer.innerHTML = sessions.map(s => `
        <div class="list-item">
            <h4>🐉 ${s.title}</h4>
            <p style="color: var(--accent); font-size:0.75rem;">Дата створення: ${s.date}</p>
            <p style="white-space: pre-wrap; margin-top:6px;">${s.notes || 'Без нотаток.'}</p>
            <button class="delete-btn" onclick="deleteSession(${s.id})">Закрити</button>
        </div>
    `).join('');
}

// КНИГА ГРАВЦЯ
window.switchHandbookTab = function(tab) {
    currentHandbookTab = tab;
    document.querySelectorAll('.hb-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(`hbt-${tab}`).classList.add('active');
    renderHandbook();
}

function renderHandbook(filterText = '') {
    const container = document.getElementById('handbook-results');
    const items = handbookData[currentHandbookTab];
    
    const filtered = items.filter(i => 
        i.name.toLowerCase().includes(filterText.toLowerCase()) || 
        i.desc.toLowerCase().includes(filterText.toLowerCase())
            );

            if (filtered.length === 0) {
                container.innerHTML = '<div style="color: var(--text-muted); text-align:center; padding: 20px;">Нічого не знайдено...</div>';
                return;
            }

            container.innerHTML = filtered.map(i => `
                <div class="card" style="background: var(--bg-nested); margin-bottom: 10px;">
                    <h4 style="color: var(--accent); margin-bottom: 4px;">${i.name}</h4>
                    <p style="font-size: 0.9rem; color: #e2e4eb; line-height: 1.4;">${i.desc}</p>
                </div>
            `).join('');
        }

window.searchHandbook = function() {
    const query = document.getElementById('hb-search').value;
    renderHandbook(query);
}
