import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ExploreService {
  private baseUrl = environment.api;

  constructor(private http : HttpClient) {
  }

  getStatus(): Observable<any> {
    return this.http.get(`${this.baseUrl}/explore/statuses`,{});
  }

  getTags(): Observable<any> {
    return this.http.get(`${this.baseUrl}/explore/tags`,{});
  }

  getAccounts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/explore/accounts`,{});
  }

}
