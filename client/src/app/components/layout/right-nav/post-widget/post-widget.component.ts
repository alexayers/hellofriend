import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'post-widget',
  standalone: true,
  imports: [
    FormsModule,ReactiveFormsModule
  ],
  templateUrl: './post-widget.component.html',
  styleUrl: './post-widget.component.css'
})
export class PostWidgetComponent {
  characterCount: number = 500;
  statusText: any = "";

  updateCharacterCount() {
    this.characterCount = 500 - this.statusText.length;
  }

  postStatus() {
    console.log(`Posting ${this.statusText}`);
  }

}
