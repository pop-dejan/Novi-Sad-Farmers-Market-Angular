import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPurchaseComponent } from './final-purchase.component';

describe('FinalPurchaseComponent', () => {
  let component: FinalPurchaseComponent;
  let fixture: ComponentFixture<FinalPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalPurchaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
