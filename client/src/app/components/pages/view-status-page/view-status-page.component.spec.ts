import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ViewStatusPageComponent} from './view-status-page.component';

describe('ViewStatusPageComponent', () => {
  let component: ViewStatusPageComponent;
  let fixture: ComponentFixture<ViewStatusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStatusPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewStatusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
