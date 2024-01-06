import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Status} from "../models/status.model";
import {Profile} from "../models/profile.model";


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl : string = environment.api;
  private activityPubApi : string = environment.activityPubApi;
  private profileResultsSource = new BehaviorSubject<Profile>(<Profile>{});
  profileResults$ = this.profileResultsSource.asObservable();

  constructor(private http: HttpClient) {
  }


  getAccount(accountId: string) {

    this.http.get<Profile>(`${this.baseUrl}/accounts/${accountId}`).subscribe(profile =>{
      this.profileResultsSource.next(profile);
    })
  }

  getUser(username: string) {

    this.http.get<Profile>(`${this.activityPubApi}/users/${username.substring(1,username.length)}`).subscribe(profile =>{
      this.profileResultsSource.next(profile);
    })
  }

  getStatuses(accountId: number): Observable<Array<Status>> {

    return this.http.get<Array<Status>>(`${this.baseUrl}/accounts/${accountId}/statuses`);
  }

  followAccount(accountId: number) {
    return this.http.post<void>(`${this.baseUrl}/accounts/${accountId}/follow`, {},
      {}).subscribe(results => {
      console.log("following");
    });
  }


  unfollowAccount(accountId: number) {
    return this.http.delete<void>(`${this.baseUrl}/accounts/${accountId}/follow`,
      {}).subscribe(results => {
      console.log("unfollowing");
    });
  }

  bookmarks(): Observable<Array<Status>> | undefined {

    return this.http.get<Array<Status>>(`${this.baseUrl}/account/bookmarks`, {});
  }

  favorites(): Observable<Array<Status>> | undefined {

    return this.http.get<Array<Status>>(`${this.baseUrl}/account/favorites`, {});

  }
}
