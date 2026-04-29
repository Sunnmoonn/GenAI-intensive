# GenAI-Интенсив МФТИ 2026 — Ревью ДЗ

**Дата ревью:** 2026-04-23
**Репозиторий:** https://github.com/rudometkin/GenAI-intensive
**Участников:** 14 (RudometkinEgor — шаблон, не сдача)
**Средний балл:** 7.9/10

---

## Задание курса

**Блок 1 · PROJECTCLONE** — клонирование внешнего сервиса:
1. Выбор сервиса + обоснование
2. Необходимые скилы для сборки
3. Декомпозиция на продуктовые модули → скилы
4. Код в репо
5. Логика: как создавали, что было сложного
6. ⭐ План рвов вокруг клона

**Блок 2 · PERSONAL** — личная AI-продуктивность:
- `skills/` — набор персональных скилов
- `README.md` — формат `[имя] — триггер — что делает — контекст`
- Список задач под будущие скилы

**Блок 3 · PROJECTNAME** — по своему проекту:
- `CODEBASE/` — код
- `REPORT.md` — что изменилось за 2 недели на уровне архитектуры
- `PRODUCT.md` — агрегаторы, парсеры, ЦА
- `PLAN.md` — 2-3 типа рвов × 3-6 мес × метрика × риски
- `AJTBD.md` — карта джобов

**⭐ Бонус на «5»** — пошаговые скилы: поиск (≥20 сервисов) → анализ интерфейсов → ТЗ → реализация → тестирование → публикация.

---

## Общая таблица

| Участник | Балл | CLONE | PERSONAL | PROJECT | ⭐Бонус | Главный пробел |
|---|---|---|---|---|---|---|
| ObrazumovaZlata | **10/10** | ✅ | ✅ | ✅ | ✅ | нет отдельного AJTBD.md |
| YarochkinaMaria | **10/10** | ✅ | ✅ | 🟡 | ✅ | нет AJTBD.md + нет production-кода РЯДОМ |
| KokinYuriy | **10/10** | ✅ | ✅ | ✅ | ✅ | AJTBD размазан по PRODUCT |
| RozanovaPolina | **9/10** | ✅ | ✅ | 🟡 | ❌ | нет AJTBD, нет бонуса |
| DemyanovaDarya | **9/10** | ✅ | ✅ | ✅ | ✅ | PLAN как roadmap, не план рвов |
| Daniil_Andreev | **8/10** | 🟡 | ✅ | 🟡 | ❌ | клон в группе, нет AJTBD |
| ElizavetaRykunova | **8/10** | ✅ | ✅ | 🟡 | ❌ | личный стек не пересекается с продуктом |
| FrantsevAndrew | **8/10** | ✅ | ✅ | ✅ | ❌ | ноль продуктовых скилов в PERSONAL |
| KaymakanMaxim | **8/10** | ❌ | ✅ | ✅ | ❌ | PROJECTCLONE — пустой Next.js boilerplate |
| AbdulmanovaAlsu | **7/10** | ✅ | 🟡 | ✅ | ❌ | 1 скилл вместо контура |
| ShakinDanila | **7/10** | ✅ | ✅ | ❌ | ❌ | Блок 3 = только README LegoProject |
| RomanovaTatyana | **6/10** | ✅ | 🟡 | ❌ | ❌ | Блока 3 нет вообще |
| RostovshchikovIlya | **6/10** | ✅ | 🟡 | 🟡 | ❌ | VNIKAY — только README, нет 4 обязательных файлов |
| MnatsakanyanTigran | **4/10** | 🟡 | 🟡 | 🟡 | ❌ | полностью нарушена структура ДЗ |

---

## Общий комментарий по потоку

Группа сильная. 5 участников из 14 сдали на 9+ с рабочими продакшн-сервисами (Quantara, KBJUY, Вникай, Объяснятор, Synesthesia, Settld-клон). Четверо закрыли бонус.

**Три системных пробела, повторяющихся у большинства:**

1. **AJTBD как отдельный файл** — нет почти ни у кого (8 из 14). Джобы размазаны по PRODUCT.md. Самая простая доработка: 20 минут → +0.5 балла.
2. **PLAN.md путают с roadmap фичей.** Настоящий PLAN: «Тип рва → что делаем → метрика, показывающая что ров появляется → что мешает». Правильно — только у Ярочкиной, Розановой, Рыкуновой, Кокина.
3. **Бонус закрыли только там, где явно спроектировали пошаговый пайплайн** (Образумова, Ярочкина, Кокин, Демьянова). У Андреева пайплайн де-факто есть — нужно переоформить.

**Тренды:**
- 7 из 14 задеплоили рабочий продукт (Vercel/Render), а не слайды.
- 6 участников имеют первичные сигналы рынка (Kaymakan 8 интервью, Frantsev 47 заявок/нед, Obrazumova запрос от НИИ).
- Большое расстояние между кодом и метриками рвов. «Данные» заявлены как ров, но конкретный flywheel раскрыт редко.

---

## Детальные разборы

### ObrazumovaZlata — 10/10

**🔎 Клон:** Benchling (ELN+LIMS для biotech, заблокирован в РФ) → **Quantara**. React + TS + Tailwind + Supabase с RLS + Edge Functions. Уровень прод-архитектуры. Отбор из 22 сервисов по методологии VENTURE-SCAN RF 2.0 с формулой M²×T×A×B×P.
**💡 Совет:** ELN-core (версионирование протоколов, электронная подпись) — настоящий воспроизводимый moat Benchling. Сейчас собран LIMS-скелет; ELN — следующий шаг, откроет GxP-контракты.

**🧰 PERSONAL:** 11+ скилов + отдельный Next.js-инструмент `startup-market`. Бонусный пайплайн clone-1-search → clone-6-publish.
**💡 Совет:** опубликовать `venture-scan-rf` с формулой как шаблон для других студентов — сильный ход.

**🚀 Проект Quantara** — первое отечественное ELN+LIMS для НИИ, фармы, ЦКП. За 2 недели: с фронт-прототипа до multi-tenant SaaS с 6 модулями и mobile-адаптацией. Рвы: Данные + Switching cost + Регуляторика (GxP).
**💡 Совет:** метрики в PLAN размытые — добавь числа (N протоколов на org за 90 дней) и GxP-сертификацию как milestone с юр.консультацией.

---

### YarochkinaMaria — 10/10

**🔎 Клон:** Settld (UK, уведомление организаций о смерти) → полный клон на Next.js 14 + localStorage. Обоснование: 20 кандидатов × 10 критериев = 49/50 у Settld. Отдельные файлы LOGIKA_VIBORA / MOAT_SETTLD с разбором 8 типов рва.
**💡 Совет:** stateless-прототип — следующий шаг «PostgreSQL/Supabase как основа data moat» превращает учебный клон в рабочий продукт.

**🧰 PERSONAL:** 10 активных + 14 backlog = 24 скилла. Формат из 4 полей — самый полный в группе. Это готовый клон-пайплайн: service-search → cloneability-assessment → product-architecture-mapper → frontend-mvp-builder → rapid-qa-reviewer.
**💡 Совет:** 14 backlog без приоритизации. Выбери 3-4 по RICE на апрель-май.

**🚀 Проект РЯДОМ** — пассивный мониторинг пожилых (тренд на ухудшение, а не факт инцидента). За 2 недели: VK Ads, новый лендинг на Replit, ML PoC на HAR dataset, контакт со Сбером. Рвы: Data + Trust + Switching cost — flywheel.
**💡 Совет:** за 2 недели ни строчки production-кода для сбора данных — риск остаться proof-of-concept. Следующий спринт жёстко: обезличенный датасет + baseline.

---

### KokinYuriy — 10/10

**🔎 Клон:** Doomlingo → **«Вникай»** (веб-версия думскроллинга). React 19 + TS + Vite + Tailwind 4. 10 MP4 с двуязычными синхронными субтитрами через useRef + CSS-fade 150ms.
**💡 Совет:** в `scenes.ts` 10 видео захардкожено — автопайплайн Whisper+разметки критичен, иначе библиотека упрётся в ручной труд.

**🧰 PERSONAL:** 6 vault-команд + 3 плагина + GCal MCP + 7 meta-скилов в бэклоге. Образцовое разделение meta vs domain.
**💡 Совет:** PDF_Rule_Extractor + BVI_Rule_Aggregator + Olympiad_Tracker — один пайплайн, проектируй как цепочку с общим хранилищем.

**🚀 Проект PrivateEducation** — AI-сопровождение поступления детей в топ-вузы (состоятельные семьи). За 2 недели: онбординг 2 семей, vault-методология, 4 AI-агента, CRM. Отказ от групп и ЕГЭ. Рвы: данные + доверие + switching cost (12+ мес контракт).
**💡 Совет:** цикл поступления 1-2 года — опасно ждать реальные результаты. Добавь proxy-метрики (олимпиады, зачисления в сильные школы, баллы диагностик) на 6 мес.

---

### RozanovaPolina — 9/10

**🔎 Клон:** Juno Chat (healthtech) → **ХроноМед**. Python + SQLite + vanilla JS + Docker. Самая сильная сторона — личная мотивация (сама биотехнолог с генетическим заболеванием). Подробный разбор 6 типов рва.
**💡 Совет:** для healthtech security pass — не опция (шифрование, аудит доступа).

**🧰 PERSONAL:** 6 скилов: kbzhuy-start, feature-dev, meal-plan, fix-it, **decide, weekly**. Дисциплина фиксации решений + воскресное ревю — редкий паттерн.
**💡 Совет:** отдели generic (feature-dev, fix-it, decide) в библиотеку, проектные — в project-scoped.

**🚀 Проект КБЖУЙ** — AI-навигатор батч-питания с контейнерами 1А/2Б. За 2 недели: mobile подключен к API, SecureStore, AuthGate, двойной LLM-бэкенд, `use_ai` как флаг — AI оркестрирует детерминистику. Рвы: поведенческий граф + **физические QR-наклейки** + прозрачные формулы BMR/TDEE.
**💡 Совет:** QR-наклейки как anchor в физическом мире — ключевой дифференциатор, не откладывай на июнь. То, что не копируется Yazio/FatSecret.

---

### DemyanovaDarya — 9/10

**🔎 Клон:** Opennote Lite → **Объяснятор**. Next.js 15 + умное разделение моделей: Sonnet 4.6 для тьютора, Haiku 4.5 для batch-генерации. Задеплоено на obyasnyator.vercel.app.
**💡 Совет:** встраивание в Private.Education (куратор → ученик) уже даёт switching cost — напиши явно в PLAN как ров.

**🧰 PERSONAL:** 18 скилов в 3 группах: общие (6) + педагогические (9) + проектные (4). Плотнейший прикладной стек. `caveman` с уровнями (lite/full/ultra) — оригинально.
**💡 Совет:** описания на абзац. Добавь формальный триггер + пример вход/выход к каждому.

**🚀 Проект Объяснятор** — AI-тьютор для самостоятельной работы между занятиями с куратором. 5 этапов: MVP → embeddings → auth → Leitner → интеграция с Private.Education.
**💡 Совет:** **PLAN.md написан как roadmap фичей, не как план рвов.** Переверни: 3 типа рвов (данные прогресса, привычка через интервальное повторение, B2B-интеграция) — под каждый этапы и метрики.

---

### Daniil_Andreev — 8/10

**🔎 Клон:** Juno Chat → **ХроноМед** (соавтор с Розановой, код в её репо).
**💡 Совет:** групповая работа ок, но в своей папке покажи модуль, который спроектировал лично — иначе блок выглядит как пересказ.

**🧰 PERSONAL:** 7 скилов как операционный контур: пиши-сокращай → анализ-интерфейсов → поиск-аналогов → написание-тз → ров-стратегия → тестирование-мвп → публикация-продукта. Эталонный формат.
**💡 Совет:** `поиск-аналогов` и `анализ-интерфейсов` покрывают половину бонуса — оформи как стёпы пайплайна, получишь бонус почти бесплатно.

**🚀 Проект Synesthesia** — песня → палитра + вкусовой профиль + ароматическая пирамида + эссе. **Сильнейший REPORT в группе:** 5 архитектурных сдвигов (Ollama→OpenRouter, two-stage→one-stage, каскад из 3 моделей с таймаутами, lyrics.ovh, dev/prod). Рвы: 50k-атлас треков + 40% кэш-хитов + Spotify OAuth.
**💡 Совет:** нет AJTBD-карты — «слушатель-эстет» просится в формулу «когда / хочу / чтобы».

---

### ElizavetaRykunova — 8/10

**🔎 Клон:** Lab4U / Helixa → **Bloodwise**. HTML/CSS/JS + Claude multimodal + regex для >5 форматов лабораторий. Двухуровневый вывод снижает воспринимаемую latency.
**💡 Совет:** API-ключ на клиенте с медданными — не «открытый вопрос», а блокер. Серверный прокси + 152-ФЗ — задача #1.

**🧰 PERSONAL:** 5 скилов (academic-writer, stats-helper, pitch-builder, vocab-translator, due-diligence-gen). Заточены под биотех-МГУ.
**💡 Совет:** стек на 100% академический — под Bloodwise ноль продуктовых. Добавь market-research из backlog.

**🚀 Проект Bloodwise** — AI-расшифровка для пациентов 25-55, платно 100-300₽/разово или 500₽/мес. Рвы: 10k+ анализов + advisory board + история в динамике. **Лучший PLAN.md в группе** по конкретике 1-2/3-4/5-6 мес.
**💡 Совет:** позиционирование «быстрее Google, умнее Lab4U» — лозунг. Защитимый угол: интеграция с лабораторией = единственный способ получить историю без ручного ввода.

---

### FrantsevAndrew — 8/10

**🔎 Клон:** InteriorAI → **Roomy-prototype**. Next.js 14 + Supabase + Replicate. 6 модулей → 6 скилов. Честная диагностика «в чём InteriorAI дыра» — не работает с реальными каталогами/габаритами.
**💡 Совет:** img2img с сохранением геометрии — R&D, не утилита. Либо ControlNet + депт-карта из 3D, либо прими что это костыль, а ров строится на каталоге/CPA.

**🧰 PERSONAL:** 10 инженерных скилов + 5 backlog под Roomy. Полный цикл инженера.
**💡 Совет:** **ни одного продуктового скилла** (jtbd, ров-стратегия, interface-analysis). Для основателя стартапа — пробел больше чем ещё один технический.

**🚀 Проект Roomy** — AI-дизайн интерьера с реальной мебелью из каталогов. **Сильнейший PMF-сигнал:** парсер Hoff на 2400 товаров через Playwright+Claude Vision, 47 заявок/нед, GPT-4o Vision ~70% точность размеров. Рвы: 10k аннотированных комнат + коллаборация + 5→15 B2B партнёров.
**💡 Совет:** 47 заявок — уже данные для валидации. Превращай в интервью и AJTBD сейчас, пока трафик горячий.

---

### KaymakanMaxim — 8/10

**🔎 Клон:** **фактически отсутствует** — в PROJECTCLONE только дефолтный Next.js README после `create-next-app`.
**💡 Совет:** самый слабый артефакт. Опиши что клонировал (Buffer? PostMyPost?), логику выбора, скилы, ⭐ров.

**🧰 PERSONAL:** 3 скилла (social-content, изобразика, telegram-telethon). Сцепка «скилл → задача агента» в таблице статусов — живой паттерн.
**💡 Совет:** добавь скилы под аналитику (LiveDune/TG-STAT) и «интерпретатор правок клиента» — в AJTBD они главные джобы, скилов нет.

**🚀 Проект SMMAgent** — полный цикл для агентств. За 2 недели: 8 интервью, Claude API, fal.ai/kie.ai, Telethon-парсер. Цифры из интервью (3-4 ч на отчёт, до 35 правок). **AJTBD — сильнейший в группе** (6.8 KB).
**💡 Совет:** MVP сузил до «контент-план + автопостинг», но главный джоб из интервью — **агрегация аналитики**. Опасно оставлять killer-job на бэклог.

---

### AbdulmanovaAlsu — 7/10

**🔎 Клон:** Brandwatch/YouScan сужено до YouTube. Один Python-скрипт (yt-dlp + transcript-api + comment-downloader + gspread). Keyword scoring без LLM.
**💡 Совет:** keyword scoring — бутылочное горлышко. Одна LLM-классификация по batch 50 комментариев даст на порядок больше ценности, стоить будет копейки.

**🧰 PERSONAL:** **1 скилл** (jtbd) + 5 задач в backlog.
**💡 Совет:** контур = минимум 3-5 скилов. Добери product-pitch и RICE из собственного списка.

**🚀 Проект FOOD2MOOD** — AI-ассистент в QR-меню ресторана. React+TS+Vite, rule-based, localStorage, ChatBot как state machine. Рвы: конверсия + партнёры + SDK.
**💡 Совет:** v1.0 без LLM и без backend — рвы невалидируемы. В ближайшие 2 недели — хотя бы один подключённый ресторан, иначе PLAN — гипотеза без сигнала.

---

### ShakinDanila — 7/10

**🔎 Клон:** **Копирка** — URL → промпт для Claude Code. Next.js + Cheerio + Turndown. Инженерные находки: `eval('require')` для обхода Turbopack; порядок — извлечь дизайн-токены ДО зачистки HTML.
**💡 Совет:** качество промпта — subjective. Собери eval-сет из 20 сайтов + автоматизируй сравнение «оригинал vs воссозданный».

**🧰 PERSONAL:** 10 скилов (`/тз`, `/план`, `/оценка` с 5 осями, `/заказчику` (зумер → директор), `caveman` с уровнями). Практичные.
**💡 Совет:** скилы generic — не видно связки с LEGO. Добавь проектные: `/yolo-ревью`, `/arduino-прошивка`, `/bom-из-изображений`.

**🚀 Проект LegoProject** — автосортировка LEGO DUPLO (YOLOv11 + HSV + Raspberry Pi 5 + Arduino × 4 + конвейер + Android). Инженерно грамотно.
**💡 Совет:** **весь Блок 3 — только один README**. Нет REPORT / PRODUCT / PLAN / AJTBD. Хардварный pet-project без форматов сдачи ≠ ответ на ДЗ. Датасет DUPLO как data moat — раскрой.

---

### RomanovaTatyana — 6/10

**🔎 Клон:** **Копирка** (Next.js + Cheerio + Turndown + Playwright fallback). Ниша «между скрейпингом и промпт-генерацией».
**💡 Совет:** собери eval-сет из 20 сайтов и автоматизируй метрику качества клона.

**🧰 PERSONAL:** 6 скилов (ИдеяВалидатор, LeanCanvasGenerator, MVPScopeBuilder, UserPersonaCreator, CustomerJourneyMapper, GrowthExperimentDesigner) + kopirka-скилл.
**💡 Совет:** все generic-продуктовые, ни одного ежедневного (meeting-notes, weekly-review). Нет списка задач под новые.

**🚀 Проект:** **Блок 3 полностью отсутствует.** Нет REPORT / PRODUCT / PLAN / AJTBD.
**💡 Совет:** если Копирка = и клон и свой продукт — дублируй структуру: PROJECTCLONE/ остаётся, параллельно собери PRODUCT/REPORT/PLAN/AJTBD с 3-6 мес планом и JTBD пользователей.

---

### RostovshchikovIlya — 6/10

**🔎 Клон:** **Doomersion** — EdTech через думскроллинг. Разбор через 5 продуктовых слоёв + таблица «где живёт moat». **Фреймворк 5 слоёв — переиспользуемый шаблон.**
**💡 Совет:** собственного кода нет — теоретический разбор. VNIKAY фактически и есть клон Doomersion, но связь не проведена. Сшей явно.

**🧰 PERSONAL:** 3 паттерна (product-thinking, vibe-coding, transcription-pipeline) + стек.
**💡 Совет:** 3 паттерна мало. Нет триггеров/контекста/SKILL.md — это описание привычек.

**🚀 Проект VNIKAY** — веб-TikTok для английского, 10 видео с синхронными субтитрами. Рабочий MVP.
**💡 Совет:** в VNIKAY/ **только один README** — отсутствуют REPORT / PRODUCT / PLAN / AJTBD. Минимум: разнеси написанное по 4 обязательным файлам — это 2 часа.

---

### MnatsakanyanTigran — 4/10

**🔎 Клон:** Формально папки PROJECTCLONE/ нет. В ASMLabs есть `AVITO_CLONE_LOGIC.md` — попытка клонирования без блока «сервис / гипотеза / рвы».
**💡 Совет:** оформи отдельную папку PROJECTCLONE/ по шаблону — сейчас это спрятано внутри ASMLabs.

**🧰 PERSONAL:** 10 скилов в «Наборы скилов» (CV_VEHICLE_DIAGNOSTICS, OCR_VIN_ENGINE_ID, AVITO_PROMO_ADVISOR...). Редкая вертикальная экспертиза (автосервис + инструменты + Авито-ресейл).
**💡 Совет:** нет README формата. Сейчас таблица «Скилл / Назначение» из 2 колонок. Нет списка задач под будущие.

**🚀 Проект:** Два параллельных (ASMLabs; ToolDrive). Есть Python-ядро, CRM-протокол, ROI-модуль, 4-6 .md на проект.
**💡 Совет:** **нет REPORT / PRODUCT / PLAN / AJTBD по шаблону.** Разнеси написанное в STRATEGY.md / MARKET_ANALYSIS.md / TECH_ADAPT.md по 4 обязательным файлам — 2 часа работы, балл поднимется сразу.

---

## Свод скиллов по группам

Суммарно по потоку собрано **~125 скиллов** у 11 участников (у FrantsevAndrew и RostovshchikovIlya скилов как отдельных файлов нет; у MnatsakanyanTigran — нестандартная папка).

### 🔧 Клон-пайплайн — САМАЯ ЧАСТАЯ КАТЕГОРИЯ

Полный набор = бонус на «5». Собран целиком у 2 участников (ObrazumovaZlata, YarochkinaMaria).

| Подгруппа | Кто сделал | Всего |
|---|---|---|
| **Анализ интерфейса / сервиса** | Obrazumova (clone-2-analysis), Yarochkina (cloneability-assessment, product-architecture-mapper), Andreev (анализ-интерфейсов), Romanova (kopirka-references/architecture) | **5** |
| **Поиск сервисов-аналогов** | Obrazumova (clone-1-search), Yarochkina (service-search-for-clone), Andreev (поиск-аналогов) | **3** |
| **Написание ТЗ** | Obrazumova (clone-3-spec), Andreev (написание-тз), Shakin (tz) | **3** |
| **Тестирование / QA** | Obrazumova (clone-5-testing), Yarochkina (rapid-qa-reviewer), Andreev (тестирование-мвп) | **3** |
| **Реализация / MVP-билдер** | Obrazumova (clone-4-implementation), Yarochkina (frontend-mvp-builder) | **2** |
| **Публикация** | Obrazumova (clone-6-publish), Andreev (публикация-продукта) | **2** |

### 🎯 Продуктовые скиллы

| Скилл | Кто | Всего |
|---|---|---|
| **JTBD** | Abdulmanova, Yarochkina (jtbd-extractor) | **2** |
| **Ров-дизайн / moat** | Yarochkina (moat-designer), Andreev (ров-стратегия) | **2** |
| **Market research** | Obrazumova (firecrawl-market-research), Rykunova (market-research) | **2** |
| **Venture scan / скоринг** | Obrazumova (venture-scan-rf) | **1** |
| **Product scope / lean canvas** | Romanova (MVPScopeBuilder, LeanCanvasGenerator — в бэклоге описаны) | — |
| **Оценка решения** | Shakin (ocenka) | **1** |

### 📅 Рабочие ежедневные (operational)

| Скилл | Кто | Всего |
|---|---|---|
| **Weekly review** | Kokin (weekly-review), Rozanova (weekly) | **2** |
| **Decision / decide** | Rozanova (decide), Rykunova (decision-engine) | **2** |
| **Create-note / playbook / contact** | Kokin (3 скилла) | **3** |
| **Process meeting** | Kokin (process-meeting) | **1** |
| **Start project** | Kokin (start-project) | **1** |
| **Project start (доменный)** | Rozanova (kbzhuy-start) | **1** |

### 👷 Инженерные / технические

| Скилл | Кто | Всего |
|---|---|---|
| **Feature dev / fix-it** | Rozanova (feature-dev, fix-it) | **2** |
| **Plan / TZ (инженерный)** | Shakin (plan, tz) | **2** |
| **Push skills / deploy infra** | Shakin (push-skills), Yarochkina (push-to-genai-public) | **2** |
| **Dostup / инфраструктура** | Shakin (dostup) | **1** |
| **Python** | Rykunova (python) | **1** |
| **UI / UX patterns** | Obrazumova (ui-enterprise-sci-saas), Yarochkina (ui-ux-pro-max) | **2** |

### 🎨 Контент и визуал

| Скилл | Кто | Всего |
|---|---|---|
| **Изобразика / генерация картинок** | Kaymakan (изобразика), Shakin (img), Demyanova (img) | **3** |
| **PDF → Markdown** | Shakin (pdf-to-md), Demyanova (pdf-to-md) | **2** |
| **Presentation / preza** | Shakin (preza), Demyanova (presentation) | **2** |
| **Social content (контент-план)** | Kaymakan (social-content) | **1** |
| **Academic writer** | Rykunova (academic-writer) | **1** |

### 💬 Коммуникация / адаптация текста

| Скилл | Кто | Всего |
|---|---|---|
| **Caveman (упрощение)** | Shakin, Demyanova | **2** |
| **Адаптация под аудиторию** | Shakin (klientu: зумер→директор), Demyanova (explain-differently) | **2** |
| **Пиши-сокращай** | Andreev | **1** |

### 🔍 Исследование и анализ

| Скилл | Кто | Всего |
|---|---|---|
| **Market / venture research** | Obrazumova (firecrawl, venture-scan), Rykunova (market-research) | **3** |
| **Due diligence** | Rykunova (due-diligence-gen) | **1** |
| **Paper analyzer** | Rykunova (paper-analyzer) | **1** |
| **Benchling-arch-research (reverse eng.)** | Obrazumova | **1** |

### 🌐 Парсинг / скрейпинг

| Скилл | Кто | Всего |
|---|---|---|
| **Telegram Telethon** | Kaymakan | **1** |
| **Firecrawl / market scraper** | Obrazumova | **1** |
| **Transcription pipeline (Whisper)** | Rostovshchikov (описан как паттерн) | **1** |

### 🏫 Доменные — Образование (топ по объёму)

**DemyanovaDarya — 14 предметных скиллов:**
lesson-plan, homework, curriculum, flashcards, quiz, progress-report, parent-summary, difficulty-adapter, error-analysis, feedback, practice, chunker, planner, resource-picker.

### 🍎 Доменные — Питание/Healthtech

Rozanova: meal-plan, kbzhuy-start.

### 🧬 Доменные — Биотех

Rykunova: bioinformatics.

### 🚗 Доменные — Автосервис / Авито-ресейл

**MnatsakanyanTigran — 10 скиллов** (нестандартная папка, без README-формата):
CV_VEHICLE_DIAGNOSTICS, CV_WHEEL_ALIGNMENT_HELPER, OCR_VIN_ENGINE_ID, PNEUMATIC_TOOL_EXPERT, ELECTRONIC_TOOL_STRESS_TEST, AUTO_LOGISTICS_AVITO, AVITO_PROMO_ADVISOR, SERVICE_STATION_EFFICIENCY, SPARE_PARTS_MATCHING, CUSTOMER_VOICE_ANALYSIS.

### 🧭 Мета / инфраструктура скиллов

| Скилл | Кто |
|---|---|
| Project-clone-workflow (оркестратор) | Obrazumova |
| Noviy-skill (генератор новых скиллов) | Yarochkina |
| Push-skills / push-to-genai-public | Shakin, Yarochkina |

---

## Итог по скиллам: что есть в изобилии, чего не хватает

**Избыток:**
- Клон-пайплайн (полный или почти полный) — **4 потока по 6 этапов**.
- Доменные образовательные скиллы у Demyanova.
- Ежедневные vault-команды у Kokin.

**Дефицит (никто не сделал):**
- **A/B-тест скилл** — прописано в нескольких backlog, не реализовано.
- **Интервью-ассистент** (подготовка гайда + запись + расшифровка + AJTBD-выгрузка).
- **RICE / приоритизация бэклога** — в бэклогах упомянут, но как скилл не оформлен.
- **Funnel / когортный анализ** — в бэклогах нескольких.
- **OKR / goal-setting** скилл.
- **Legal / compliance** скилл (актуально для Rozanova, Rykunova, Kokin, Kaymakan).

**Что ценного можно перенять каждому участнику потока:**
- **Формат скилла на 4 поля** (имя / триггер / что делает / что подкладывает) от Ярочкиной.
- **Разделение meta ↔ domain** скилов от Кокина.
- **Каскад моделей** (Sonnet для тьютора, Haiku для batch) от Демьяновой.
- **Decide + weekly** (дисциплина фиксации решений) от Розановой.
- **Venture-scan-rf с формулой M²×T×A×B×P** от Образумовой.
- **Cloneability-assessment на 10 критериев** от Ярочкиной.
- **Оценка (5 осей + 🟢🔴 градация)** от Шакина.
