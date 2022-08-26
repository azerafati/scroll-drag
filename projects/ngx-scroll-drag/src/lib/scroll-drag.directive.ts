import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subject, Subscription, throttleTime } from "rxjs";
import { Inertia } from "./inertia.class";

@Directive({
  selector: '[ngxScrollDrag]',
  host: {
    '[style.user-select]': '"none"',
    '[style.transition]': '"box-shadow 125ms ease-in-out"',
  }
})
export class ScrollDragDirective implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  scrollDirection: 'Horizontal' | 'Vertical' = 'Vertical';
  @Input()
  scrollShadow = false;
  private dateScrollChange$ = new Subject<void>();
  private dateScrollChangeSubscription?: Subscription;
  private inertia!: Inertia;
  private scrollDragSnap = 0;
  private startDragY?: number;
  private startDragX?: number;
  private isPressed = false;
  private readonly element: HTMLElement;

  constructor(
    private elemRef: ElementRef,
    private renderer: Renderer2,
  ) {
    this.element = this.elemRef.nativeElement;
  }

  @Input('ngxScrollDrag')
  set ngxScrollDrag(value: number | string | undefined) {
    this.scrollDragSnap = Number(value || 0);
  }

  ngAfterViewInit(): void {
    this.inertia = new Inertia(this);
  }

  @HostListener("mousedown", ["$event"])
  startDrag(ev: MouseEvent): void {
    if (this.scrollDirection === 'Vertical') {
      this.startDragY = ev.clientY + this.element.scrollTop;
    } else {
      this.startDragX = ev.clientX + this.element.scrollLeft;
    }
    this.isPressed = true;
    this.inertia.stopInertion();
  }

  @HostListener("mousemove", ["$event"])
  drag(ev: MouseEvent): void {
    this.isPressed = ev.buttons === 1;
    if (this.isPressed) {
      if (this.scrollDirection === 'Vertical') {
        this.element.scrollTop = (this.startDragY ? this.startDragY - ev.clientY : 0);
      } else {
        this.element.scrollLeft = (this.startDragX ? this.startDragX - ev.clientX : 0);
      }
      this.inertia.addMouseWayPoints(ev.clientX, ev.clientY);
    }
  }

  @HostListener("mouseleave", ["$event"])
  leave(ev: MouseEvent): void {
    if (this.isPressed) {
      this.inertia.startInertialMove(ev.clientX, ev.clientY);
    }
    this.onScroll();
  }

  @HostListener("mouseup", ["$event"])
  stopDrag(ev: MouseEvent): void {
    if (this.isPressed) {
      this.isPressed = false;
      this.inertia.startInertialMove(ev.clientX, ev.clientY);
    }
    this.onScroll();
  }

  @HostListener("wheel", ["$event"])
  @HostListener("scroll", ["$event"])
  onScroll(): void {
    this.dateScrollChange$.next();
  }

  ngOnInit(): void {
    this.dateScrollChangeSubscription = this.dateScrollChange$.pipe(
      throttleTime(100, undefined, {leading: true, trailing: true}
      )).subscribe(() => {
        if (!this.isPressed && this.scrollDragSnap) {
          const scrollTop = Math.round(this.element.scrollTop / this.scrollDragSnap) * this.scrollDragSnap;
          this.element.scrollTo({top: scrollTop, behavior: 'smooth'});
        }
        if (this.scrollShadow) {
          this.setBoxShadow(this.element)
        }
      }
    );
    this.onScroll();
  }

  scroll(scrollOffset: number): void {
    const draggedElm = this.element;
    if (this.scrollDirection === 'Vertical') {
      draggedElm.scrollTop = draggedElm.scrollTop + scrollOffset;
    } else {
      draggedElm.scrollLeft = draggedElm.scrollLeft + scrollOffset;
    }
    this.onScroll();
  }

  ngOnDestroy(): void {
    this.dateScrollChangeSubscription?.unsubscribe();
  }

  private calcShadow(shadow: string): string {
    return shadow
      .replace(/\$size/g, '16px -20px')
      .replace(/\$color/g, 'rgb(0 0 0 / 50%)');
  }

  private setBoxShadow(elm: HTMLElement): void {
    const edgeZoneSize = 5;
    const canScrollTop = elm.scrollTop > edgeZoneSize;
    const canScrollBottom = elm.scrollTop + elm.clientHeight < elm.scrollHeight - edgeZoneSize;
    const canScrollLeft = Math.abs(elm.scrollLeft) > edgeZoneSize;

    // in RTL chrome desktop gets scrollLeft as a negative number unlike chrome mobile
    const canScrollRight = Math.abs(elm.scrollLeft) + elm.clientWidth < Math.abs(elm.scrollWidth - edgeZoneSize);

    let boxShadow = '';

    if (this.scrollDirection === "Vertical") {
      if (canScrollTop && canScrollBottom) {
        boxShadow = 'inset 0 20px $size $color, inset 0 -20px $size $color';
      } else if (canScrollBottom) {
        boxShadow = 'inset 0 20px $size transparent, inset 0 -20px $size $color';
      } else if (canScrollTop) {
        boxShadow = 'inset 0 20px $size $color, inset 0 -20px $size transparent';
      }
    } else {
      if (canScrollLeft && canScrollRight) {
        boxShadow = 'inset -20px 0 $size $color, inset 20px 0 $size $color';
      } else if (canScrollRight) {
        boxShadow = 'inset -20px 0 $size $color, inset 20px 0 $size transparent';
      } else if (canScrollLeft) {
        boxShadow = 'inset -20px 0 $size transparent, inset 20px 0 $size $color';
      }
    }
    this.renderer.setStyle(elm, 'box-shadow', this.calcShadow(boxShadow));
  }

}

