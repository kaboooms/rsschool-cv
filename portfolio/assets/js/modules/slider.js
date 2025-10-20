export const initSliderHandler = () => {
    const slider = document.querySelector('.slider-wrapper')
    const items = Array.from(slider.children)
    slider.append(...items.map(el => el.cloneNode(true)))

    const AUTO_SPEED = 0.85;
    const FRICTION = 0.95;      // инерция торможения (0 < f < 1)
    const INERTIA_MULT = 1.5;

    let isDragging = false;
    let position = 0;
    let direction = 1;
    let speed = AUTO_SPEED;
    let startX = 0;            // начало drag
    let prevPosition = 0;
    let currentX = 0;
    let velocity = 0;          // скорость для инерции
    let lastX = 0;             // для расчёта скорости

    // ширина контента внутри wrapper (вся лента)
    let contentWidth = slider.scrollWidth;
    let originalWidth = contentWidth / 2;
    let viewportWidth = slider.clientWidth;

    slider.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startX = e.clientX;
        lastX = e.clientX;
        velocity = 0;
        // отключаем transition, чтобы следить за курсором без лагов
        slider.style.transition = 'none';
        slider.setPointerCapture(e.pointerId);
    })

    slider.addEventListener('pointermove', (e) => {
        if (!isDragging) return;

        currentX = e.clientX;
        const diff = currentX - startX;

        position = prevPosition + diff;

        // обновляем скорость (в пикселях/шаг)
        velocity = e.clientX - lastX;
        lastX = currentX;

        slider.style.transform = `translateX(${position}px)`;
    })


    document.addEventListener('pointerup', (e)=>{
        if (!isDragging) return;
        isDragging = false;
        prevPosition = position;
        // применяем инерцию (добавляем velocity)
        // и делаем плавное завершение
        velocity *= INERTIA_MULT;
        position += velocity;
        prevPosition = position;
        // плавно возвращаемся в норму
        setTransformSmooth(position, 500);
        e.target.releasePointerCapture(e.pointerId)
    })

    slider.addEventListener('mousemove', (e)=>{
        if (isDragging) return;

        if (e.x < slider.offsetWidth / 3) {
            direction = 1;
            speed = AUTO_SPEED;
        } else if (event.x > slider.offsetWidth * 2 / 3) {
            direction = -1;
            speed = AUTO_SPEED;
        }
    })

    slider.addEventListener('mouseleave', (e)=>{
        if (isDragging) return;

        direction = 1;
        speed = AUTO_SPEED;
    })

    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
        contentWidth = slider.scrollWidth;
        originalWidth = contentWidth / 2;
        viewportWidth = slider.clientWidth;
    });

    function setTransformSmooth(x, ms = 300) {
        slider.style.transition = `transform ${ms}ms cubic-bezier(.22,.9,.32,1)`;
        slider.style.transform = `translateX(${x}px)`;
    }

    function setTransformInstant(x) {
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${x}px)`;
    }

    function handleInfiniteReset() {
        // Когда позиция уходит слева дальше -originalWidth, "прибавляем" originalWidth
        // (т.е. показываем второй клон как первый)
        if (position <= -originalWidth) {
            // мгновенно сдвинуть позицию на +originalWidth (без анимации)
            position += originalWidth;
            prevPosition = position;
            // мгновенный сброс (без transition) — чтобы пользователь не заметил
            setTransformInstant(position);

            // принудительный reflow, затем можно вернуть transition, если нужно
            // (force reflow чтобы браузер применил стиль до следующего кадра)
            // eslint-disable-next-line no-unused-expressions
            slider.getBoundingClientRect();
        }
        // Если позиция стала положительной (уехали вправо за 0), сдвинуть назад
        else if (position >= contentWidth) {
            position -= originalWidth;
            prevPosition = position;
            setTransformInstant(position);
            slider.getBoundingClientRect();
        }
    }

    // main animate loop (автоскролл + инерция + reset check)
    function animate() {
        if (!isDragging) {
            // авто-движение
            position -= speed;
            // если есть инерция после drag, она будет уменьшаться самостоятельно через velocity
            if (Math.abs(velocity) > 0.01) {
                position += velocity; // velocity может быть положительным/отрицательным
                velocity *= FRICTION;
            }
            prevPosition = position;
            // плавный set без transition spam — здесь оптимально менять transform напрямую,
            // переходы контролируем отдельными вызовами при отпускании.
            slider.style.transform = `translateX(${position}px)`;
        } else {
            // при drag transform обновляется в pointermove
        }

        // проверка и незаметный сброс при необходимости
        handleInfiniteReset();

        requestAnimationFrame(animate);
    }

}
