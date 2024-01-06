import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DateFormatters} from "../../../../utils/dateFormatters";


@Component({
  selector: 'found-profiles',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './found-profiles.component.html',
  styleUrl: './found-profiles.component.css'
})
export class FoundProfilesComponent implements OnInit {
  @Input() profile: any;

  constructor(private sanitizer: DomSanitizer) {


  }

  ngOnInit(): void {
    this.profile.created = DateFormatters.timeAgo(this.profile?.created);
  }

  get sanitizedHtml(): SafeHtml {

    if (this.profile.summary) {
      return this.sanitizer.bypassSecurityTrustHtml(this.profile.summary ? this.profile.summary : "<p>This user hasn't filled in a profile yet.</p>");
    } else {
      return "";
    }
  }

  toggleFollow(profile: any) {

  }


}
