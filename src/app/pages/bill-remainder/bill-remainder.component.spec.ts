import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillRemainderComponent } from './bill-remainder.component';

describe('BillRemainderComponent', () => {
  let component: BillRemainderComponent;
  let fixture: ComponentFixture<BillRemainderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillRemainderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillRemainderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
