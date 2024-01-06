import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UnauthLeftNavComponent} from './unauth-left-nav.component';

describe('UnauthLeftNavComponent', () => {
  let component: UnauthLeftNavComponent;
  let fixture: ComponentFixture<UnauthLeftNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthLeftNavComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UnauthLeftNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
