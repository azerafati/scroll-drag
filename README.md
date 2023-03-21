# Angular Scroll Drag Directive

[![Build Status](https://github.com/azerafati/scroll-drag/actions/workflows/test.yml/badge.svg)](https://github.com/azerafati/scroll-drag/actions)
[![npm version](https://img.shields.io/npm/v/@azerafati/ngx-scroll-drag.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen.svg)](https://www.npmjs.com/package/@azerafati/ngx-scroll-drag)
[![Issues](https://img.shields.io/github/issues/azerafati/scroll-drag.svg)](https://github.com/azerafati/scroll-drag/issues)
[![Issues](https://img.shields.io/npm/dt/@azerafati/ngx-scroll-drag.svg)](https://www.npmjs.com/package/@azerafati/ngx-scroll-drag)
[![Issues](https://img.shields.io/codecov/c/github/azerafati/ngx-scroll-drag/main.svg?maxAge=43200)](https://www.npmjs.com/package/@azerafati/ngx-scroll-drag)
[![License](https://img.shields.io/github/license/azerafati/scroll-drag.svg)](#license)

Scroll using mouse drag


## Getting started

```
npm i @azerafati/ngx-scroll-drag
```
* Add `ngxScrollDrag` on a scrolling element, now that element can also be scrolled by a mouse drag.
* The ScrollDrag Element can have a shadow if you add `[scrollShadow]="true"` indicating the out of view content. This uses background gradients which is perfect in most cases, unless the scrolling content is using complex z-index which might render on top of the shadow.
* If you want to show scroll shadows and have z-index issues, wrap your scrolling element with `<ngx-scroll-shadow>` tag.

[**See the Demo**](https://azerafati.com/scroll-drag/)



## Running unit tests

Run `npm test` to execute the unit tests via [Jest](https://jestjs.io/).


----

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. 


## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.
