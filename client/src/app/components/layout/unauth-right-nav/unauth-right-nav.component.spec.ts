import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UnauthRightNavComponent} from './unauth-right-nav.component';

describe('UnauthRightNavComponent', () => {
  let component: UnauthRightNavComponent;
  let fixture: ComponentFixture<UnauthRightNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthRightNavComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UnauthRightNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
