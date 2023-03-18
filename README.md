# Angular Scroll Drag

There are situations that it would be nice for the user to be able to also scroll using a mouse drag. That's why I
created this angular library.


## How to get started
```shell
npm i @azerafati/ngx-scroll-drag 
```
* Add `ngxScrollDrag` on a scrolling element, now that element can also be scrolled by a mouse drag.
* The ScrollDrag Element can have a shadow if you add `[scrollShadow]="true"` indicating the out of view content. This uses background gradients which is perfect in most cases, unless the scrolling content is using complex z-index which might render on top of the shadow.
* If you want to show scroll shadows and have z-index issues, wrap your scrolling element with `<ngx-scroll-shadow>` tag.

[**See the Demo**](https://azerafati.com/scroll-drag/)



## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).


----

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. 


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
