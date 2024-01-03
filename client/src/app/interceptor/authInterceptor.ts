import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
import {jwtDecode, JwtPayload} from "jwt-decode";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {

    let idToken = localStorage.getItem("idToken");

    if (idToken) {

      let jwtDecoded : JwtPayload = jwtDecode(JSON.stringify(idToken));
      let nowInSeconds : number = Math.floor(Date.now() / 1000);

      if (jwtDecoded.exp && jwtDecoded.exp < nowInSeconds) {
        this.authenticationService.logout();
      }

      const authReq = req.clone({
        headers: req.headers.set("Authorization", idToken)
      });

      return handler.handle(authReq).pipe(
        catchError((error) => {

          if (error.status == 401) {
            this.authenticationService.logout();
          }

          return throwError(() => error)
        }));
    } else {
      return handler.handle(req).pipe(
        catchError((error) => {
          if (error.status == 401) {
            this.authenticationService.logout();
          }

          return throwError(() => error)
        }));
    }


  }
}
