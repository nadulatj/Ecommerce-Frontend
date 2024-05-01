import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerOverlayWrapperComponent } from './spinner-overlay-wrapper.component';

describe('SpinnerOverlayWrapperComponent', () => {
  let component: SpinnerOverlayWrapperComponent;
  let fixture: ComponentFixture<SpinnerOverlayWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinnerOverlayWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerOverlayWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
