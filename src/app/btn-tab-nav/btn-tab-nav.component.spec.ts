import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnTabNavComponent } from './btn-tab-nav.component';

describe('BtnTabNavComponent', () => {
  let component: BtnTabNavComponent;
  let fixture: ComponentFixture<BtnTabNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnTabNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnTabNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
