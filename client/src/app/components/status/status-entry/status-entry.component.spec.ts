import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StatusEntryComponent} from './status-entry.component';

describe('StatusEntryComponent', () => {
  let component: StatusEntryComponent;
  let fixture: ComponentFixture<StatusEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusEntryComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatusEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
