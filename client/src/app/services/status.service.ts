import {Injectable} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import {environment} from "../../environments/environment"
import {Status} from "../models/status.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {
  }



  bookmark(statusId: number) {

    this.http.post(`${this.baseUrl}/statuses/${statusId}/bookmark`, {}, {}).subscribe(response => {
      console.log(response)
    });
  }

  unbookmark(statusId: number) {

    this.http.delete(`${this.baseUrl}/statuses/${statusId}/bookmark`, {}).subscribe(response => {
      console.log(response)
    });
  }

  favorite(statusId: number) {

    this.http.post(`${this.baseUrl}/statuses/${statusId}/favorite`, {}, {}).subscribe(response => {
      console.log(response)
    });

  }

  unfavorite(statusId: number) {

    this.http.delete(`${this.baseUrl}/statuses/${statusId}/favorite`, {}).subscribe(response => {
      console.log(response)
    });

  }



  getStatus(statusId: string | null): Observable<any> {
    return this.http.get(`${this.baseUrl}/statuses/${statusId}`,{});
  }

  pin(statusId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/statuses/${statusId}/pin`,{});
  }

  unpin(statusId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/statuses/${statusId}/pin`,{});
  }
}
