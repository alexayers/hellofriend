import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {AccountService} from "../../../../services/account.service";
import {AuthenticationService} from "../../../../services/authentication.service";

@Component({
  selector: 'profile-header',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileTopNavComponent implements OnInit {
  @Input() profile: any;
  yourProfile: boolean = false;
  isAuthenticated: boolean = false;
  profileSummary: any;
  isShowingProfilePicture: boolean = false;


  constructor(private sanitizer: DomSanitizer,
              private accountService: AccountService,
              private authenticationService: AuthenticationService) {
  }


  ngOnInit(): void {

    let user = localStorage.getItem("user");

    if (user) {

      let userJson = JSON.parse(user);

      if (userJson && userJson.accountId == this.profile.accountId) {
        this.yourProfile = true;
      } else {
        this.yourProfile = false;
      }

    }

    this.authenticationService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

  }

  get sanitizedHtml(): SafeHtml {

    if (this.profile) {
      return this.sanitizer.bypassSecurityTrustHtml(this.profile.summary);
    } else {
      return "";
    }
  }

  follow() {
    if (!this.profile.isFollowing) {
      this.accountService.followAccount(this.profile.accountId);
      this.profile.isFollowing = true;
    } else {
      this.accountService.unfollowAccount(this.profile.accountId);
      this.profile.isFollowing = false;
    }

  }

  back() {

  }


  showProfilePicture() {
    this.isShowingProfilePicture = !this.isShowingProfilePicture;
  }
}
