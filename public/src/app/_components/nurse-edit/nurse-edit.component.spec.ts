import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseEditComponent } from './nurse-edit.component';

describe('NurseEditComponent', () => {
  let component: NurseEditComponent;
  let fixture: ComponentFixture<NurseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
