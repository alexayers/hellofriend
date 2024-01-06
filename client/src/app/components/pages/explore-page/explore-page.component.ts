import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExploreService} from "../../../services/explore.service";
import {StatusListComponent} from "../../status/status-list/status-list.component";
import {FoundProfilesComponent} from "./found-profiles/found-profiles.component";
import {FoundTagsComponent} from "./found-tags/found-tags.component";
import {StatusEntryComponent} from "../../status/status-entry/status-entry.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'explore-page',
  standalone: true,
  imports: [CommonModule, StatusListComponent, FoundProfilesComponent, FoundTagsComponent, StatusEntryComponent, MatProgressSpinnerModule],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.css'
})
export class ExplorePageComponent implements OnInit {
  currentType: any = "posts";
  type: any = "explore:posts";
  showStatusFeed: boolean = true;
  showPeople: boolean = false;
  showTags: boolean = false;
  accounts: any = [];
  tags: any = []
  statuses: any = [];
  isLoading: boolean = true;


  constructor(private exploreService: ExploreService) {
  }

  ngOnInit(): void {
    this.exploreService.getStatus().subscribe(response => {
      this.statuses = response.statuses;
      this.isLoading = false;
    });
  }

  selectTab(newType: string) {
    this.currentType = newType;
    this.type = `explore:${newType}`;

    switch (newType) {
      case "posts":
        this.showStatusFeed = true;
        this.showPeople = false;
        this.showTags = false;

        this.isLoading = true;
        this.exploreService.getStatus().subscribe(response => {
          this.statuses = response.statuses;
          this.isLoading = false;
        });

        break;
      case "accounts":

        this.isLoading = true;
        this.exploreService.getAccounts().subscribe(response => {
          this.accounts = response.accounts;
          this.isLoading = false;
        });

        this.showStatusFeed = false;
        this.showPeople = true;
        this.showTags = false;
        break;
      case "tags":

        this.isLoading = true;
        this.exploreService.getTags().subscribe(response => {
          this.tags = response.tags;
          this.isLoading = false;
        });

        this.showStatusFeed = false;
        this.showPeople = false;
        this.showTags = true;
        break;
    }
  }
}
