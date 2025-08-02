document.addEventListener('DOMContentLoaded', function () {
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Наблюдаем за секциями
    const sections = document.querySelectorAll('.server-card, .service-card, .feature-item, .detail-item, .rule-item');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });

    // Копирование адреса сервера при клике
    const serverAddress = document.querySelector('.address-value');
    if (serverAddress) {
        serverAddress.addEventListener('click', function () {
            const text = this.textContent;

            // Копируем в буфер обмена
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    showNotification('Адрес сервера скопирован, товарищ!<br/>服务器地址已复制，同志！', 'success');
                }).catch(() => {
                    fallbackCopyTextToClipboard(text);
                });
            } else {
                fallbackCopyTextToClipboard(text);
            }
        });

        // Добавляем курсор pointer
        serverAddress.style.cursor = 'pointer';
        serverAddress.title = 'Нажмите чтобы скопировать';
    }

    // Фолбэк для копирования
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            showNotification('Адрес сервера скопирован, товарищ!<br/>服务器地址已复制，同志！', 'success');
        } catch (err) {
            showNotification('Не удалось скопировать<br/>复制失败', 'error');
        }

        document.body.removeChild(textArea);
    }

    // Показ уведомлений
    function showNotification(message, type = 'info') {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        const emoji = type === 'success' ? '🐉' : '💥';
        const messageWithEmoji = `<span style="font-size: 1.8em; margin-right: 12px; display: inline-block; vertical-align: middle;">${emoji}</span><span style="display: inline-block; vertical-align: middle;">${message}</span>`;
        notification.innerHTML = messageWithEmoji;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'var(--primary-gold)' : 'var(--primary-red)'};
            color: var(--black);
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: bold;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            max-width: 450px;
            min-width: 300px;
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Удаление через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Усиленная анимация драконов при движении мыши
    document.addEventListener('mousemove', function (e) {
        const allDragons = document.querySelectorAll('.dragon-left, .dragon-right, .dragon-floating-1, .dragon-floating-2, .dragon-floating-3');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        allDragons.forEach((dragon, index) => {
            const speed = (index % 2 === 0) ? 0.015 : -0.015;
            const x = mouseX * speed * 80;
            const y = mouseY * speed * 40;

            // Более плавное движение
            dragon.style.transition = 'transform 0.3s ease-out';
            dragon.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // Интерактивность с detail-items
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            createParticles(this);
            // Подсвечиваем иконку в detail-item
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transition = 'all 0.3s ease';
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.filter = 'brightness(1.3) drop-shadow(0 0 15px var(--primary-gold))';
            }
        });

        item.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.filter = 'none';
            }
        });
    });

    // Добавляем эффект частиц и подсветку иконок для карточек при наведении
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            createParticles(this);
            // Подсвечиваем иконку в service-card
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transition = 'all 0.3s ease';
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.filter = 'brightness(1.3) drop-shadow(0 0 15px var(--primary-gold))';
            }
        });

        card.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.service-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.filter = 'drop-shadow(0 2px 4px var(--shadow-gold))';
            }
        });
    });

    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            createParticles(this);
            // Подсвечиваем иконку в feature-item
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transition = 'all 0.3s ease';
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.filter = 'brightness(1.3) drop-shadow(0 0 15px var(--primary-gold))';
            }
        });

        item.addEventListener('mouseleave', function () {
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.filter = 'none';
            }
        });
    });

    // Интерактивность с rule-items
    const ruleItems = document.querySelectorAll('.rule-item');
    ruleItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            createParticles(this);
            // Подсвечиваем номер правила
            const number = this.querySelector('.rule-number');
            if (number) {
                number.style.transition = 'all 0.3s ease';
                number.style.transform = 'scale(1.1) rotate(5deg)';
                number.style.filter = 'brightness(1.2) drop-shadow(0 0 20px var(--primary-gold))';
                number.style.background = 'linear-gradient(45deg, var(--primary-gold), var(--primary-red))';
            }
        });

        item.addEventListener('mouseleave', function () {
            const number = this.querySelector('.rule-number');
            if (number) {
                number.style.transform = 'scale(1) rotate(0deg)';
                number.style.filter = 'none';
                number.style.background = 'linear-gradient(45deg, var(--primary-red), var(--dark-red))';
            }
        });
    });

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-gold);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particle-float 1s ease-out forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    // Динамические драконы с анимацией дыхания
    const dynamicDragons = [];
    const maxDragons = 6; // 3 слева + 3 справа
    let leftDragons = 0;
    let rightDragons = 0;

    function createDynamicDragon() {
        // Определяем, с какой стороны создать дракона
        let isLeft;
        if (leftDragons < 3 && rightDragons < 3) {
            isLeft = Math.random() > 0.5;
        } else if (leftDragons < 3) {
            isLeft = true;
        } else if (rightDragons < 3) {
            isLeft = false;
        } else {
            return; // Максимум достигнут
        }

        const dragon = document.createElement('div');
        const dragonEmojis = ['🐉', '🐲'];
        const randomEmoji = dragonEmojis[Math.floor(Math.random() * dragonEmojis.length)];

        // Позиционирование слева или справа
        const leftPos = isLeft ? Math.random() * 15 + 5 : Math.random() * 15 + 80; // 5-20% или 80-95%

        dragon.textContent = randomEmoji;
        dragon.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 1.5 + 2}rem;
            opacity: 0;
            pointer-events: none;
            z-index: -1;
            left: ${leftPos}vw;
            top: ${Math.random() * 80 + 10}vh;
            color: ${Math.random() > 0.5 ? 'var(--primary-gold)' : 'var(--primary-red)'};
            filter: drop-shadow(0 0 8px currentColor);
            animation: dragonBreath ${4 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;

        // Отслеживаем сторону
        dragon.dataset.side = isLeft ? 'left' : 'right';
        if (isLeft) leftDragons++;
        else rightDragons++;

        document.body.appendChild(dragon);

        // Плавное появление
        setTimeout(() => {
            dragon.style.transition = 'opacity 3s ease-in-out';
            dragon.style.opacity = 0.2;
        }, 100);

        // Удаление через случайное время
        const lifetime = 12000 + Math.random() * 18000;
        setTimeout(() => {
            if (dragon.parentNode) {
                dragon.style.opacity = '0';
                setTimeout(() => {
                    if (dragon.parentNode) {
                        // Уменьшаем счетчик
                        if (dragon.dataset.side === 'left') leftDragons--;
                        else rightDragons--;

                        document.body.removeChild(dragon);
                        const index = dynamicDragons.indexOf(dragon);
                        if (index > -1) {
                            dynamicDragons.splice(index, 1);
                        }
                    }
                }, 3000);
            }
        }, lifetime);

        dynamicDragons.push(dragon);
    }

    // Создание новых драконов
    function spawnDragons() {
        if (dynamicDragons.length < maxDragons) {
            createDynamicDragon();
        }

        // Следующий дракон через случайное время
        const nextSpawn = 5000 + Math.random() * 12000;
        setTimeout(spawnDragons, nextSpawn);
    }

    // Запуск системы драконов
    setTimeout(spawnDragons, 5000);

    // Эффект дракона при скролле
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';

        const dragons = document.querySelectorAll('.dragon-left, .dragon-right');
        dragons.forEach(dragon => {
            const currentTransform = dragon.style.transform || '';
            const scrollEffect = scrollDirection === 'down' ? 'translateY(10px)' : 'translateY(-10px)';
            dragon.style.transform = currentTransform + ' ' + scrollEffect;
        });

        lastScrollTop = scrollTop;
    });

    // Добавляем CSS анимации
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particle-float {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-50px) scale(0);
            }
        }
        
        @keyframes dragonBreath {
            0%, 100% {
                transform: translateY(0px);
                opacity: 0.15;
            }
            50% {
                transform: translateY(-15px);
                opacity: 0.25;
            }
        }
    `;
    document.head.appendChild(style);

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('🐉 Xi World сайт загружен! 習世界 ☭');
}); 