import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSidebarComponent } from './order-sidebar.component';

describe('OrderSidebarComponent', () => {
  let component: OrderSidebarComponent;
  let fixture: ComponentFixture<OrderSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSidebarComponent]
    });
    fixture = TestBed.createComponent(OrderSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
