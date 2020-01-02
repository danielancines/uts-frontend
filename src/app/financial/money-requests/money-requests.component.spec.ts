import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyRequestsComponent } from './money-requests.component';

describe('MoneyRequestsComponent', () => {
  let component: MoneyRequestsComponent;
  let fixture: ComponentFixture<MoneyRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
