import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokerRoomsComponent } from './poker-rooms.component';

describe('PokerRoomsComponent', () => {
  let component: PokerRoomsComponent;
  let fixture: ComponentFixture<PokerRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokerRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokerRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
