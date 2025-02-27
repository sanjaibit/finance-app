import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitSetterComponent } from './limit-setter.component';

describe('LimitSetterComponent', () => {
  let component: LimitSetterComponent;
  let fixture: ComponentFixture<LimitSetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LimitSetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LimitSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
