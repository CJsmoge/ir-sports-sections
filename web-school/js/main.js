document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.review-card');
    const btns = document.querySelectorAll('.slider-btn');
    if (cards.length > 0 && btns.length > 0) {
        btns.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('active'));
                btns.forEach(b => b.classList.remove('active'));
                cards[i].classList.add('active');
                btns[i].classList.add('active');
            });
        });
    }

    if (document.getElementById('total-price')) {
        window.calculate = function() {
            const basePrice = 1000;
            const duration = document.getElementById('duration').value;
            const tariff = document.getElementById('tariff').value;
            const lessons = document.getElementById('lessons').value;
            let durCoef = 1;
            if (duration == 60) durCoef = 1.3;
            if (duration == 90) durCoef = 1.8;
            const total = Math.round(basePrice * durCoef * tariff * lessons);
            document.getElementById('total-price').textContent = total.toLocaleString('ru-RU');
        };
    }

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        fetch('/api/courses')
            .then(r => r.json())
            .then(list => {
                const sel = document.getElementById('courseId');
                if (sel) {
                    sel.innerHTML = '<option value="">-- Выберите --</option>';
                    list.forEach(c => {
                        const o = document.createElement('option');
                        o.value = c.id;
                        o.textContent = c.name;
                        sel.appendChild(o);
                    });
                }
            })
            .catch(err => console.error('Ошибка загрузки курсов:', err));

        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', e => {
                let d = e.target.value.replace(/\D/g, ''); // Оставляем только цифры
                
                // Если начал с 8 или 9, меняем на 7
                if (d.startsWith('8')) d = '7' + d.slice(1);
                if (d.startsWith('9')) d = '7' + d;
                if (!d.startsWith('7')) d = '7' + d;
                
                d = d.slice(0, 11); // Ограничиваем 11 цифрами
                
                // Собираем обратно с плюсом и скобками
                let r = '+7';
                if (d.length > 1) r += '(' + d.slice(1, 4);
                if (d.length >= 4) r += ')';
                if (d.length > 4) r += '-' + d.slice(4, 7);
                if (d.length > 7) r += '-' + d.slice(7, 9);
                if (d.length > 9) r += '-' + d.slice(9, 11);
                
                e.target.value = r;
            });
        }
        bookingForm.addEventListener('submit', async e => {
            e.preventDefault();
            const data = {
                fullName: document.getElementById('fullName').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                courseId: document.getElementById('courseId').value
            };
            document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
            try {
                const resp = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await resp.json();
                if (resp.ok) {
                    bookingForm.style.display = 'none';
                    document.getElementById('success-msg').style.display = 'block';
                } else if (result.errors) {
                    for (const [id, msg] of Object.entries(result.errors)) {
                        document.getElementById('err-' + id).textContent = msg;
                    }
                }
            } catch (err) {
                alert('Ошибка соединения с сервером.');
            }
        });
    }
});