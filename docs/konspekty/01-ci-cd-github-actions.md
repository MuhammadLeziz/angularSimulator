# 01. CI/CD на GitHub Actions

> Этап 0.2 плана. Результат: при каждом push и каждом PR GitHub сам проверяет линт, форматирование, тесты и сборку.
> Файл `.github/workflows/ci.yml` пишешь **ты**, я проверяю.

---

## 1. Что такое CI/CD и зачем он нужен

**CI (Continuous Integration, непрерывная интеграция)** — каждый push автоматически проверяется: собирается ли проект, проходит ли линтер, зелёные ли тесты.

**CD (Continuous Delivery / Deployment, непрерывная доставка)** — если проверки прошли, код автоматически собирается и выкладывается: на тестовый стенд (staging) или в прод. CD у нас будет на этапе 13 (Docker + деплой).

Зачем, если можно проверить руками:

1. **«У меня работало».** CI собирает проект **с нуля в чистой виртуальной машине** — из того, что реально лежит в git. Забыл закоммитить файл — CI упадёт, и ты узнаешь об этом раньше коллеги.
2. **Человек забывает.** Линтер ты запустишь девять раз из десяти. CI — десять из десяти.
3. **Защита ветки.** Можно запретить merge в `main`, пока проверки красные. Сломанный код физически не попадает в основную ветку.

На собеседовании CI/CD — это не «я знаю YAML», а умение объяснить эти три пункта.

---

## 2. Как GitHub Actions устроен внутри

```
push / PR ──▶ GitHub читает .github/workflows/*.yml
                   │
                   ▼
             workflow (один файл = один сценарий)
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
      job 1      job 2      job 3      ← каждый job = отдельная чистая ВМ (runner)
     (steps)    (steps)    (steps)     ← steps выполняются по порядку
```

| Термин       | Что это                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **workflow** | Файл `.yml` в папке `.github/workflows/`. Их может быть несколько (ci.yml, deploy.yml…)              |
| **event**    | Что запускает workflow: `push`, `pull_request`, расписание, ручной запуск                            |
| **job**      | Набор шагов на **одной** машине. Разные jobs по умолчанию идут **параллельно** на **разных** машинах |
| **step**     | Один шаг: либо shell-команда (`run`), либо готовое действие (`uses`)                                 |
| **action**   | Готовый переиспользуемый шаг из Marketplace, например `actions/checkout` — «скачай код репозитория»  |
| **runner**   | Виртуальная машина, на которой выполняется job. `ubuntu-latest` — бесплатная Linux-ВМ от GitHub      |

Два факта, которые надо запомнить:

- **Каждый job стартует на пустой машине.** Там нет ни твоего кода, ни `node_modules`. Поэтому в каждом job есть checkout, установка Node и `npm ci`.
- **Job красный, если любая команда вернула код выхода ≠ 0.** Никакой магии: `npm run lint` нашёл ошибку → вернул 1 → job упал.

---

## 3. Куда заходить в GitHub (карта интерфейса)

Открывай `github.com/MuhammadLeziz/angular-simulator`:

| Где                                                           | Зачем                                                                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Вкладка **Actions**                                           | Список всех запусков. Клик по запуску → по job → развернуть шаг → полный лог терминала                  |
| Страница **PR**, блок внизу **Checks**                        | Статус проверок прямо в PR: ✅ / ❌ / 🟡. Кнопка **Details** ведёт в лог                                |
| **Settings → Actions → General**                              | Какие actions разрешены (оставь «Allow all actions») и права токена (оставь «Read repository contents») |
| **Settings → Rules → Rulesets** (или **Settings → Branches**) | Защита `main`: запрет прямого push, merge только через PR и только с зелёным CI (см. раздел 8)          |
| **Settings → Secrets and variables → Actions**                | Секреты (токены деплоя и т.п.). Понадобится на этапе 13. **Секреты никогда не пишутся в yml**           |
| Твой профиль → **Settings → Billing and licensing**           | Сколько минут Actions потрачено. Приватный репо на Free: 2000 минут в месяц, нам этого с запасом        |

---

## 4. Разбор ключей workflow

### `name`

Как workflow называется во вкладке Actions.

```yaml
name: CI
```

### `on` — когда запускать

```yaml
on:
  push:
    branches: [main] # push в main (например, после merge)
  pull_request:
    branches: [main] # любой PR, который целится в main
```

Почему не просто `on: push`: тогда при push в ветку, у которой открыт PR, проверки запустятся **дважды** — один раз на push, второй на PR. С такой настройкой ветки проверяются через PR, а `main` — после merge.

Полезно знать ещё:

```yaml
on:
  workflow_dispatch: # кнопка «Run workflow» во вкладке Actions — ручной запуск
```

### `concurrency` — не гонять старые запуски

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

Запушил, через минуту запушил исправление — первый запуск уже не нужен, он отменяется. Экономит минуты. `${{ ... }}` — это выражение: GitHub подставляет значение. `github.ref` — текущая ветка.

### `permissions` — минимальные права

```yaml
permissions:
  contents: read
```

Workflow получает токен `GITHUB_TOKEN`. По принципу наименьших привилегий даём ему только чтение кода. Если в workflow попадёт вредоносный action, он ничего не сможет запушить.

### `jobs` — задачи

```yaml
jobs:
  quality: # id job'а — латиницей, без пробелов
    name: Lint & Format # как отображается в интерфейсе
    runs-on: ubuntu-latest # на какой машине
    steps: [...]
```

### `steps` — шаги

Два вида шагов:

```yaml
steps:
  - uses: actions/checkout@v7 # готовый action: скачать код
  - run: npm ci # shell-команда
  - name: Lint # имя шага в логе (необязательно, но удобно)
    run: npm run lint
```

`@v7` — это **мажорная версия** action. Её фиксируют всегда: без неё возьмётся самая свежая, и однажды workflow сломается сам по себе. Актуальную версию смотри на странице action в Marketplace или в его Releases на GitHub.

### `with` — параметры для action

```yaml
- uses: actions/setup-node@v7
  with:
    node-version: 26
    cache: npm
```

- `node-version` — версия Node. **Бери ту же мажорную, что у тебя локально** (`node -v` → v26). Разошлись версии → CI проверяет не то, что ты тестировал. Angular 22 поддерживает Node 22, 24 и 26+.
- `cache: npm` — кэш загрузок npm между запусками. Ключ кэша — хеш `package-lock.json`: поменялись зависимости → кэш пересоберётся, не поменялись → возьмётся готовый. В `setup-node` v5+ кэш npm включается и сам, если в `package.json` есть поле `packageManager` (у нас есть), но явное `cache: npm` понятнее.

### `needs` — порядок между jobs

```yaml
build:
  needs: [quality, test] # build стартует, только если quality И test зелёные
```

Без `needs` все jobs идут параллельно. Сборка — самый долгий шаг, нет смысла гонять её, если линт уже красный.

### `if` — условие для шага или job

```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main' # только в main
```

Пригодится для CD.

### Матрица (для общего понимания, нам пока не нужна)

```yaml
strategy:
  matrix:
    node: [22, 24, 26]
steps:
  - uses: actions/setup-node@v7
    with:
      node-version: ${{ matrix.node }}
```

Один job превращается в три параллельных — по одному на каждую версию Node. Нужно для библиотек, которые должны работать везде. Нашему приложению хватает одной версии.

---

## 5. Шаблон под наш проект

Файл: **`.github/workflows/ci.yml`** (точка в начале папки обязательна; отступы — только пробелы).

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  quality:
    name: Lint & Format
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: ESLint
        run: npm run lint

      - name: Prettier
        run: npx prettier --check .

  test:
    name: Unit tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --watch=false

  build:
    name: Build
    needs: [quality, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: 26
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
```

### Почему именно так

| Решение                              | Почему                                                                                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `quality` и `test` — **разные** jobs | Идут параллельно → быстрее. И в PR сразу видно, что именно упало: стиль или логика                                                                                                   |
| `build` через `needs`                | Не тратим время на сборку, если проверки уже красные                                                                                                                                 |
| `npm ci`, а не `npm install`         | `ci` ставит **строго** версии из `package-lock.json` и падает, если lock рассинхронизирован. `install` может молча подтянуть более новую версию → CI проверит не тот код, что у тебя |
| `prettier --check`, а не `--write`   | В CI код нельзя **исправлять**, только **проверять**. `--check` возвращает 1, если форматирование нарушено                                                                           |
| `npm test -- --watch=false`          | `--` передаёт флаг внутрь `ng test`. Без watch тесты прогонятся один раз и завершатся. В CI Angular и так отключает watch, но явно — понятнее и надёжнее                             |
| checkout + setup-node в каждом job   | Каждый job — отдельная пустая машина (раздел 2). Повторение неизбежно. Убрать его можно через composite action, но это оверинжиниринг для трёх jobs                                  |

### Дополнительно: сохранить сборку (артефакт)

Машина после job уничтожается, а вместе с ней и `dist/`. Если нужно скачать сборку из интерфейса или передать её в job деплоя — объявляешь артефакт:

```yaml
- name: Upload build
  uses: actions/upload-artifact@vX # ← найди актуальную мажорную версию сам (Marketplace → upload-artifact)
  with:
    name: dist
    path: dist/
    retention-days: 7 # всегда ставь срок, иначе артефакты съедают квоту
```

Это задание со звёздочкой: добавь шаг в job `build` и найди `dist` на странице запуска, блок **Artifacts**.

---

## 6. Пошагово: что делаешь ты

Команды для PowerShell 5.1 — по одной, без `&&`.

**1.** Новая ветка. В `main` напрямую не работаем — так и на реальной работе:

```bash
git checkout -b ci/github-actions
```

**2.** Создай в VS Code файл `.github/workflows/ci.yml` и напиши workflow. **Не копируй шаблон целиком** — набери руками, проговаривая, что делает каждая строка. Так он запомнится.

**3.** Проверь у себя то же, что будет проверять CI:

```bash
npm run lint
```

```bash
npx prettier --check .
```

```bash
npm test -- --watch=false
```

```bash
npm run build
```

**4.** Коммит и push:

```bash
git add .github/workflows/ci.yml
```

```bash
git commit -m "ci: add GitHub Actions workflow for lint, tests and build"
```

```bash
git push -u origin ci/github-actions
```

**5.** На GitHub появится жёлтая плашка **Compare & pull request** → создай PR в `main` → внизу PR смотри блок **Checks**.

**6.** Скажи мне — я проверю `ci.yml` и логи.

### ⚠️ Чего ожидать: первый запуск будет красным — и это нормально

Я заранее прогнал все проверки на текущем коде:

| Проверка           | Результат                                                                           |
| ------------------ | ----------------------------------------------------------------------------------- |
| `npm run lint`     | ✅ All files pass linting                                                           |
| `npm test`         | ✅ 2 passed                                                                         |
| `npm run build`    | ✅ собирается                                                                       |
| `prettier --check` | ❌ **`angular.json`, `tsconfig.app.json`, `tsconfig.spec.json`** не отформатированы |

То есть job `quality` упадёт на шаге Prettier. Это твоё первое задание по чтению логов: открой упавший job, найди, какие файлы названы, и исправь:

```bash
npx prettier --write angular.json tsconfig.app.json tsconfig.spec.json
```

Потом отдельный коммит (`style: format config files with prettier`), push — CI перезапустится сам и станет зелёным. Здесь ты увидишь весь смысл CI: он поймал проблему, которую никто не заметил глазами.

**7.** Мои файлы из `docs/` (план и этот конспект) тоже закоммить в эту ветку отдельным коммитом:

```bash
git add docs
```

```bash
git commit -m "docs: add learning plan and CI/CD notes"
```

---

## 7. Как читать упавший job

1. PR → Checks → у красного job нажми **Details** (или вкладка Actions → запуск → job).
2. Слева список шагов: красный крестик — на каком шаге упало.
3. Разверни шаг: там полный вывод терминала. Ищи **снизу вверх** — ошибка обычно в последних строках, над `Error: Process completed with exit code 1`.
4. Воспроизведи **локально ту же команду** — исправляй у себя, а не «пушем наугад».
5. Кнопка **Re-run jobs** (справа сверху) — перезапустить без нового коммита. Нужна, если падение случайное (например, сеть).

---

## 8. Защита ветки `main`

Цель: в `main` нельзя пушить напрямую, merge — только через PR и только когда CI зелёный.

**Где:** Settings → Rules → Rulesets → **New branch ruleset**:

- Target branches → Include default branch (`main`)
- ✅ Restrict deletions
- ✅ Require a pull request before merging
- ✅ Require status checks to pass → добавь `Lint & Format`, `Unit tests`, `Build` (они появятся в списке после первого запуска CI)
- ✅ Block force pushes

**⚠️ Ограничение приватного репозитория.** На бесплатном плане GitHub защита веток и rulesets **применяются только в публичных репозиториях**. В приватном их можно настроить, но GitHub покажет баннер, что правила не будут действовать без GitHub Pro. Проверь это сам, когда откроешь страницу: баннер будет прямо над формой.

Варианты:

1. **GitHub Student Developer Pack** (education.github.com) — ты студент ГГНТУ, а в пакет входит **GitHub Pro бесплатно**. Подтверждается студенческой почтой или фото студенческого. Лучший вариант: плюс куча других бесплатных инструментов.
2. Сделать репозиторий **публичным** — заодно он станет портфолио для работодателя.
3. Оставить как есть и соблюдать правило «только через PR» самодисциплиной. CI всё равно будет запускаться и показывать статус.

---

## 9. GitHub Actions vs GitLab CI (у тебя есть оба конспекта)

| Понятие                 | GitLab CI                                 | GitHub Actions                                                     |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------ |
| Файл                    | `.gitlab-ci.yml` — один, в корне          | `.github/workflows/*.yml` — может быть несколько                   |
| Когда запускать         | `rules`, `workflow:rules`                 | `on` + `if`                                                        |
| Окружение               | `image: node:22` (Docker-образ)           | `runs-on: ubuntu-latest` + `setup-node`                            |
| Порядок                 | `stages` (этапы)                          | `needs` (зависимости между jobs)                                   |
| Переиспользование шагов | `extends`, `include`, шаблоны `.job`      | `uses:` готовых actions из Marketplace                             |
| Кэш                     | `cache:`                                  | `cache:` в setup-node или `actions/cache`                          |
| Артефакты               | `artifacts:`                              | `actions/upload-artifact`                                          |
| Секреты                 | Settings → CI/CD → Variables              | Settings → Secrets and variables → Actions                         |
| Раннеры                 | shared runners (нужна верификация картой) | GitHub-hosted runners, 2000 мин на Free для приватных репозиториев |

Главное отличие: в GitLab порядок задают **этапы**, а в GitHub — **граф зависимостей** через `needs`. Плюс в GitHub огромный Marketplace готовых actions.

---

## 10. Частые ошибки

| Симптом                                                         | Причина                                                                                                        |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Во вкладке Actions пусто, ничего не запустилось                 | Файл не в `.github/workflows/` (опечатка в пути, нет точки), или событие в `on` не совпало                     |
| `Invalid workflow file` / ошибка YAML                           | Табы вместо пробелов, сбитые отступы. YAML чувствителен к отступам                                             |
| `npm ci` → `package.json and package-lock.json are not in sync` | Поменял зависимости и не закоммитил `package-lock.json` → `npm install` локально и закоммить lock              |
| Тесты висят до таймаута                                         | Запущены в watch-режиме → добавь `--watch=false`                                                               |
| Локально зелено, в CI красно                                    | Разные версии Node; незакоммиченный файл; регистр в имени файла (Windows его не различает, Linux — различает!) |
| Нужный check не появляется в ruleset                            | Он появится в списке только после того, как CI хотя бы раз запустится                                          |

Про регистр — важная ловушка для Windows: `import './Header'` при файле `header.ts` у тебя работает, а на Linux-раннере — нет.

---

## 11. Вопросы для самопроверки (могут спросить на собеседовании)

1. Чем CI отличается от CD? Что из этого мы сделали на этом этапе?
2. Почему в CI используют `npm ci`, а не `npm install`?
3. Что происходит с файлами после завершения job? Как передать `dist/` в другой job?
4. Почему jobs `quality` и `test` разделены, а `build` ждёт их через `needs`?
5. Почему `prettier --check`, а не `--write`?
6. Зачем фиксировать версию action (`@v7`)? Что будет, если не фиксировать?
7. Где хранить токен для деплоя и почему не в yml?
8. Что такое `GITHUB_TOKEN` и зачем ограничивать `permissions`?
9. Почему локально тесты могут проходить, а в CI — падать? Назови три причины.
10. Как сделать так, чтобы сломанный код не попал в `main`?
