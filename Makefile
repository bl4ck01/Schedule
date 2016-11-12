#!/usr/bin/make

path ?= test/

.SILENT: clean install

# Default action if you just run "make"
.PHONY: all
all: clean install

.PHONY: clean
clean:
  # Remove generated files
	rm -rf ./node_modules/
	rm -rf ./coverage/

.PHONY: install
install:
	# Install NodeJS modules
	yarn install;

.PHONY: eslint
eslint:
	# Delint files with ESLint
	./node_modules/eslint/bin/eslint.js \
	config/                     \
	routes/                     \
	public/javascripts/main.js  \
	routes/                     \
	services/                   \
	test/                       \
	app.js;

.PHONY: test
test:
	# Run all tests with code coverage
	snyk test && \
	sudo \
	NODE_TLS_REJECT_UNAUTHORIZED='0' \
	./node_modules/istanbul/lib/cli.js cover \
	./node_modules/mocha/bin/_mocha -- \
	$(CLI_MOCHA) \
	--recursive \
	-R spec \
	$(path)

.PHONY: report
report:
	# Launching code coverage report in browser (Unix)
	xdg-open ./coverage/lcov-report/index.html

.PHONY: start
start:
	# Start the HTTP/HTTPS server
	sudo npm start;

.PHONY: submit
submit: clean install eslint test
