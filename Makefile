.DEFAULT_GOAL := help

# Variáveis
DOCKER_COMPOSE ?= docker compose
PORT ?= 8080

.PHONY: help up down restart logs ps open clean build

##@ Ajuda
help: ## Exibe esta mensagem de ajuda
	@echo ""
	@echo "Uso: make [alvo]"
	@echo ""
	@echo "Alvos disponíveis:"
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Docker & Preview
up: ## Inicia o container de preview do README em segundo plano
	$(DOCKER_COMPOSE) up -d --build
	@echo ""
	@echo "🚀 Preview disponível em: http://localhost:$(PORT)"

down: ## Para e remove o container
	$(DOCKER_COMPOSE) down

restart: ## Reinicia o container
	$(DOCKER_COMPOSE) restart

logs: ## Exibe os logs do container em tempo real
	$(DOCKER_COMPOSE) logs -f

ps: ## Exibe o status do container
	$(DOCKER_COMPOSE) ps

open: ## Abre a pré-visualização no navegador padrão
	@xdg-open http://localhost:$(PORT) 2>/dev/null || open http://localhost:$(PORT) 2>/dev/null || echo "Acesse http://localhost:$(PORT) no seu navegador"

build: ## Reconstrói a imagem Docker sem cache
	$(DOCKER_COMPOSE) build --no-cache
