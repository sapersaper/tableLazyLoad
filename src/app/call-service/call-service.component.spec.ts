import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallServiceComponent } from './call-service.component';

describe('CallServiceComponent', () => {
  let component: CallServiceComponent;
  let fixture: ComponentFixture<CallServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
