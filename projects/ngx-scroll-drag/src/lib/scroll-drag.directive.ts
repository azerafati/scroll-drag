import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2
} from '@angular/core'
import { Subject, Subscription, throttleTime } from "rxjs"
import { Inertia } from "./inertia.class"

enum Direction {
  Top = 'top',
  Bottom = 'bottom',
  Right = 'right',
  Left = 'left'
}

export type ShadowDir = { [key in Direction]: boolean }

@Directive({
  selector: '[ngxScrollDrag]',
  host: {
    '[style.user-select]': '"none"',
    '[style.overflow-scrolling]': '"touch"',
  }
})
export class ScrollDragDirective implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  scrollDirection: 'Horizontal' | 'Vertical' = 'Vertical'

  @Input()
  scrollShadow = false

  @Output()
  shadowChange = new EventEmitter<{ direction: Direction, isShown: boolean }>()

  @Input()
  backgroundColor = 'white'

  shadow: ShadowDir = {
    [Direction.Top]: false,
    [Direction.Bottom]: false,
    [Direction.Right]: false,
    [Direction.Left]: false,
  }

  private dateScrollChange$ = new Subject<void>()
  private dateScrollChangeSubscription?: Subscription
  private inertia!: Inertia
  private scrollDragSnap = 0
  private startDragY?: number
  private startDragX?: number
  private isPressed = false
  private readonly element: HTMLElement

  constructor(
    private elemRef: ElementRef,
    private renderer: Renderer2,
  ) {
    this.element = this.elemRef.nativeElement
  }

  @Input('ngxScrollDrag')
  set ngxScrollDrag(value: number | string | undefined) {
    this.scrollDragSnap = Number(value || 0)
  }

  ngAfterViewInit(): void {
    this.inertia = new Inertia(this)
  }

  @HostListener("mousedown", ["$event"])
  startDrag(ev: MouseEvent): void {
    if (this.scrollDirection === 'Vertical') {
      this.startDragY = ev.clientY + this.element.scrollTop
    } else {
      this.startDragX = ev.clientX + this.element.scrollLeft
    }
    this.isPressed = true
    this.inertia.stopInertion()
  }

  @HostListener("mousemove", ["$event"])
  drag(ev: MouseEvent): void {
    this.isPressed = ev.buttons === 1
    if (this.isPressed) {
      if (this.scrollDirection === 'Vertical') {
        this.element.scrollTop = (this.startDragY ? this.startDragY - ev.clientY : 0)
      } else {
        this.element.scrollLeft = (this.startDragX ? this.startDragX - ev.clientX : 0)
      }
      this.inertia.addMouseWayPoints(ev.clientX, ev.clientY)
    }
  }

  @HostListener("mouseleave", ["$event"])
  leave(ev: MouseEvent): void {
    if (this.isPressed) {
      this.inertia.startInertialMove(ev.clientX, ev.clientY)
    }
    this.onScroll()
  }

  @HostListener("mouseup", ["$event"])
  stopDrag(ev: MouseEvent): void {
    if (this.isPressed) {
      this.isPressed = false
      this.inertia.startInertialMove(ev.clientX, ev.clientY)
    }
    this.onScroll()
  }

  @HostListener("wheel", ["$event"])
  @HostListener("scroll", ["$event"])
  onScroll(): void {
    this.dateScrollChange$.next()
  }

  ngOnInit(): void {
    this.dateScrollChangeSubscription = this.dateScrollChange$.pipe(
      throttleTime(100, undefined, {leading: true, trailing: true}
      )).subscribe(() => {
        if (!this.isPressed && this.scrollDragSnap) {
          const scrollTop = Math.round(this.element.scrollTop / this.scrollDragSnap) * this.scrollDragSnap
          this.element.scrollTo({top: scrollTop, behavior: 'smooth'})
        }
        this.setBoxShadowClass()
        if (this.scrollShadow) {
          this.setBackgroundShadow(this.element)
        } else {
          this.renderer.setStyle(this.element, 'background', null)
        }
      }
    )
    this.onScroll()
  }

  scroll(scrollOffset: number): void {
    const draggedElm = this.element
    if (this.scrollDirection === 'Vertical') {
      draggedElm.scrollTop = draggedElm.scrollTop + scrollOffset
    } else {
      draggedElm.scrollLeft = draggedElm.scrollLeft + scrollOffset
    }
    this.onScroll()
  }

  ngOnDestroy(): void {
    this.dateScrollChangeSubscription?.unsubscribe()
  }

  private setBoxShadowClass(): void {
    const edgeZoneSize = 5

    if (this.scrollDirection === "Vertical") {
      this.switchClass(this.element.scrollTop + this.element.clientHeight < this.element.scrollHeight - edgeZoneSize, Direction.Bottom)
      this.switchClass(this.element.scrollTop > edgeZoneSize, Direction.Top)
    } else {
      this.switchClass(Math.abs(this.element.scrollLeft) > edgeZoneSize, Direction.Left)
      // in RTL chrome desktop gets scrollLeft as a negative number unlike chrome mobile
      this.switchClass(Math.abs(this.element.scrollLeft) + this.element.clientWidth < Math.abs(this.element.scrollWidth - edgeZoneSize), Direction.Right)
    }

    this.renderer.addClass(this.element, 'ngx-scroll-drag-shadow')

  }

  private switchClass(condition: boolean, direction: Direction): void {
    const shadowClass = 'ngx-scroll-drag-shadow-' + direction
    this.shadow[direction] = condition
    this.renderer[condition ? 'addClass' : 'removeClass'](this.element, shadowClass)
  }

  private setBackgroundShadow(elm: HTMLElement): void {
    const shadowSize = '0.75em'
    const backgroundColor = this.backgroundColor
    const shadowColor = 'rgba(34,34,34, 0.5)'
    const transparent = 'rgba(255, 255, 255, 0)'
    if (this.scrollDirection === 'Vertical') {
      this.renderer.setStyle(elm, 'background', `
        linear-gradient( ${backgroundColor} 30%, ${transparent} ) center top,
        linear-gradient( ${transparent}, ${backgroundColor} 70% ) center bottom,
        radial-gradient(farthest-side at 50% 0, ${shadowColor}, ${transparent}) center top,
        radial-gradient(farthest-side at 50% 100%, ${shadowColor}, ${transparent}) center bottom
    `)
      this.renderer.setStyle(elm, 'background-size', `100% calc(${shadowSize} * 4), 100% calc(${shadowSize} * 4), 100% ${shadowSize}, 100% ${shadowSize}`)
    } else {
      this.renderer.setStyle(elm, 'background', `
        linear-gradient(to right, ${backgroundColor}, ${backgroundColor}, ${transparent} calc(${shadowSize} * 2)),
        linear-gradient(to left, ${backgroundColor}, ${backgroundColor}, ${transparent} calc(${shadowSize} * 2)),
        radial-gradient(farthest-side at 0 50%, ${shadowColor}, ${transparent}),
        radial-gradient(farthest-side at 100% 50%, ${shadowColor}, ${transparent}) 100%
    `)
      this.renderer.setStyle(elm, 'background-size', `100% 100%, 100% 100%, ${shadowSize} 100%, ${shadowSize} 100%`)
    }

    this.renderer.setStyle(elm, 'background-repeat', 'no-repeat')
    this.renderer.setStyle(elm, 'background-color', this.backgroundColor)
    this.renderer.setStyle(elm, 'background-attachment', 'local, local, scroll, scroll')
  }

}

