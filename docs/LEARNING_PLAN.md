# План обучения: angular-simulator (Angular 22 + весь стек из резюме)

## Context

В резюме указаны технологии, которые ты не знаешь или знаешь плохо: NgRx, Karma, Jasmine, Jest, Docker, Scrum, Kanban, Agile, Jira, Husky, CI/CD и другие. Цель — пройти ДЗ 15–30 менторинга заново в репозитории `github.com/MuhammadLeziz/angular-simulator` так, чтобы **каждая технология из резюме реально применялась руками** и ты мог объяснить её на собеседовании.

Решения, которые ты принял:

- ДЗ проходишь **для себя**, никто их не проверяет → ТЗ можно расширять и менять подход (например, NgRx вместо BehaviorSubject).
- Задачи ведём в **Jira** (Scrum-доска, спринты).
- Конспекты лежат **в репозитории**, папка `docs/konspekty/`.
- Тесты: используем **все** — Vitest, Jest, Karma+Jasmine.
- Сигналы и архитектура — с первого ДЗ, а не только в 29/30.

Состояние репозитория: Angular 22, **zoneless** (zone.js нет — важно для ДЗ 28), ESLint и Prettier уже настроены под правила ДЗ 26, есть feature-based структура (`core/`, `shared/`, `features/`, `layout/`, `pages/`), вёрстка лендинга РумТибет готова. Один коммит, `main` синхронизирован с origin, `.github/` нет. Локально: Node 26, git есть; `gh`, Docker и PowerShell 7 не установлены.

## Как мы работаем (правила)

1. **Код пишешь только ты.** Я объясняю, даю ТЗ и шаблоны, делаю ревью. В `src/` и в конфиги ничего не пишу без твоего прямого «сделай».
2. Без отдельного «можно» мне разрешено: писать конспекты в `docs/konspekty/`, вести мою память. Задачи в Jira, настройки GitHub и прочие внешние действия — каждый раз спрашиваю.
3. Аккаунты (Jira, Docker Hub и т.д.) создаёшь **ты** — мне это запрещено. Пароли и токены тоже вводишь сам.
4. Цикл по каждому ДЗ, как на реальной работе:
   `теория от меня → задача в Jira → ветка feature/HW-XX → ты пишешь код → PR → CI зелёный → моё ревью как у тимлида → merge → конспект → устные вопросы из ДЗ → мои доп. задачи`
5. Коммиты по Conventional Commits (`feat:`, `fix:`, `chore:`…), это будет проверять commitlint.

## Этапы

### Этап 0 — Инфраструктура (это первый шаг)

| Шаг | Что делаем                                                                                                                                                     | Технологии                 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 0.1 | Git-процесс: ветки, PR на GitHub, защита `main` (merge только через PR и только при зелёном CI)                                                                | Git, GitHub                |
| 0.2 | **CI на GitHub Actions**: `.github/workflows/ci.yml` — установка зависимостей (`npm ci` + кэш), lint, `prettier --check`, тесты, build; запуск на push и на PR | CI/CD, GitHub Actions      |
| 0.3 | Husky + lint-staged (pre-commit: линт только изменённых файлов) + commitlint (commit-msg)                                                                      | Husky                      |
| 0.4 | Теория Agile / Scrum / Kanban → ты создаёшь Jira Free → я (по твоему «ок») создаю Scrum-проект: эпики = ДЗ, задачи = пункты ДЗ, спринт = 2 недели              | Agile, Scrum, Kanban, Jira |
| 0.5 | `docs/konspekty/` + `docs/LEARNING_PLAN.md` (эта карта)                                                                                                        | —                          |

Шаг 0.2 выдаю первым: пошаговый конспект `docs/konspekty/01-ci-cd-github-actions.md` — что такое CI/CD, где в GitHub это находится (вкладка Actions, Settings → Branches / Rulesets, Settings → Secrets), разбор каждого ключа workflow (`on`, `jobs`, `runs-on`, `steps`, `uses`, `with`, кэш, `needs`, матрица), шаблон под этот проект, как читать логи упавшего job, типичные ошибки. Файл `ci.yml` пишешь сам, я проверяю.

### Этап 1 — ДЗ 15 и 16 (разминка, но уже с сигналами)

- Вёрстка лендинга уже есть → делаем логику: интерполяция, enum `Color` + `isPrimaryColor`, localStorage (дата захода, счётчик), generic `Collection<T>`, двусторонняя привязка, disabled-кнопка, таймер, счётчик, live-input, фейковый лоадер.
- Всё состояние — на `signal` / `computed` (сразу, как ты просил).
- **Первые тесты:** Vitest на `isPrimaryColor` и `Collection<T>` — это чистые функции и классы, самый простой вход в тестирование. Тут же проходим синтаксис `describe` / `it` / `expect`: он общий для Jasmine, Jest и Vitest.
- Доп. задача от меня: написать тест раньше кода (первое знакомство с TDD).

### Этап 2 — ДЗ 19 и 20 (сервисы, ng-template, роутинг)

- MessageService, LocalStorageService<T>, страницы home / users / not-found, routerLink / routerLinkActive, компонент сообщений.
- Сервисы на сигналах. Тесты сервисов через TestBed.
- **Karma + Jasmine**: подключаем как второй раннер (runner `karma` у `@angular/build:unit-test` — проверю в документации на этом этапе) и прогоняем часть тестов в браузере. Разбираем, чем Karma отличается от Vitest+jsdom.

### Этап 3 — ДЗ 21 (RxJS, HTTP) + **старт NgRx**

- Message и Loader на RxJS по ТЗ (`BehaviorSubject` + `asObservable`, async pipe) — RxJS нужно знать отдельно.
- **Users — на NgRx Store**: `@ngrx/store`, `@ngrx/effects`, `@ngrx/store-devtools`. Разбор: action → reducer → selector → effect (HTTP, `catchError`, `finalize` → лоадер). Смотрим поток в Redux DevTools.
- Доп. задача: написать ту же загрузку на BehaviorSubject и сравнить обе версии — так становится понятно, зачем вообще нужен NgRx.
- Тесты reducer и selectors — чистые функции, тестируются без TestBed.

### Этап 4 — ДЗ 22 (smart/dumb, реактивные формы, CRUD)

- UserCard (`input()`), удаление/создание через `output()`, UserCreate на Reactive Forms, UsersFilter (`debounceTime`, `distinctUntilChanged`).
- CRUD — через actions NgRx, синхронизация с localStorage через effect (или meta-reducer), фильтрация — selector с параметром.
- **Jest**: переносим часть unit-тестов (reducers, selectors, утилиты) на Jest с отдельным конфигом. Разбираем, где Jest, Vitest и Jasmine отличаются (моки, `jest.fn` против `jasmine.createSpy` против `vi.fn`).
- Доп. задача от меня: кэширование запроса через `shareReplay` (есть в резюме).

### Этап 5 — ДЗ 23 (UI-киты, темы)

- PrimeNG, FontAwesome, ThemeService (тёмный режим + пресеты Aura / Lara / Nora), `:host` / `::ng-deep`, ViewEncapsulation.
- Доп. задачи: **Storybook** для `shared/ui` (section-head, user-card) — дизайн-система из резюме; маленький эксперимент с **Angular Material** и **Bootstrap** в отдельной ветке, чтобы понимать разницу UI-китов.

### Этап 6 — ДЗ 24 (пайпы, директивы)

- uppercase, кастомные `plural` и `phone` (4 режима), директивы bold и gradient-border (Renderer2 / HostListener).
- Пайпы — идеальная практика unit-тестов: по таблице входов и выходов на каждый режим.

### Этап 7 — ДЗ 25 (роутинг, интерсепторы, auth) — большой модуль

- 25.1: lazy loading всех роутов, logging-интерсептор и error-интерсептор (5xx → сообщение).
- 25.2: Posts CRUD (DummyJSON, p-table, пагинация, skeleton, контекстное меню, резолвер, dialog) → **@ngrx/entity** + effects.
- 25.3: Auth — **JWT**, refresh-token flow в интерсепторе, AuthGuard, `auth/me` при старте приложения; auth-состояние в NgRx.
- 25.4: AdminGuard (**RBAC**).
- Тесты: `HttpTestingController`, тесты guard и интерсептора.

### Этап 8 — ДЗ 26 (ESLint / Prettier)

- Конфиг уже соответствует ТЗ → разбираем каждое правило, включаем закомментированное `padded-blocks`, показываем ошибки прямо в редакторе, делаем два коммита. Связываем с Husky и CI из этапа 0.

### Этап 9 — ДЗ 27 (DI)

- InjectionToken, `DATE_PIPE_DEFAULT_OPTIONS`, `APP_CONFIG` через `useValue`, флаги `enableLogs`, `enableNotifications`, `enableTheming`. Ответы на вопросы — в `homework-27.md`.

### Этап 10 — ДЗ 28 (Change Detection)

- Папка `homework-28`, три задания (OnPush и мутация объекта, 6 сценариев с `ngDoCheck`, markForCheck / detectChanges / detach / reattach).
- Важный момент: проект **zoneless**. Сценарии с setTimeout / Promise ведут себя иначе, чем в классическом Angular с zone.js. Прогоняем их в обоих режимах и сравниваем — это вопрос уровня middle на собеседовании.

### Этап 11 — ДЗ 29 (Signals глубоко)

- `resource()`, Signal Forms, Products & Cart (поиск, пагинация, сортировка, категории, корзина, subtotal / tax / total через `computed`).
- Корзина — на **NgRx SignalStore** (`@ngrx/signals`): второй подход NgRx, сравниваем с классическим Store из этапа 3.
- Ответы на вопрос «почему здесь Signal, а здесь Observable».

### Этап 12 — ДЗ 30 (архитектура)

- Выбор и обоснование: Feature-Based + Core/Shared + **Facade** поверх NgRx, Smart/Dumb, SOLID / KISS / DRY / YAGNI / SoC.
- PR с аргументацией и деревом проекта — пишешь в стиле настоящего Architecture Decision Record.

### Этап 13 — Docker и CD (есть в резюме, в ДЗ нет — моё добавление)

- Ты ставишь Docker Desktop (WSL2). Multi-stage `Dockerfile` (сборка на node → раздача через nginx), `nginx.conf` с SPA-fallback, `.dockerignore`, `docker-compose.yml`.
- CI собирает образ и пушит в GHCR; **автодеплой на staging** — пункт из резюме. Репозиторий приватный, а GitHub Pages на бесплатном плане работает только с публичными → деплоим на Netlify или Vercel (токен кладёшь в GitHub Secrets сам).

### Этап 14 — бонусы из резюме

- **WebSocket**-модуль: реконнект и очередь сообщений при обрыве (есть в резюме).
- **GitLab CI**: зеркало репозитория и `.gitlab-ci.yml`, эквивалентный GitHub Actions — сравнение двух систем (у тебя уже есть конспект по GitLab).
- Performance: OnPush, `track`, lazy, бандл-анализ, замер TTI через Lighthouse — чтобы цифры из резюме было чем подкрепить.

## Сквозные практики

- **Scrum**: спринт = 2 недели. Планирование в начале (я создаю спринт в Jira), в начале каждой сессии короткий «дейли» в чате, демо и ретро в конце спринта — ретро записываем в `docs/`.
- После каждой темы — конспект `docs/konspekty/NN-тема.md`: что это, зачем, как работает, как применили у нас, типичные ошибки, вопросы для собеседования.
- Устные вопросы из ДЗ: я спрашиваю, ты отвечаешь, я поправляю.

## Что я сохраню в память (сразу после одобрения)

В память этого проекта (`…/projects/C--Users-001Le-OneDrive-Desktop-NurTech-angular-simulator/memory/`):

- цель обучения и список технологий из резюме, этот план, текущий этап;
- жёсткое правило «код пишешь только ты»;
- решения: Jira, конспекты в `docs/konspekty/`, ТЗ можно расширять, используем все тестовые раннеры;
- особенности окружения: PowerShell 5.1 (нет `&&`), zoneless, OneDrive.

## Проверка

- Этап 0: PR с `ci.yml` → во вкладке Actions проходят все job'ы; намеренно сломанный линт даёт красный CI и блокирует merge; Husky не даёт сделать коммит с ошибкой линта или с неправильным сообщением.
- Каждое ДЗ: `npm run lint`, `npm test`, `npm run build` локально и в CI зелёные; ручная проверка в браузере (`npm start`); для NgRx — поток actions в Redux DevTools.
- Docker: `docker compose up` → приложение открывается на localhost, работает прямая ссылка на вложенный роут (SPA-fallback).
