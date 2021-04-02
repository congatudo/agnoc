.NOTPARALLEL:

YARN := yarn
NODE := $(YARN) node
BABEL := $(shell $(YARN) bin babel)
TSC := $(shell $(YARN) bin tsc)
JSON := $(shell $(YARN) bin json)
NYC := $(shell $(YARN) bin nyc)
MOCHA := $(shell $(YARN) bin mocha)

SRC_TS := $(shell find src -name '*.ts')
LIB_JS := $(patsubst src/%.ts,lib/%.js,$(SRC_TS))
LIB_TYPES := $(patsubst src/%.ts,lib/%.d.ts,$(SRC_TS))

.PHONY: all
all: $(LIB_JS) $(LIB_TYPES)

lib/%.js: src/%.ts
	NODE_ENV=production $(BABEL) --out-dir lib --root-mode upward --extensions '.ts' src

lib/%.d.ts: src/%.ts
	$(TSC) -b tsconfig.build.json

.PHONY: test
test:
	$(NYC) $(MOCHA) --reporter spec --recursive
	test "$$(cat coverage/coverage-summary.json | $(JSON) total.lines.total)" -gt 0

.PHONY: clean
clean:
	rm -rf .build-cache
	rm -rf lib
