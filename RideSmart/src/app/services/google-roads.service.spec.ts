import { TestBed } from '@angular/core/testing';

import { GoogleRoadsService } from './google-roads.service';

describe('GoogleRoadsService', () => {
  let service: GoogleRoadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleRoadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
