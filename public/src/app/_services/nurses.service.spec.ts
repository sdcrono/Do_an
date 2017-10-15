import { TestBed, inject } from '@angular/core/testing';

import { NursesService } from './nurses.service';

describe('NurseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NursesService]
    });
  });

  it('should be created', inject([NursesService], (service: NursesService) => {
    expect(service).toBeTruthy();
  }));
});
