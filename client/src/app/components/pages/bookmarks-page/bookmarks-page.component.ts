import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusListComponent} from "../../status/status-list/status-list.component";

@Component({
  selector: 'bookmarks-page',
  standalone: true,
  imports: [CommonModule, StatusListComponent],
  templateUrl: './bookmarks-page.component.html',
  styleUrl: './bookmarks-page.component.css'
})
export class BookmarksPageComponent {
  type: any = "bookmarks";
  isLoading: boolean = true;
}
