import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable, of, switchMap} from "rxjs";
import {AccountService} from "../../../services/account.service";
import {CommonModule} from "@angular/common";
import {StatusEntryComponent} from "../status-entry/status-entry.component";
import {MatIconModule} from "@angular/material/icon";
import {StatusService} from "../../../services/status.service";
import {ExploreService} from "../../../services/explore.service";

@Component({
  selector: 'status-list',
  standalone: true,
  imports: [CommonModule, StatusEntryComponent, MatIconModule],
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.css'
})
export class StatusListComponent implements OnInit, OnChanges {

  @Input() type: any;
  @Input() profile: any;
  @Input() tag: any;
  isLoading: boolean = true;

  statuses: any[] = [];
  constructor(private accountService: AccountService, private exploreService: ExploreService) {
  }

  ngOnInit(): void {
    this.isLoading = true;

    let defaultAvatars : string[] = [
      "assets/avatar/default1.png",
      "assets/avatar/default2.png",
      "assets/avatar/default3.png",
      "assets/avatar/default4.png",
      "assets/avatar/default5.png"
    ];

    let randomStatus : string [] = [
      "Data loading in progress... Expecting insights to unfold, one byte at a time. Exciting!",
      "Ever noticed? The anticipation while data loads is often as thrilling as the results.",
      "Data's journey from cloud to screen is like magic unfolding. Loading... please wait. #DataMagic",
      "In a world of instant, sometimes loading data teaches us the virtue of patience. #LoadingThoughts",
      "Loading data: where every second brings us closer to knowledge and insight. #DataJourneyneys",
      "That moment of suspense as data loads, promising new discoveries and endless possibilities! #DataAdventure",
      "Loading screen is a brief pause in our fast-paced data-driven world. Reflect, then act.",
      "Watching data load is like brewing coffee, good things come to those who wait. #DataPatience",
      "As bytes assemble, our understanding deepens. The art of data loading is patience's playground.",
      "Data loading, like a good book's opening chapter, sets the stage for stories hidden within."
    ];


    for (let i: number = 0; i < 10; i++) {
      this.statuses.push({
        account: {
          id: 1,
          avatarFilename: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
          domain: "example.com",
          username: "loading",
          displayName: "Loading"
        },
        id: 1,
        isBookarked: false,
        isFavorite: false,
        published: new Date().toISOString(),
        text: randomStatus[Math.floor(Math.random() * randomStatus.length)],
        totalLike: 10,
        uri: "https://www.example.com"
      });
    }

    this.loadData(this.type);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  loadData(type: string) : void {
    let statusObservable$: Observable<any>;

    switch (type) {
      case "timeline":
        this.exploreService.getStatus()?.subscribe(response => {

          //@ts-ignore
          this.statuses = response.statuses;
          this.isLoading = false;
        });
        break;

      case "profile":

        statusObservable$ = this.accountService.profileResults$.pipe(
          switchMap((results) => {
            this.profile = results;
            return this.profile && this.profile.accountId ? this.accountService.getStatuses(this.profile.accountId) : of(null);
          }));

        this.subscribeStatuses(statusObservable$);
        break;
      case "favorites":
        this.accountService.favorites()?.subscribe(response => {

          //@ts-ignore
          this.statuses = response.statuses;
          this.isLoading = false;
        });
        break;
      case "bookmarks":
        this.accountService.bookmarks()?.subscribe(response => {

          //@ts-ignore
          this.statuses = response.statuses;
          this.isLoading = false;
        });
        break;

    }

  }


  private subscribeStatuses(observable: Observable<any>) {
    observable.subscribe(statuses => {
      this.statuses = statuses;
      console.log("I've got your statuses");
    });
  }
}
