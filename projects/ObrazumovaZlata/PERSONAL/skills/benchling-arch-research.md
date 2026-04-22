# Скилл: Competitive Tech Architecture Research (Benchling-style)

## Триггер

Когда нужно быстро разложить архитектуру конкурента по слоям и понять, где живёт его moat.

## Промпт

```
You are a senior software architect conducting competitive technical analysis.

Research [SERVICE] ([URL]) technical architecture using only publicly available sources:
engineering blog, tech talks, job postings, API docs, and developer documentation.

Extract and structure the following:

## 1. Frontend
- Framework and rendering approach (SPA/SSR/hybrid?)
- State management solution
- Component library / design system
- How they handle real-time collaboration (if any)

## 2. Backend
- API architecture (REST / GraphQL / gRPC?)
- Primary backend language(s) and frameworks
- Service architecture: monolith vs microservices vs modular monolith?
- Authentication / authorization approach (especially multi-tenant)

## 3. Data layer
- Primary database(s) and why
- How they model core entities
- Search infrastructure
- How audit trail / version history is implemented

## 4. Infrastructure & deployment
- Cloud provider and key services used
- How they handle multi-tenancy
- Data isolation approach
- CI/CD and deployment practices

## 5. Key architectural decisions
- What makes their data model unique?
- How do they handle domain-specific structured data?
- What they've said about scaling challenges

## 6. Sources
- List every source with URL

Focus on decisions relevant to building an MVP in the same domain.
Flag which parts are confirmed vs inferred.
```

## Контекст, который нужно подложить

- Название конкурента и URL
- Твой домен (например: ELN/LIMS, fintech, HR)
- Что именно хочешь воспроизвести (визуал / данные / архитектуру)

## Пример применения

Использован для анализа Benchling → выявил: React+Redux фронт, Postgres источник истины, REST API, три поколения search-архитектуры. Главный вывод: moat — не технология, а накопленные данные и switching cost.
