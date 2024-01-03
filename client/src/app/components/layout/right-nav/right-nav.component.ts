import {Component} from '@angular/core';
import {PostWidgetComponent} from "./post-widget/post-widget.component";
import {SearchWidgetComponent} from "./search-widget/search-widget.component";

@Component({
  selector: 'right-nav',
  standalone: true,
  imports: [
    PostWidgetComponent,
    SearchWidgetComponent
  ],
  templateUrl: './right-nav.component.html',
  styleUrl: './right-nav.component.css'
})
export class RightNavComponent {

}
