import { TestBed } from '@angular/core/testing';

import { HEREService } from './here.service';

describe('HEREService', () => {
  let service: HEREService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HEREService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
