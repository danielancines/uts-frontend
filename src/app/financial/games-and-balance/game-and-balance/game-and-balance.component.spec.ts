import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAndBalanceComponent } from './game-and-balance.component';

describe('GameAndBalanceComponent', () => {
  let component: GameAndBalanceComponent;
  let fixture: ComponentFixture<GameAndBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameAndBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAndBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
