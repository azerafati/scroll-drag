import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollShadowComponent } from './scroll-shadow.component';

describe('ScrollShadowComponent', () => {
  let component: ScrollShadowComponent;
  let fixture: ComponentFixture<ScrollShadowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrollShadowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollShadowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
