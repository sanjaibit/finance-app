import { TestBed } from '@angular/core/testing';

import { ExpenseLimitService } from './expense-limit.service';

describe('ExpenseLimitService', () => {
  let service: ExpenseLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseLimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
