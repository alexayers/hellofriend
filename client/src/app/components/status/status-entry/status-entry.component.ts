import {Component, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import { environment } from '../../../../environments/environment';
import {AuthenticationService} from "../../../services/authentication.service";
import {StatusService} from "../../../services/status.service";
import {DateFormatters} from "../../../utils/dateFormatters";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'status-entry',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './status-entry.component.html',
  styleUrl: './status-entry.component.css'
})
export class StatusEntryComponent {

  @Input() status: any;
  isAuthenticated: boolean = false;
  protected readonly environment = environment;
  hasAttachments: boolean = false;
  showVideoPlayer: boolean = false;
  showExpandedImages: boolean = false;
  showStatusOptions: boolean = false;


  constructor(private sanitizer: DomSanitizer,
              private authenticationService: AuthenticationService,
              private statusService: StatusService) {
  }

  ngOnInit(): void {
    this.authenticationService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    this.status.published = DateFormatters.timeAgo(this.status.published);

  }

  get avatar(): string {
    if (!this.status?.account.avatarImage) {
      this.status.account.avatarImage = "assets/avatar.png";
    }

    return this.status?.account.avatarImage;
  }

  get sanitizedHtml(): SafeHtml {

    if (this.status) {
      return this.sanitizer.bypassSecurityTrustHtml(this.status.text);
    } else {
      return "";
    }
  }


  boost() {

  }

  pin() : void {
    if (this.status.pinned) {
      this.statusService.unpin(this.status.id).subscribe();
      this.status.pinned = false;
    } else {
      this.statusService.pin(this.status.id).subscribe();
      this.status.pinned = true;
    }
  }

  bookmark() {

    if (this.status.isBookmarked) {
      this.statusService.unbookmark(this.status.id);
      this.status.isBookmarked = false;
    } else {
      this.statusService.bookmark(this.status.id);
      this.status.isBookmarked = true;
    }


  }

  favorite() {
    if (this.status.isFavored) {
      this.statusService.unfavorite(this.status.id);
      this.status.isFavored = false;
    } else {
      this.statusService.favorite(this.status.id);
      this.status.isFavored = true;
    }

  }

  statusOptions() {
    this.showStatusOptions = !this.showStatusOptions;
  }

  expandImage() : void {

    this.showExpandedImages = !this.showExpandedImages;
  }

}
