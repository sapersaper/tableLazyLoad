import { TestBed, inject } from '@angular/core/testing';

import { GetSearchService } from './get-search.service';

describe('GetSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetSearchService]
    });
  });

  it('should be created', inject([GetSearchService], (service: GetSearchService) => {
    expect(service).toBeTruthy();
  }));
});
