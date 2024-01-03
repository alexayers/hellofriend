import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'search-widget',
  standalone: true,
  imports: [
    FormsModule,ReactiveFormsModule,MatIconModule
  ],
  templateUrl: './search-widget.component.html',
  styleUrl: './search-widget.component.css'
})
export class SearchWidgetComponent {

  query: any;

  search() {
    console.log(`searching for ${this.query}`);
  }
}
