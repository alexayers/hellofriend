import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostWidgetComponent} from './post-widget.component';

describe('PostWidgetComponent', () => {
  let component: PostWidgetComponent;
  let fixture: ComponentFixture<PostWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostWidgetComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
