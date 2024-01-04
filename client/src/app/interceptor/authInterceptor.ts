import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {AuthenticationService} from "../services/authentication.service";
import {jwtDecode, JwtPayload} from "jwt-decode";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {

    let idToken = localStorage.getItem("idToken");

    if (idToken) {
      let jwtDecoded: JwtPayload = jwtDecode(JSON.stringify(idToken));
      let nowInSeconds: number = Math.floor(Date.now() / 1000);

      if (jwtDecoded.exp && jwtDecoded.exp < nowInSeconds) {
        // Token is expired, try to refresh it
        let refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          // Call the method in your service to refresh the token
          return this.authenticationService.refreshToken(refreshToken).pipe(
            switchMap((newTokens: any) => {
              // Assuming newTokens contains your new idToken, set it in the Authorization header
              const authReq = req.clone({
                headers: req.headers.set("Authorization", newTokens.idToken)
              });

              console.log("Refreshing token");
              return handler.handle(authReq);
            }),
            catchError((error) => {
              if (error.status == 401) {
                this.authenticationService.logout();
              }
              return throwError(() => error);
            })
          );
        } else {
          this.authenticationService.logout();
          return throwError(() => new Error('Refresh token not available'));
        }
      } else {
        // Token is still valid
        const authReq = req.clone({
          headers: req.headers.set("Authorization", idToken)
        });

        return handler.handle(authReq).pipe(
          catchError((error) => {
            if (error.status == 401) {
              this.authenticationService.logout();
            }
            return throwError(() => error);
          }));
      }
    } else {
      return handler.handle(req).pipe(
        catchError((error) => {
          if (error.status == 401) {
            this.authenticationService.logout();
          }
          return throwError(() => error);
        }));
    }


  }
}
