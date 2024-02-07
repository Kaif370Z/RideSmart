import { TestBed } from '@angular/core/testing';

import { MapsService } from './maps.service';

<<<<<<< HEAD


=======
>>>>>>> e6eaaacf0c33e70e90187ec9974b8d57fbacfae9
describe('MapsService', () => {
  let service: MapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
