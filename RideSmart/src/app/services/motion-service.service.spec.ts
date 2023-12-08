import { TestBed } from '@angular/core/testing';

import { MotionServiceService } from './motion-service.service';

describe('MotionServiceService', () => {
  let service: MotionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
