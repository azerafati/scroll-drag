import { ScrollDragDirective } from './scroll-drag.directive'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Component, DebugElement, ElementRef, Renderer2 } from '@angular/core'
import { By } from '@angular/platform-browser'

export class MockElementRef extends ElementRef {
  constructor() {
    super(null)
  }
}

@Component({
  template: `
    <div ngxScrollDrag></div>`
})
class TestComponent {
}

describe('ScrollDragDirective', () => {
  let directiveDebugElement: DebugElement
  let directive: ScrollDragDirective
  let fixture: ComponentFixture<TestComponent>

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, ScrollDragDirective],
      providers: [
        {provide: ElementRef, useClass: MockElementRef},
        Renderer2,
        ScrollDragDirective,
      ],
    }).createComponent(TestComponent)
    fixture.detectChanges()
    directive = fixture.componentInstance as ScrollDragDirective
    directiveDebugElement = fixture.debugElement.query(By.directive(ScrollDragDirective))
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy()
    expect(directiveDebugElement).toBeTruthy()
  })
});
