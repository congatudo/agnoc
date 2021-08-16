# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.16.0-next.4](https://github.com/adrigzr/agnoc/compare/v0.16.0-next.3...v0.16.0-next.4) (2021-08-16)

### Bug Fixes

- **core:** set battery value interpolation to 100..200 ([02884fd](https://github.com/adrigzr/agnoc/commit/02884fde2059f881d4491ef32b1ae249c7f4032d))

# [0.16.0-next.3](https://github.com/adrigzr/agnoc/compare/v0.16.0-next.2...v0.16.0-next.3) (2021-07-26)

### Features

- add waiting map handler ([f5c112f](https://github.com/adrigzr/agnoc/commit/f5c112f87a726d7e6d76875be0056a107f8e27e4))

# [0.16.0-next.2](https://github.com/adrigzr/agnoc/compare/v0.16.0-next.1...v0.16.0-next.2) (2021-06-21)

### Bug Fixes

- emit not cleaning robot position ([8438b40](https://github.com/adrigzr/agnoc/commit/8438b40b872caa7fe7f9020315eef871d22d5e4e))

# [0.16.0-next.1](https://github.com/adrigzr/agnoc/compare/v0.16.0-next.0...v0.16.0-next.1) (2021-06-15)

### Bug Fixes

- update dependencies ([d0f6a00](https://github.com/adrigzr/agnoc/commit/d0f6a0060804e5c91875e7028a19669776b49e18))

# [0.16.0-next.0](https://github.com/adrigzr/agnoc/compare/v0.15.0...v0.16.0-next.0) (2021-06-15)

### Features

- add device set time ([d74c049](https://github.com/adrigzr/agnoc/commit/d74c049d8a0d8795fab5f119b82471ff70513988))

# [0.15.0](https://github.com/adrigzr/agnoc/compare/v0.14.0...v0.15.0) (2021-06-14)

### Features

- enhance wlan command to connect to the ap ([83b7d18](https://github.com/adrigzr/agnoc/commit/83b7d184616746b1f24c48a5d89c68dcbf33d838))

# [0.14.0](https://github.com/adrigzr/agnoc/compare/v0.13.7...v0.14.0) (2021-06-14)

### Features

- add wlan command to cli ([8cf5f69](https://github.com/adrigzr/agnoc/commit/8cf5f691583c7a03ecb55a269341159af5487d67))

## [0.13.7](https://github.com/adrigzr/agnoc/compare/v0.13.6...v0.13.7) (2021-06-08)

### Bug Fixes

- improve memory usage of robot path ([cc713e5](https://github.com/adrigzr/agnoc/commit/cc713e5a093ba812eaab174d66bc0e99ca6c9297))

## [0.13.6](https://github.com/adrigzr/agnoc/compare/v0.13.5...v0.13.6) (2021-06-08)

### Bug Fixes

- enable path points ([9f8be4f](https://github.com/adrigzr/agnoc/commit/9f8be4fd45cf694accf143d20864a1705f178fbe))
- only update robot position when update flag is truthy ([a4d3d3b](https://github.com/adrigzr/agnoc/commit/a4d3d3b9a3bec1f730217e2c0eff28e3f535ca3e))

## [0.13.5](https://github.com/adrigzr/agnoc/compare/v0.13.4...v0.13.5) (2021-06-08)

### Bug Fixes

- disable path points ([c212064](https://github.com/adrigzr/agnoc/commit/c2120641314af7311a2be975c65bf6ef73f20a1e))

## [0.13.4](https://github.com/adrigzr/agnoc/compare/v0.13.3...v0.13.4) (2021-06-07)

### Bug Fixes

- mop attachment not deattaching ([e27ab3f](https://github.com/adrigzr/agnoc/commit/e27ab3f83cb4d7a83545f7e63e8f6a9c3c1b65ce))

## [0.13.3](https://github.com/adrigzr/agnoc/compare/v0.13.2...v0.13.3) (2021-06-07)

### Bug Fixes

- export device mode ([132d003](https://github.com/adrigzr/agnoc/commit/132d00351f6c15fe5d57e9efda78f36161e26761))

## [0.13.2](https://github.com/adrigzr/agnoc/compare/v0.13.1...v0.13.2) (2021-06-05)

### Bug Fixes

- change to mop mode when it has mop attached ([f20b9f0](https://github.com/adrigzr/agnoc/commit/f20b9f0948a183fc9d26a4ae95d7375ac0bcf6e8))

## [0.13.1](https://github.com/adrigzr/agnoc/compare/v0.13.0...v0.13.1) (2021-05-05)

### Bug Fixes

- check capabilities before changing plan on start/stop ([7c3c585](https://github.com/adrigzr/agnoc/commit/7c3c5851fc7b080aa4894ce779cddd1ffae8faf7))

# [0.13.0](https://github.com/adrigzr/agnoc/compare/v0.12.1...v0.13.0) (2021-05-03)

### Bug Fixes

- restore rooms when starts from dock ([b6b5395](https://github.com/adrigzr/agnoc/commit/b6b53952fb457001cce117b3ed73259a6d7cd381))

### Features

- add enable to rooms ([fafe3f3](https://github.com/adrigzr/agnoc/commit/fafe3f365d9a50e70c8ed0f2d67a01d7a2ef9121))

## [0.12.1](https://github.com/adrigzr/agnoc/compare/v0.12.0...v0.12.1) (2021-04-30)

### Bug Fixes

- clean rooms on 4090 ([211e3e4](https://github.com/adrigzr/agnoc/commit/211e3e401b794d5512136e8b05e58df31706359a))
- state mode 11 is not an error ([96b0325](https://github.com/adrigzr/agnoc/commit/96b03253e34a9f18c4b2032b8d02fface8a6b555))

# [0.12.0](https://github.com/adrigzr/agnoc/compare/v0.11.2...v0.12.0) (2021-04-30)

### Bug Fixes

- add exception to send ([e0321a0](https://github.com/adrigzr/agnoc/commit/e0321a004ec4c91a3f4885a019f7a9d2381b2ed8))
- change add robot event ([68fba00](https://github.com/adrigzr/agnoc/commit/68fba00607491780fba6ecd5781e48ccbed2253e))
- prevent writing socket when is not connected ([4014d19](https://github.com/adrigzr/agnoc/commit/4014d19685b3f8bd22f224b3bf9262ef690635c9))
- remove consumables form C3090 ([dc57957](https://github.com/adrigzr/agnoc/commit/dc579571e982f0c5c335c7f7ae71f2a80d0891e8))

### Features

- add capabilities ([6538678](https://github.com/adrigzr/agnoc/commit/6538678cf60b187fb9978c535daec35531ad242c))
- add pause control ([0407e06](https://github.com/adrigzr/agnoc/commit/0407e06e6d32ad27b268c1bc43ef000fdef3aac1))
- add timeout to commands ([7a4f3e2](https://github.com/adrigzr/agnoc/commit/7a4f3e283e940b3a080e4b4aee42ab10a6150aa8))
- emit map position events ([d234432](https://github.com/adrigzr/agnoc/commit/d23443237bb2fdfb2b103897b0ccfc5d69b2b4c1))

## [0.11.2](https://github.com/adrigzr/agnoc/compare/v0.11.1...v0.11.2) (2021-04-27)

### Bug Fixes

- add mode 11 ([d9954a9](https://github.com/adrigzr/agnoc/commit/d9954a98e7c7181252e83e55be879d3f60d5e152))

## [0.11.1](https://github.com/adrigzr/agnoc/compare/v0.11.0...v0.11.1) (2021-04-23)

### Bug Fixes

- change map mode on restricted zones ([97b5038](https://github.com/adrigzr/agnoc/commit/97b50382833e358907a6d582e920d48cb8011c8f))
- remove phi variant on position ([e01ab20](https://github.com/adrigzr/agnoc/commit/e01ab20ffa23d546dd92807785c3217009a83fe4))

# [0.11.0](https://github.com/adrigzr/agnoc/compare/v0.10.0...v0.11.0) (2021-04-23)

### Features

- add pixel object ([44a12bc](https://github.com/adrigzr/agnoc/commit/44a12bccb529bbb5fd05f3eb80021a258eda4668))
- decode robot path ([1fc9fdd](https://github.com/adrigzr/agnoc/commit/1fc9fddb68f142cc4f07f2b0a05d8b717201a470))

# [0.10.0](https://github.com/adrigzr/agnoc/compare/v0.9.0...v0.10.0) (2021-04-23)

### Bug Fixes

- use 2 bytes for id generation ([64886cb](https://github.com/adrigzr/agnoc/commit/64886cb88b235e068a715547de5f60e970bba97a))

### Features

- add map history map toggle ([247aca2](https://github.com/adrigzr/agnoc/commit/247aca27153c2456b622c06f26f6742a74f0aa77))
- set voice method ([6a834a3](https://github.com/adrigzr/agnoc/commit/6a834a3fbba36d900be566bd8b8a2f34961a905c))

# [0.9.0](https://github.com/adrigzr/agnoc/compare/v0.8.0...v0.9.0) (2021-04-22)

### Bug Fixes

- add code 2102 to errors ([8ad10b5](https://github.com/adrigzr/agnoc/commit/8ad10b5ef8c9609a831d63a3c926da577ac1dc80))
- use existing map before update ([23adcab](https://github.com/adrigzr/agnoc/commit/23adcabfad268bc58c43409b62e7fc3f89de0013))

### Features

- add map reset ([405989b](https://github.com/adrigzr/agnoc/commit/405989bb2c8651c9617b7004f14907546cce5b0f))

# [0.8.0](https://github.com/adrigzr/agnoc/compare/v0.7.1...v0.8.0) (2021-04-22)

### Bug Fixes

- fix room clean ([c0fe3c9](https://github.com/adrigzr/agnoc/commit/c0fe3c9f5e66b37074c2683e06484207602c479d))

### Features

- add support for map segmentation ([b445928](https://github.com/adrigzr/agnoc/commit/b4459288eff89eed99eb924e04781be6f22e50bb))
- **cli:** add read command ([f65967e](https://github.com/adrigzr/agnoc/commit/f65967ec11d7d606ff5034157e6aecc7cb7246a7))
- add history map toggle opcodes ([2474b58](https://github.com/adrigzr/agnoc/commit/2474b586cb206f9cff0866201360d32bcc652663))
- add support for mop mode ([76100a5](https://github.com/adrigzr/agnoc/commit/76100a5547d803d44cc079d9ee04f31db02cba40))

## [0.7.1](https://github.com/adrigzr/agnoc/compare/v0.7.0...v0.7.1) (2021-04-14)

### Bug Fixes

- update quite hours error ([10b335d](https://github.com/adrigzr/agnoc/commit/10b335de2210658a81acdbe60df6779d622f2604))

# [0.7.0](https://github.com/adrigzr/agnoc/compare/v0.6.1...v0.7.0) (2021-04-14)

### Bug Fixes

- add more opcodes ([a571d36](https://github.com/adrigzr/agnoc/commit/a571d3603f9918d813d7f58161bf5b0ca6eecae3))
- send at least one zone when removing restricted zones ([13dddbd](https://github.com/adrigzr/agnoc/commit/13dddbd4ba810601023b121a84b486b8f9143781))
- wait for device mode change ([c3e74c6](https://github.com/adrigzr/agnoc/commit/c3e74c679d9b42a6eaab87a414b882ca78875392))

### Features

- add arrange rooms messages ([89b4602](https://github.com/adrigzr/agnoc/commit/89b4602dbb9162520230c02d75b42e2f47bc43fe))
- add carpet mode toggle ([bd5dbf1](https://github.com/adrigzr/agnoc/commit/bd5dbf1d0fcc53022ee2af3d84d8455e3e327bd1))
- add device config ([bc37358](https://github.com/adrigzr/agnoc/commit/bc373580af62fbe70a40a2dade294ad8f830d303))
- add map control opcodes ([7d9eabc](https://github.com/adrigzr/agnoc/commit/7d9eabc11f4d52fc12a499b06505361d9e5b8533))
- add reset consumable ([4fc39a9](https://github.com/adrigzr/agnoc/commit/4fc39a986338d6403195fdc534a6fd5f548c858d))
- get/set quiet hours ([01bbee8](https://github.com/adrigzr/agnoc/commit/01bbee8415947b75a1382c4787b5a35863318d60))

## [0.6.1](https://github.com/adrigzr/agnoc/compare/v0.6.0...v0.6.1) (2021-04-12)

### Bug Fixes

- get mask on 3090 model ([6672da1](https://github.com/adrigzr/agnoc/commit/6672da179cff3cc7cf58676495fa1f3791b2836c))

# [0.6.0](https://github.com/adrigzr/agnoc/compare/v0.5.0...v0.6.0) (2021-04-12)

### Bug Fixes

- start/stop with area/spot mode ([b16f143](https://github.com/adrigzr/agnoc/commit/b16f143d024037b060456b20eea0c1b70fa95c2e))

### Features

- add restricted zones to map ([12e6180](https://github.com/adrigzr/agnoc/commit/12e61803d8c5f73d3db08294f9eb83e0a240b866))

# [0.5.0](https://github.com/adrigzr/agnoc/compare/v0.4.0...v0.5.0) (2021-04-12)

### Bug Fixes

- fix area clean ([85e04f6](https://github.com/adrigzr/agnoc/commit/85e04f63746ef6e116a9138b221f528f8d047191))
- fix map decode issues ([d6b2ec1](https://github.com/adrigzr/agnoc/commit/d6b2ec16fcb8e6bc4e857f954cfc5f154d7fa156))

### Features

- add room clean ([d313f51](https://github.com/adrigzr/agnoc/commit/d313f51c410769ebab5b21c31303fce0456aadae))

# [0.4.0](https://github.com/adrigzr/agnoc/compare/v0.3.0...v0.4.0) (2021-04-07)

### Bug Fixes

- export manual mode constants ([5f90d24](https://github.com/adrigzr/agnoc/commit/5f90d246f8315132f91496c59337f28f6a59fd4a))
- mark as optional taskList for 3090 ([3985207](https://github.com/adrigzr/agnoc/commit/3985207b3e121e5410e887b71bdf12b20a4ae870))

### Features

- add more opcodes ([a1cf50f](https://github.com/adrigzr/agnoc/commit/a1cf50ffb7f73abe1ae9a42ccd9248d05b98ff01))
- add room entity with pixels ([59cbc10](https://github.com/adrigzr/agnoc/commit/59cbc10b53e2c256c9a535c2c3840f9afd975b8f))

# [0.3.0](https://github.com/adrigzr/agnoc/compare/v0.2.2...v0.3.0) (2021-04-06)

### Bug Fixes

- decode more bytes from map ([292b787](https://github.com/adrigzr/agnoc/commit/292b787ea598605c214d4c1afe677f4a4f7fce2c))
- read status info from map updates ([2c34a98](https://github.com/adrigzr/agnoc/commit/2c34a9889a78930046acc348940c5b3515dafe20))

### Features

- add more opcodes ([332e6b6](https://github.com/adrigzr/agnoc/commit/332e6b60a52cba7f0ae03fb2b2bbcc58be415b4b))
- handle & discard waiting maps ([f30ce36](https://github.com/adrigzr/agnoc/commit/f30ce36c99115f6357277a1edef54a8d073b07a0))
- improve error handling ([bba3454](https://github.com/adrigzr/agnoc/commit/bba3454529cefb2de4288597491f525add348625))

## [0.2.2](https://github.com/adrigzr/agnoc/compare/v0.2.1...v0.2.2) (2021-04-02)

### Bug Fixes

- add map handlers ([#5](https://github.com/adrigzr/agnoc/issues/5)) ([f73ab01](https://github.com/adrigzr/agnoc/commit/f73ab01dce9ec44e0d79e463411c8c75d981f41e))

## [0.2.1](https://github.com/adrigzr/agnoc/compare/v0.2.0...v0.2.1) (2021-04-02)

### Bug Fixes

- add tiny typed emitter to deps ([3a98284](https://github.com/adrigzr/agnoc/commit/3a98284e1bc6627082074c61f248e36afe3bd4c1))

# [0.2.0](https://github.com/adrigzr/agnoc/compare/v0.1.0...v0.2.0) (2021-04-02)

### Features

- add basic server blocks ([#4](https://github.com/adrigzr/agnoc/issues/4)) ([c89da7e](https://github.com/adrigzr/agnoc/commit/c89da7e33d6967496e2c58eba0f7f646c3a08712))

# 0.1.0 (2021-03-10)

### Features

- add encode & decode commands ([9c640c7](https://github.com/adrigzr/agnoc/commit/9c640c72eb2e28fb6ff934529aaed202350a3b21))
