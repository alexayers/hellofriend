import {Component, Input} from '@angular/core';
import {CommonModule, formatDate} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'found-tags',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './found-tags.component.html',
  styleUrl: './found-tags.component.css'
})
export class FoundTagsComponent {

  @Input() tag: any;

  toggleFollow() {

  }

  protected readonly formatDate = formatDate;
}
