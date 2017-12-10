import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseSalaryComponent } from './nurse-salary.component';

describe('NurseSalaryComponent', () => {
  let component: NurseSalaryComponent;
  let fixture: ComponentFixture<NurseSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
