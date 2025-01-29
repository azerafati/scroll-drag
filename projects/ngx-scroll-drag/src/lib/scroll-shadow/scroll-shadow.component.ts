import { AfterContentInit, Component, ContentChild } from '@angular/core'
import { ScrollDragDirective, ShadowDir } from "../scroll-drag.directive"

@Component({
    selector: 'ngx-scroll-shadow',
    templateUrl: './scroll-shadow.component.html',
    styleUrls: ['./scroll-shadow.component.scss'],
    standalone: false
})
export class ScrollShadowComponent implements AfterContentInit {

  @ContentChild(ScrollDragDirective)
  scrollDragDirective?: ScrollDragDirective

  shadow: ShadowDir | undefined

  constructor() {
  }

  ngAfterContentInit(): void {
    this.shadow = this.scrollDragDirective?.shadow
  }

}
