import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {AuthenticationService} from "./services/authentication.service";
import {environment} from "../environments/environment";
import {LeftNavComponent} from "./components/layout/left-nav/left-nav.component";
import {UnauthLeftNavComponent} from "./components/layout/unauth-left-nav/unauth-left-nav.component";
import {RightNavComponent} from "./components/layout/right-nav/right-nav.component";
import {UnauthRightNavComponent} from "./components/layout/unauth-right-nav/unauth-right-nav.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    LeftNavComponent,
    UnauthLeftNavComponent,
    RightNavComponent,
    UnauthRightNavComponent

  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'hellofriend';
  isAuthenticated: boolean = false;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {

    console.log(`Running as ${environment.name}`)

    this.authenticationService.isAuthenticated$.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  protected readonly environment = environment;
}
