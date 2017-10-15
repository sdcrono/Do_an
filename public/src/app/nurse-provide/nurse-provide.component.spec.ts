import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseProvideComponent } from './nurse-provide.component';

describe('NurseProvideComponent', () => {
  let component: NurseProvideComponent;
  let fixture: ComponentFixture<NurseProvideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseProvideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseProvideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
