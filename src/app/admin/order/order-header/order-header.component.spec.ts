import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHeaderComponent } from './order-header.component';

describe('OrderHeaderComponent', () => {
  let component: OrderHeaderComponent;
  let fixture: ComponentFixture<OrderHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderHeaderComponent]
    });
    fixture = TestBed.createComponent(OrderHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
