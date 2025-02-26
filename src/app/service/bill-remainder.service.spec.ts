import { TestBed } from '@angular/core/testing';

import { BillRemainderService } from './bill-remainder.service';

describe('BillRemainderService', () => {
  let service: BillRemainderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillRemainderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
