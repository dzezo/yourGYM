/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PricelistService } from './pricelist.service';

describe('PricelistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PricelistService]
    });
  });

  it('should ...', inject([PricelistService], (service: PricelistService) => {
    expect(service).toBeTruthy();
  }));
});
