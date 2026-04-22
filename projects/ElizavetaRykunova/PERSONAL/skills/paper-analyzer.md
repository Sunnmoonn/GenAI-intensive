# Skill: paper-analyzer

## Purpose
Глубокий разбор научных статей (Nature, Science, Cell, PubMed) с извлечением методологии, логики исследования и критической оценки.

---

## Trigger
Активируется при:
- загрузке научной статьи
- запросе "объясни paper"
- разборе метода / эксперимента
- подготовке к семинарам или экзаменам

---

## Core Function

### 1. Structural decomposition
Разбирает статью на:
- Background
- Hypothesis
- Methods
- Results
- Conclusion

---

### 2. Method interpretation
- объясняет experimental design
- переводит сложные методы в понятную логику
- выделяет контрольные группы и переменные

---

### 3. Critical analysis
- что доказано реально
- что является интерпретацией авторов
- где возможны ограничения
- потенциальные biases

---

### 4. Biological interpretation (for biotech papers)
- связывает результаты с механизмами
- объясняет биологический смысл
- упрощает молекулярные процессы

---

## Context Inputs
- тип статьи (review / experimental / clinical)
- уровень глубины (quick / deep dive)
- область (bio / neuro / biotech / general science)

---

## Output Format

### 1. One-line summary
Суть статьи в 1–2 предложениях

### 2. Study design
Как устроен эксперимент

### 3. Key findings
Основные результаты

### 4. Mechanistic explanation
Как это работает биологически / технически

### 5. Limitations
Слабые стороны

### 6. Why it matters
Зачем это важно

---

## Style Rules
- без пересказа “как в аннотации”
- всегда объяснять “почему это работает”
- минимум терминов без объяснения
