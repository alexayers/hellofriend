import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusListComponent} from "../../status/status-list/status-list.component";

@Component({
  selector: 'favorites-page',
  standalone: true,
  imports: [CommonModule, StatusListComponent],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css'
})
export class FavoritesPageComponent {
  type: any = "favorites";
  isLoading: boolean = true;
}
