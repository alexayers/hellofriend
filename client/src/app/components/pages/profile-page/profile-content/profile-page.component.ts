import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {AccountService} from "../../../../services/account.service";
import {StatusListComponent} from "../../../status/status-list/status-list.component";
import {ProfileTopNavComponent} from "../profile-header/profile-header.component";

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [CommonModule, StatusListComponent, ProfileTopNavComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  profile: any;
  type: any = "loading-profile";
  username: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.username = this.activatedRoute.snapshot.paramMap.get('username');

    this.accountService.profileResults$.subscribe(
      (results) => {
        this.profile = results;
        this.type = "profile";

      }
    );

    this.activatedRoute.params.subscribe(params => {
      this.username = params["username"];
      this.accountService.getUser(this.username);
    });

  }

}
