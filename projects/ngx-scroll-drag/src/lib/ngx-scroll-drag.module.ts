import {NgModule} from '@angular/core'
import {ScrollDragDirective} from './scroll-drag.directive'
import {ScrollShadowComponent} from './scroll-shadow/scroll-shadow.component'
import {NgIf} from "@angular/common"

@NgModule({
  declarations: [ScrollDragDirective, ScrollShadowComponent],
  imports: [NgIf],
  exports: [ScrollDragDirective, ScrollShadowComponent]
})
export class NgxScrollDragModule {
}
