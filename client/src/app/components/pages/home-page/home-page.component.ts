import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPageComponent} from "../login-page/login-page.component";
import {AuthenticationService} from "../../../services/authentication.service";
import {StatusListComponent} from "../../status/status-list/status-list.component";

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, LoginPageComponent, StatusListComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  isAuthenticated: any;
  type: any = "timeline";
  isLoading: boolean = true;

  constructor(private authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.authenticationService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

}
