import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonalProductsComponent } from './seasonal-products.component';

describe('SeasonalProductsComponent', () => {
  let component: SeasonalProductsComponent;
  let fixture: ComponentFixture<SeasonalProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonalProductsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonalProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
