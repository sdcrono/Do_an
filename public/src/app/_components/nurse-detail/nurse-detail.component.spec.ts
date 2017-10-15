import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NurseDetailComponent } from './nurse-detail.component';

describe('NurseDetailComponent', () => {
  let component: NurseDetailComponent;
  let fixture: ComponentFixture<NurseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NurseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NurseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
