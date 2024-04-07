import { TestBed } from '@angular/core/testing';

import { CrashDetectionService } from './crash-detection.service';

describe('CrashDetectionService', () => {
  let service: CrashDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrashDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
