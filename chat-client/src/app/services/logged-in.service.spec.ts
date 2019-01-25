import { TestBed } from '@angular/core/testing';

import { LoggedInService } from './logged-in.service';

describe('LoggedInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service).toBeTruthy();
  });
});
