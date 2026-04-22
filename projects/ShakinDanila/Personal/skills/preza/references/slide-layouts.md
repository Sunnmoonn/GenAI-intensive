# Справочник макетов слайдов

Каждый слайд генерируется как `<section data-slide-id="N" data-layout="...">`.
Атрибут `data-slide-id` обязателен — он нужен для точечного редактирования.

---

## 1. `title` — Обложка / Title Slide

**Когда:** первый слайд, разделители крупных блоков.

```html
<section data-slide-id="1" data-layout="title">
  <div class="slide-title">
    <div class="tag">Тип: Питч / Инвестор</div>
    <h1>Название продукта</h1>
    <p class="subtitle">Краткий подзаголовок — одна строка</p>
    <div class="divider"></div>
    <p class="meta">Автор · Март 2026</p>
  </div>
</section>
```

---

## 2. `section` — Разделитель секции

**Когда:** вводит новую тематическую группу слайдов.

```html
<section data-slide-id="N" data-layout="section">
  <div class="slide-section">
    <div class="big-num" style="font-size:4em;opacity:0.15;">02</div>
    <h2>Название раздела</h2>
    <p>Краткое описание что будет внутри</p>
  </div>
</section>
```

---

## 3. `text` — Один столбец текста

**Когда:** объяснение, описание, нарратив.

```html
<section data-slide-id="N" data-layout="text">
  <h2>Заголовок слайда</h2>
  <div class="divider"></div>
  <p>Основной текст. Не более 3-4 строк на слайде. <strong>Ключевые слова выделены.</strong></p>
  <p>Второй параграф если нужен.</p>
</section>
```

---

## 4. `bullets` — Буллет-лист

**Когда:** перечисление тезисов, фич, преимуществ.

### Density: minimal (3-4 пункта, коротко)
```html
<section data-slide-id="N" data-layout="bullets">
  <h2>Ключевые преимущества</h2>
  <div class="divider"></div>
  <ul>
    <li>Первый тезис — коротко</li>
    <li>Второй тезис — коротко</li>
    <li>Третий тезис — коротко</li>
  </ul>
</section>
```

### Density: standard (5-6 пунктов с пояснением)
```html
<section data-slide-id="N" data-layout="bullets">
  <h2>Функциональность</h2>
  <div class="divider"></div>
  <ul>
    <li><strong>Первый пункт</strong> — краткое пояснение в 5-7 слов</li>
    <li><strong>Второй пункт</strong> — краткое пояснение</li>
    <li><strong>Третий пункт</strong> — краткое пояснение</li>
    <li><strong>Четвёртый пункт</strong> — краткое пояснение</li>
    <li><strong>Пятый пункт</strong> — краткое пояснение</li>
  </ul>
</section>
```

### Density: dense (с иконками, структура)
```html
<section data-slide-id="N" data-layout="bullets">
  <h2>Технический стек</h2>
  <div class="slide-cols">
    <ul>
      <li><strong>Frontend:</strong> React + TypeScript</li>
      <li><strong>Backend:</strong> Node.js + Fastify</li>
      <li><strong>AI:</strong> Claude API (Sonnet)</li>
    </ul>
    <ul>
      <li><strong>DB:</strong> PostgreSQL + Redis</li>
      <li><strong>Infra:</strong> Docker + Nginx</li>
      <li><strong>Analytics:</strong> PostHog</li>
    </ul>
  </div>
</section>
```

---

## 5. `big-number` — Большая цифра / KPI

**Когда:** впечатляющая метрика, факт, результат.

### Одна цифра
```html
<section data-slide-id="N" data-layout="big-number">
  <h2>Результаты за 3 месяца</h2>
  <div class="divider"></div>
  <div class="big-num">340%</div>
  <p class="big-num-label">рост MRR с момента запуска</p>
  <p class="text-muted" style="margin-top:1.5em;">Запуск: октябрь 2025 → текущий MRR: 420 000 ₽</p>
</section>
```

### Три KPI в сетке
```html
<section data-slide-id="N" data-layout="big-number">
  <h2>Ключевые метрики</h2>
  <div class="divider"></div>
  <div class="kpi-grid">
    <div class="kpi-item">
      <div class="big-num">12к</div>
      <div class="big-num-label">пользователей</div>
    </div>
    <div class="kpi-item">
      <div class="big-num">340%</div>
      <div class="big-num-label">рост MRR</div>
    </div>
    <div class="kpi-item">
      <div class="big-num">4.8★</div>
      <div class="big-num-label">средняя оценка</div>
    </div>
  </div>
</section>
```

---

## 6. `text-image` — Текст + изображение

**Когда:** описание с визуалом, скриншот + объяснение.

```html
<section data-slide-id="N" data-layout="text-image">
  <h2>Как это работает</h2>
  <div class="slide-cols cols-6-4">
    <div>
      <div class="divider"></div>
      <p>Описание слева — основной нарратив.</p>
      <ul>
        <li>Первый шаг</li>
        <li>Второй шаг</li>
        <li>Третий шаг</li>
      </ul>
    </div>
    <div class="img-box">
      <!-- Заменить src на реальный путь или url -->
      <img src="assets/screenshot.png" class="slide-img" alt="Скриншот">
    </div>
  </div>
</section>
```

---

## 7. `chart` — Chart.js график

**Когда:** данные, тренды, сравнение числовых показателей.

```html
<section data-slide-id="N" data-layout="chart">
  <h2>Рост пользователей</h2>
  <div class="divider"></div>
  <canvas id="chart-slide-N" style="max-height:480px;"></canvas>
  <aside class="notes">Рост органический, без платной рекламы</aside>
</section>
```

Chart.js конфигурация добавляется в секцию `{{CHARTJS_INIT}}`:

```javascript
// Chart для слайда N
new Chart(document.getElementById('chart-slide-N'), {
  type: 'line', // bar | line | pie | doughnut | radar
  data: {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
    datasets: [{
      label: 'Пользователи',
      data: [120, 340, 780, 1200, 2100, 3400],
      borderColor: 'var(--accent)',
      backgroundColor: 'rgba(37,99,235,0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'var(--text)', font: { family: 'Inter', size: 14 } } }
    },
    scales: {
      x: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border-color)' } },
      y: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border-color)' } }
    }
  }
});
```

---

## 8. `diagram` — Mermaid.js диаграмма

**Когда:** архитектура, флоу, процессы, зависимости.

```html
<section data-slide-id="N" data-layout="diagram">
  <h2>Архитектура системы</h2>
  <div class="divider"></div>
  <div class="mermaid" style="font-size:0.7em;">
graph LR
    A[Пользователь] --> B[Landing Page]
    B --> C[Claude API]
    C --> D[Reveal.js HTML]
    D --> E[Браузер]
    style A fill:var(--surface),stroke:var(--accent)
    style C fill:var(--accent),color:#fff,stroke:none
  </div>
  <aside class="notes">Весь стек open-source, стоимость инфраструктуры ~$20/мес</aside>
</section>
```

Поддерживаемые типы Mermaid: `graph` (flowchart), `sequenceDiagram`, `pie`, `mindmap`, `gitGraph`, `erDiagram`.

---

## 9. `comparison` — Сравнение двух вариантов

**Когда:** до/после, вариант A/B, конкуренты.

```html
<section data-slide-id="N" data-layout="comparison">
  <h2>До и После</h2>
  <div class="slide-cols" style="margin-top:0.5em;">
    <div class="highlight">
      <h3 style="color:var(--text-muted);font-size:0.8em;text-transform:uppercase;letter-spacing:0.1em;">Было</h3>
      <ul>
        <li>Ручная подготовка данных — 3 часа</li>
        <li>Ошибки в расчётах</li>
        <li>Нет версионирования</li>
      </ul>
    </div>
    <div class="highlight" style="border-left-color:var(--accent);">
      <h3 style="color:var(--accent);font-size:0.8em;text-transform:uppercase;letter-spacing:0.1em;">Стало</h3>
      <ul>
        <li><strong>Автоматика — 5 минут</strong></li>
        <li>AI-проверка на ошибки</li>
        <li>Git + diff</li>
      </ul>
    </div>
  </div>
</section>
```

---

## 10. `quote` — Цитата

**Когда:** отзыв клиента, экспертное мнение, статистика из источника.

```html
<section data-slide-id="N" data-layout="quote">
  <div style="display:flex;flex-direction:column;justify-content:center;height:100%;">
    <div style="font-size:4em;color:var(--accent);line-height:0.8;margin-bottom:0.2em;">&ldquo;</div>
    <blockquote class="blockquote-big">
      Текст цитаты. Не более двух-трёх строк — иначе не читается со сцены.
    </blockquote>
    <p class="blockquote-source">— Имя Фамилия, Должность, Компания</p>
  </div>
</section>
```

---

## 11. `steps` — Пошаговый процесс

**Когда:** как работает продукт, onboarding, план действий.

```html
<section data-slide-id="N" data-layout="steps">
  <h2>Как начать за 3 шага</h2>
  <div class="divider"></div>
  <ol class="steps">
    <li>
      <div>
        <strong>Зарегистрируйтесь</strong><br>
        <span class="text-muted">Занимает 30 секунд, не нужна карта</span>
      </div>
    </li>
    <li>
      <div>
        <strong>Загрузите данные</strong><br>
        <span class="text-muted">CSV, Excel или подключите API</span>
      </div>
    </li>
    <li>
      <div>
        <strong>Получите результат</strong><br>
        <span class="text-muted">AI анализирует за ~10 секунд</span>
      </div>
    </li>
  </ol>
</section>
```

---

## 12. `contact` — Финальный слайд / Контакты

**Когда:** последний слайд с CTA и контактной информацией.

```html
<section data-slide-id="N" data-layout="contact">
  <div class="slide-contact">
    <div class="tag">Спасибо за внимание</div>
    <div class="contact-name">Егор Рудометкин</div>
    <p style="font-size:0.7em;color:var(--text-muted);margin-top:0.3em;">
      Основатель · Product Money Factory
    </p>
    <div class="divider" style="margin:1em 0;"></div>
    <div class="contact-links">
      📧 egor@example.com<br>
      💬 Telegram: @rudometkin<br>
      🌐 rud-ai.ru
    </div>
    <p style="margin-top:1.5em;font-size:0.65em;">
      <strong class="text-accent">Следующий шаг:</strong>
      <a href="#">Попробовать бесплатно →</a>
    </p>
  </div>
</section>
```

---

## Насыщенность (Density Levels)

При генерации Claude должен учитывать уровень насыщенности, указанный пользователем:

| Уровень | Слов на слайде | Элементов | Когда |
|---|---|---|---|
| **minimal** | 10-20 | 1 ключевой элемент | Конференция, выступление вживую |
| **standard** | 30-50 | 2-3 элемента | Онлайн-звонок, питч инвестору |
| **dense** | 60-100 | Таблицы, списки, детали | Отчёт, документация, самостоятельное чтение |

При density=minimal: убирать subtitle, сокращать буллеты до 3, числа выносить крупно.
При density=dense: добавлять таблицы, сноски, speaker notes с деталями.
