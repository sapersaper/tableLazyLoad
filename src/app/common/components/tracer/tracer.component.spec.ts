import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracerComponent } from './tracer.component';

describe('TracerComponent', () => {
  let component: TracerComponent;
  let fixture: ComponentFixture<TracerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
