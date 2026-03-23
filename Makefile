COMPOSE := docker compose
SERVICE := kanji-n5-site
DEV_COMPOSE := docker compose -f docker-compose.dev.yml
DEV_SERVICE := kanji-n5-site-dev

.PHONY: up down build rebuild restart logs ps shell dev dev-down dev-logs dev-ps

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) down
	$(COMPOSE) build --no-cache
	$(COMPOSE) up -d

restart:
	$(COMPOSE) restart $(SERVICE)

logs:
	$(COMPOSE) logs -f $(SERVICE)

ps:
	$(COMPOSE) ps

shell:
	$(COMPOSE) exec $(SERVICE) sh

dev:
	$(DEV_COMPOSE) up -d

dev-down:
	$(DEV_COMPOSE) down

dev-logs:
	$(DEV_COMPOSE) logs -f $(DEV_SERVICE)

dev-ps:
	$(DEV_COMPOSE) ps
