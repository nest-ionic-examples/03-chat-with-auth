import { TestBed, async, inject } from '@angular/core/testing';

import { IsNotLoggedInGuard } from './is-not-logged-in.guard';

describe('IsNotLoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsNotLoggedInGuard]
    });
  });

  it('should ...', inject([IsNotLoggedInGuard], (guard: IsNotLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
