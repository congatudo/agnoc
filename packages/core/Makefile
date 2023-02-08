.NOTPARALLEL:

YARN := yarn
NODE := $(YARN) node
BABEL := $(shell $(YARN) bin babel)
TSC := $(shell $(YARN) bin tsc)
PBJS := $(shell $(YARN) bin pbjs)
PBTS := $(shell $(YARN) bin pbts)
JSON := $(shell $(YARN) bin json)
NYC := $(shell $(YARN) bin nyc)
MOCHA := $(shell $(YARN) bin mocha)

SRC_TS := $(shell find src -name '*.ts')
LIB_JS := $(patsubst src/%.ts,lib/%.js,$(SRC_TS))
LIB_TYPES := $(patsubst src/%.ts,lib/%.d.ts,$(SRC_TS))

.PHONY: all
all: build-schemas $(LIB_JS) $(LIB_TYPES)

.PHONY: build-schemas
build-schemas: schemas/schema.json schemas/schema.js schemas/schema.d.ts

lib/%.js: src/%.ts
	NODE_ENV=production $(BABEL) --out-dir lib --root-mode upward --extensions '.ts' src

lib/%.d.ts: schemas/schema.d.ts src/%.ts
	$(TSC) -b tsconfig.build.json

schemas/schema.json: schemas/schema.proto
	pwd
	$(PBJS) -t json -o $@ $<

schemas/schema.js: schemas/schema.proto
	$(PBJS) -t static -w commonjs -o $@ $<

schemas/schema.d.ts: schemas/schema.js
	$(PBTS) -o $@ $<

.PHONY: test
test: build-schemas
	$(NYC) $(MOCHA) --reporter spec --recursive
	test "$$(cat coverage/coverage-summary.json | $(JSON) total.lines.total)" -gt 0

.PHONY: clean
clean:
	rm -rf .build-cache
	rm -rf lib
	rm -f schemas/schema.json
	rm -f schemas/schema.js
	rm -f schemas/schema.d.ts
