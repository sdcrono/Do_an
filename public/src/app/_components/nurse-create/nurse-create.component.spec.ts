import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseCreateComponent } from './nurse-create.component';

describe('NurseCreateComponent', () => {
  let component: NurseCreateComponent;
  let fixture: ComponentFixture<NurseCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
