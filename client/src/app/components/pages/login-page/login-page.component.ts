import {Component} from '@angular/core';
import {AuthenticationService} from "../../../services/authentication.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'login-page',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  username: any;
  password: any;

  constructor(private authenticationService: AuthenticationService) {
  }

  onLogin() {
    this.authenticationService.login(this.username, this.password);
  }
}
