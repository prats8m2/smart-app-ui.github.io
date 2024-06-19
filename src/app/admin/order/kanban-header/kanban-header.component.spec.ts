import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanHeaderComponent } from './kanban-header.component';

describe('KanbanHeaderComponent', () => {
  let component: KanbanHeaderComponent;
  let fixture: ComponentFixture<KanbanHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanHeaderComponent]
    });
    fixture = TestBed.createComponent(KanbanHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
