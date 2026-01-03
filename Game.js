// ============================================
// ПОСЛЕДНИЙ ДЕНЬ ЛЕТА - Игровая логика
// ============================================

// Состояние игры
const gameState = {
    currentScene: 'start',
    unlockedEndings: [],
    totalPlayTime: 0,
    currentDay: 1,
    currentTime: '10:00',
    gameStarted: false,
    textSpeed: 30, // мс на символ
    soundEnabled: true,
    autoSave: true
};

// DOM элементы
const elements = {
    sceneText: document.getElementById('sceneText'),
    characterName: document.getElementById('characterName'),
    choicesContainer: document.getElementById('choicesContainer'),
    background: document.getElementById('background'),
    progressFill: document.getElementById('progressFill'),
    dayCounter: document.getElementById('dayCounter'),
    timeCounter: document.getElementById('timeCounter'),
    endingsCounter: document.getElementById('endingsCounter'),
    typingIndicator: document.getElementById('typingIndicator'),
    
    // Кнопки
    menuBtn: document.getElementById('menuBtn'),
    saveBtn: document.getElementById('saveBtn'),
    restartBtn: document.getElementById('restartBtn'),
    achievementsBtn: document.getElementById('achievementsBtn'),
    
    // Оверлеи
    menuOverlay: document.getElementById('menuOverlay'),
    achievementsOverlay: document.getElementById('achievementsOverlay'),
    endingOverlay: document.getElementById('endingOverlay'),
    
    // Модалки
    continueBtn: document.getElementById('continueBtn'),
    newGameBtn: document.getElementById('newGameBtn'),
    closeAchievementsBtn: document.getElementById('closeAchievementsBtn'),
    achievementsGrid: document.getElementById('achievementsGrid'),
    
    // Концовка
    endingTitle: document.getElementById('endingTitle'),
    endingText: document.getElementById('endingText'),
    endingCounter: document.getElementById('endingCounter'),
    playTime: document.getElementById('playTime'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    shareEndingBtn: document.getElementById('shareEndingBtn')
};

// ИСТОРИЯ ИГРЫ
const story = {
    scenes: {
        start: {
            text: "Ты просыпаешься от яркого солнца, пробивающегося сквозь шторы. За окном поют птицы, а на столе тикает будильник: 10:00. Сегодня последний день летних каникул. Завтра — школа. Что будешь делать?",
            character: "Твои мысли",
            background: "morning",
            choices: [
                { text: "Позвонить друзьям, сходить на речку", next: "friends_river", time: "+1 час" },
                { text: "Помочь бабушке в саду", next: "grandma_garden", time: "+2 часа" },
                { text: "Остаться дома, поиграть в компьютер", next: "home_computer", time: "+3 часа" },
                { text: "Пригласить Машу погулять", next: "masha_walk", time: "+1 час" }
            ],
            music: "calm"
        },
        
        friends_river: {
            text: "Твои друзья, как всегда, рады тебе видеть. Солнце палит нещадно, вода в речке прохладная и чистая. Вдруг ты замечаешь, как маленький мальчик слишком далеко заплыл и начал тонуть. Его крики слышны только тебе.",
            character: "У речки",
            background: "river",
            choices: [
                { text: "Броситься в воду спасать", next: "hero_rescue", time: "+30 мин" },
                { text: "Кричать, звать на помощь взрослых", next: "call_help", time: "+15 мин" },
                { text: "Позвонить в спасательную службу", next: "call_rescue", time: "+20 мин" },
                { text: "Подумать, что он, наверное, шутит", next: "ignore_boy", time: "+5 мин" }
            ],
            music: "tense"
        },
        
        grandma_garden: {
            text: "Бабушка встречает тебя с улыбкой. 'Внучек, как раз вовремя! Поможешь старухе собрать яблоки?' Солнце припекает, пчелы жужжат, а в воздухе витает запах спелых фруктов.",
            character: "Бабушкин сад",
            background: "garden",
            choices: [
                { text: "С радостью помочь бабушке", next: "help_grandma", time: "+2 часа" },
                { text: "Попросить денег за помощь", next: "ask_money", time: "+1 час" },
                { text: "Сделать вид, что помогаешь", next: "pretend_help", time: "+30 мин" },
                { text: "Отказаться и уйти", next: "refuse_grandma", time: "+5 мин" }
            ],
            music: "peaceful"
        },
        
        home_computer: {
            text: "Ты запускаешь свою любимую игру. На часах 10:15, впереди целый день. Вдруг в окно стучит камень — это твой друг Коля. 'Выходи, сидишь тут как овощ!'",
            character: "Дома",
            background: "room",
            choices: [
                { text: "Игнорировать и продолжать играть", next: "keep_playing", time: "+4 часа" },
                { text: "Выйти к Коле", next: "go_kolya", time: "+1 час" },
                { text: "Пригласить Колю поиграть вместе", next: "invite_kolya", time: "+2 часа" },
                { text: "Выключить комп и заняться уроками", next: "do_homework", time: "+3 часа" }
            ],
            music: "neutral"
        },
        
        masha_walk: {
            text: "Маша согласилась погулять. Вы идете в парк, разговариваете о лете, школе, планах. Вдруг она останавливается и серьезно смотрит на тебя: 'Мне нужно тебе кое-что сказать...'",
            character: "Парк с Машей",
            background: "park",
            choices: [
                { text: "Внимательно выслушать", next: "listen_masha", time: "+1 час" },
                { text: "Пошутить, чтобы разрядить обстановку", next: "joke_masha", time: "+30 мин" },
                { text: "Перевести тему", next: "change_topic", time: "+20 мин" },
                { text: "Признаться, что ты тоже её любишь", next: "confess_love", time: "+2 часа" }
            ],
            music: "romantic"
        },
        
        // КОНЦОВКИ
        hero_rescue: {
            text: "Ты бросился в воду и спас мальчика. Его родители были в шоке и бесконечно благодарны. На следующий день в школе все обсуждали твой поступок. Ты почувствовал себя героем, но... так и не успел насладиться последним днем лета.",
            character: "Конец",
            background: "sunset",
            isEnding: true,
            endingName: "Спасатель",
            endingIcon: "🦸",
            achievement: "Герой дня"
        },
        
        ignore_boy: {
            text: "Ты решил, что мальчик просто шутит. Через час стало известно, что ребенок утонул. Ты всю жизнь будешь помнить его крики и винить себя. Последний день лета стал самым страшным днем в твоей жизни.",
            character: "Трагический конец",
            background: "night",
            isEnding: true,
            endingName: "Равнодушие",
            endingIcon: "😔",
            achievement: "Грустный финал"
        },
        
        help_grandma: {
            text: "Ты провел день с бабушкой, собрали весь урожай. Вечером она напекла пирогов с яблоками и рассказала истории из своей молодости. Ты понял, что это был лучший день лета — наполненный теплом, заботой и семейным уютом.",
            character: "Теплый конец",
            background: "evening",
            isEnding: true,
            endingName: "Семейные ценности",
            endingIcon: "👵❤️",
            achievement: "Хороший внук"
        },
        
        refuse_grandma: {
            text: "Бабушка смотрела тебе вслед с грустью в глазах. Ты пошел гулять, но удовольствия не получил. Вечером мама сообщила, что бабушке стало плохо. Тебе было стыдно, но изменить уже ничего нельзя.",
            character: "Грустный конец",
            background: "evening",
            isEnding: true,
            endingName: "Сожаление",
            endingIcon: "😢",
            achievement: "Упущенный шанс"
        },
        
        keep_playing: {
            text: "Ты проиграл 8 часов подряд. Когда выключил компьютер, было уже темно. Голова болела, глаза устали. Лето закончилось, а ты даже не заметил. Впереди только школа и сожаления о потраченном впустую времени.",
            character: "Одиночество",
            background: "night",
            isEnding: true,
            endingName: "Запустение",
            endingIcon: "🎮",
            achievement: "Геймер"
        },
        
        confess_love: {
            text: "Оказалось, Маша тоже давно к тебе неравнодушна. Вы гуляли до самого вечера, держась за руки. Последний день лета стал первым днем вашей любви. Школа теперь не казалась такой страшной — ведь вы будете там вместе.",
            character: "Счастливый конец",
            background: "sunset",
            isEnding: true,
            endingName: "Первая любовь",
            endingIcon: "💑",
            achievement: "Романтик"
        }
    },
    
    achievements: [
        { id: "hero", title: "Спасатель", description: "Спасти тонущего ребенка", icon: "🦸", unlocked: false },
        { id: "grandson", title: "Хороший внук", description: "Помочь бабушке весь день", icon: "👵❤️", unlocked: false },
        { id: "gamer", title: "Геймер", description: "Провести весь день за игрой", icon: "🎮", unlocked: false },
        { id: "romantic", title: "Романтик", description: "Встретить первую любовь", icon: "💑", unlocked: false },
        { id: "regret", title: "Сожаление", description: "Упустить важный момент", icon: "😢", unlocked: false },
        { id: "collector", title: "Коллекционер", description: "Открыть все концовки", icon: "🏆", unlocked: false }
    ]
};

// Инициализация игры
function initGame() {
    loadGameState();
    setupEventListeners();
    showScene(gameState.currentScene);
    updateUI();
    
    // Старт таймера игрового времени
    setInterval(() => {
        gameState.totalPlayTime++;
        if (gameState.autoSave) saveGameState();
    }, 60000); // каждую минуту
}

// Загрузка состояния игры
function loadGameState() {
    const saved = localStorage.getItem('lastDayOfSummer');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(gameState, data);
        console.log('Игра загружена:', data);
    }
}

// Сохранение состояния игры
function saveGameState() {
    localStorage.setItem('lastDayOfSummer', JSON.stringify(gameState));
    console.log('Игра сохранена');
    
    // Визуальная обратная связь
    elements.saveBtn.textContent = '✓';
    setTimeout(() => {
        elements.saveBtn.textContent = '💾';
    }, 1000);
}

// Показать сцену
async function showScene(sceneId) {
    const scene = story.scenes[sceneId];
    if (!scene) {
        console.error('Сцена не найдена:', sceneId);
        return;
    }
    
    // Обновляем состояние
    gameState.currentScene = sceneId;
    gameState.gameStarted = true;
    
    // Очищаем выбор
    elements.choicesContainer.innerHTML = '';
    
    // Обновляем фон
    updateBackground(scene.background);
    
    // Обновляем персонажа
    elements.characterName.textContent = scene.character || '';
    
    // Печатаем текст с эффектом
    await typeText(scene.text, elements.sceneText);
    
    // Если это концовка
    if (scene.isEnding) {
        setTimeout(() => showEnding(scene), 1500);
        return;
    }
    
    // Показываем варианты выбора
    showChoices(scene.choices);
    
    // Сохраняем
    if (gameState.autoSave) saveGameState();
}

// Эффект печати текста
function typeText(text, element) {
    return new Promise(resolve => {
        element.textContent = '';
        let i = 0;
        
        // Показываем индикатор
        elements.typingIndicator.style.opacity = '1';
        
        function typeChar() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                
                // Случайная скорость для естественности
                const speed = gameState.textSpeed + Math.random() * 20;
                setTimeout(typeChar, speed);
            } else {
                // Скрываем индикатор
                elements.typingIndicator.style.opacity = '0';
                resolve();
            }
        }
        
        typeChar();
    });
}

// Показать варианты выбора
function showChoices(choices) {
    elements.choicesContainer.innerHTML = '';
    
    choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = choice.text;
        
        // Добавляем время, если есть
        if (choice.time) {
            const timeSpan = document.createElement('span');
            timeSpan.className = 'choice-time';
            timeSpan.textContent = choice.time;
            timeSpan.style.cssText = `
                display: block;
                font-size: 14px;
                color: #94a3b8;
                margin-top: 5px;
            `;
            button.appendChild(timeSpan);
        }
        
        button.addEventListener('click', () => {
            // Обновляем время
            if (choice.time) {
                updateTime(choice.time);
            }
            
            // Переходим к следующей сцене
            showScene(choice.next);
        });
        
        elements.choicesContainer.appendChild(button);
    });
}

// Обновить фон
function updateBackground(bgName) {
    const backgrounds = {
        morning: 'linear-gradient(135deg, #ffd89b, #19547b)',
        river: 'linear-gradient(135deg, #4facfe, #00f2fe)',
        garden: 'linear-gradient(135deg, #a8ff78, #78ffd6)',
        room: 'linear-gradient(135deg, #8e9eab, #eef2f3)',
        park: 'linear-gradient(135deg, #9be15d, #00e3ae)',
        sunset: 'linear-gradient(135deg, #fa709a, #fee140)',
        evening: 'linear-gradient(135deg, #a18cd1, #fbc2eb)',
        night: 'linear-gradient(135deg, #0c0c0c, #434343)'
    };
    
    elements.background.style.background = backgrounds[bgName] || backgrounds.morning;
}

// Обновить время
function updateTime(timeAdd) {
    // Простая имитация времени
    const times = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
    const currentIndex = times.indexOf(gameState.currentTime);
    
    if (currentIndex !== -1 && currentIndex < times.length - 1) {
        gameState.currentTime = times[currentIndex + 1];
        elements.timeCounter.textContent = gameState.currentTime;
        
        // Обновляем прогресс
        const progress = ((currentIndex + 1) / (times.length - 1)) * 100;
        elements.progressFill.style.width = `${progress}%`;
    }
}

// Показать концовку
function showEnding(endingScene) {
    // Добавляем концовку в открытые
    if (!gameState.unlockedEndings.includes(endingScene.endingName)) {
        gameState.unlockedEndings.push(endingScene.endingName);
        
        // Разблокируем достижение
        unlockAchievement(endingScene.achievement);
    }
    
    // Обновляем UI
    updateUI();
    
    // Показываем оверлей концовки
    elements.endingTitle.textContent = endingScene.endingName;
    elements.endingText.textContent = endingScene.text;
    elements.endingCounter.textContent = gameState.unlockedEndings.length;
    elements.playTime.textContent = gameState.totalPlayTime;
    
    elements.endingOverlay.classList.remove('hidden');
    
    // Сохраняем
    saveGameState();
}

// Разблокировать достижение
function unlockAchievement(achievementName) {
    const achievement = story.achievements.find(a => a.title === achievementName);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        console.log(`Достижение разблокировано: ${achievementName}`);
        showAchievementNotification(achievement);
    }
}

// Показать уведомление о достижении
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div style="font-size: 32px">${achievement.icon}</div>
        <div style="font-weight: bold; margin: 5px 0">${achievement.title}</div>
        <div style="font-size: 14px; color: #94a3b8">${achievement.description}</div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(30, 41, 59, 0.95);
        border: 2px solid #3b82f6;
        border-radius: 12px;
        padding: 20px;
        z-index: 10000;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
        max-width: 250px;
        text-align: center;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Обновить интерфейс
function updateUI() {
    elements.dayCounter.textContent = `День ${gameState.currentDay}`;
    elements.timeCounter.textContent = gameState.currentTime;
    elements.endingsCounter.textContent = `${gameState.unlockedEndings.length}/8`;
    
    // Обновляем сетку достижений
    updateAchievementsGrid();
}

// Обновить сетку достижений
function updateAchievementsGrid() {
    elements.achievementsGrid.innerHTML = '';
    
    story.achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        
        div.innerHTML = `
            <span class="achievement-icon">${achievement.icon}</span>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-desc">${achievement.description}</div>
        `;
        
        elements.achievementsGrid.appendChild(div);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Кнопки меню
    elements.menuBtn.addEventListener('click', () => {
        elements.menuOverlay.classList.remove('hidden');
    });
    
    elements.saveBtn.addEventListener('click', saveGameState);
    
    elements.restartBtn.addEventListener('click', () => {
        if (confirm('Начать новую игру? Весь прогресс будет потерян.')) {
            newGame();
        }
    });
    
    elements.achievementsBtn.addEventListener('click', () => {
        elements.achievementsOverlay.classList.remove('hidden');
    });
    
    // Кнопки в модалках
    elements.continueBtn.addEventListener('click', () => {
        elements.menuOverlay.classList.add('hidden');
    });
    
    elements.newGameBtn.addEventListener('click', () => {
        if (confirm('Начать новую игру?')) {
            newGame();
            elements.menuOverlay.classList.add('hidden');
        }
    });
    
    elements.closeAchievementsBtn.addEventListener('click', () => {
        elements.achievementsOverlay.classList.add('hidden');
    });
    
    elements.playAgainBtn.addEventListener('click', newGame);
    
    elements.shareEndingBtn.addEventListener('click', shareEnding);
    
    // Закрытие модалок по клику на оверлей
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });
    });
}

// Новая игра
function newGame() {
    // Сброс состояния
    gameState.currentScene = 'start';
    gameState.currentTime = '10:00';
    gameState.currentDay = 1;
    gameState.unlockedEndings = [];
    
    // Сброс прогресса
    elements.progressFill.style.width = '0%';
    
    // Скрываем оверлеи
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.classList.add('hidden');
    });
    
    // Запускаем с начала
    showScene('start');
    updateUI();
    saveGameState();
}

// Поделиться концовкой
function shareEnding() {
    const endingCount = gameState.unlockedEndings.length;
    const totalEndings = 8;
    const playTime = gameState.totalPlayTime;
    
    const shareText = `Я открыл ${endingCount} из ${totalEndings} концовок в игре "Последний день лета"! 🏖️\n\nПопробуй и ты: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Последний день лета',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Копируем в буфер обмена
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Текст скопирован в буфер обмена! Поделись с друзьями 😊');
        });
    }
}

// Запуск игры при загрузке страницы
document.addEventListener('DOMContentLoaded', initGame);

// Добавляем CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .achievement-notification {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);
