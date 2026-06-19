.PHONY: install dev build sass js fonts images clean docker-build help

GULP         := npx gulp
DOCKER_IMAGE := benrowe-jekyll

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Install Node dependencies and build Jekyll Docker image
	npm install
	docker build -t $(DOCKER_IMAGE) .

docker-build: ## (Re)build the Jekyll Docker image
	docker build -t $(DOCKER_IMAGE) .

dev: ## Build assets + serve with live reload
	$(GULP)

build: ## Build Jekyll site once (no watch/serve)
	$(GULP) jekyll-build

sass: ## Compile SCSS → assets/css/main.css
	$(GULP) sass

js: ## Concatenate and minify JS → assets/js/main.js
	$(GULP) js

fonts: ## Copy fonts to assets/fonts/
	$(GULP) fonts

images: ## Optimise images to assets/img/
	$(GULP) images

clean: ## Remove generated output
	rm -rf _site assets/css assets/js
