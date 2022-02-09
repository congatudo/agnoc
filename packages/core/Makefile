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

SCHEMA_PROTO := $(shell find schemas -name '*.proto')
SCHEMA_JSON := $(patsubst schemas/%.proto,schemas/%.json,$(SCHEMA_PROTO))
SCHEMA_JS := $(patsubst schemas/%.proto,schemas/%.js,$(SCHEMA_PROTO))
SCHEMA_TYPES := $(patsubst schemas/%.js,schemas/%.d.ts,$(SCHEMA_JS))

.PHONY: all
all: build-schemas $(LIB_JS) $(LIB_TYPES)

.PHONY: build-schemas
build-schemas: $(SCHEMA_JSON) $(SCHEMA_JS) $(SCHEMA_TYPES)

lib/%.js: src/%.ts
	NODE_ENV=production $(BABEL) --out-dir lib --root-mode upward --extensions '.ts' src

lib/%.d.ts: $(SCHEMA_TYPES) src/%.ts
	$(TSC) -b tsconfig.build.json

schemas/%.json: schemas/%.proto
	$(PBJS) -t json -o $@ $<

schemas/%.js: schemas/%.proto
	$(PBJS) -t static -w commonjs -o $@ $<

schemas/%.d.ts: schemas/%.js
	$(PBTS) -o $@ $<

.PHONY: test
test: build-schemas
	$(NYC) $(MOCHA) --reporter spec --recursive
	test "$$(cat coverage/coverage-summary.json | $(JSON) total.lines.total)" -gt 0

.PHONY: clean
clean:
	rm -rf .build-cache
	rm -rf lib
	rm -f schemas/*.json
	rm -f schemas/*.js
	rm -f schemas/*.d.ts
