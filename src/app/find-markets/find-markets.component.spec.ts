import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindMarketsComponent } from './find-markets.component';

describe('FindMarketsComponent', () => {
  let component: FindMarketsComponent;
  let fixture: ComponentFixture<FindMarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindMarketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
