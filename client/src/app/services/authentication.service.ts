import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, catchError, Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {jwtDecode, JwtPayload} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isAuthenticated : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private baseUrl : string = environment.api;
  constructor(private http: HttpClient, private router: Router) {
    let idToken = localStorage.getItem("idToken");

    if (idToken) {
      this.isAuthenticated.next(true);
    } else {
      this.logout();
    }
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }

  login(username: string, password: string): void {

    this.http.post(`${this.baseUrl}/auth/login`, {
      "email": username,
      "password": password
    }).subscribe(
      response => {

        console.log(response);
        // @ts-ignore
        let idToken = response.idToken;
        // @ts-ignore
        let refreshToken = response.refreshToken;
        let decodedToken: JwtPayload  =jwtDecode(idToken);

        localStorage.setItem('user', JSON.stringify(decodedToken));
        localStorage.setItem('idToken', idToken);
        localStorage.setItem('refreshToken', refreshToken);
        this.isAuthenticated.next(true);
      },
      error => {
        localStorage.removeItem("idToken");
      }

    );

  }

  logout(): void {
    localStorage.removeItem("idToken");
    this.isAuthenticated.next(false);
    this.router.navigate(["/home"]).then(()=> {
      console.log("Sending you to login");
    });
    console.log("you are logged out");
  }

  refreshToken(refreshToken: string): Observable<any> {

    return this.http.post(`${this.baseUrl}/auth/refresh`, JSON.stringify({
      refreshToken: refreshToken
    }))
      .pipe(
        catchError(error => {

          console.error('Error occurred while refreshing token', error);
          return throwError(() => error);
        })
      );
  }
}
