import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketBarometerComponent } from './market-barometer.component';

describe('MarketBarometerComponent', () => {
  let component: MarketBarometerComponent;
  let fixture: ComponentFixture<MarketBarometerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketBarometerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketBarometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
