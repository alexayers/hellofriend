import {Routes, UrlSegment} from '@angular/router';
import {HomePageComponent} from "./components/pages/home-page/home-page.component";
import {ExplorePageComponent} from "./components/pages/explore-page/explore-page.component";
import {BookmarksPageComponent} from "./components/pages/bookmarks-page/bookmarks-page.component";
import {FavoritesPageComponent} from "./components/pages/favorites-page/favorites-page.component";
import {SearchPageComponent} from "./components/pages/search-page/search-page.component";
import {LoginPageComponent} from "./components/pages/login-page/login-page.component";
import {TagPageComponent} from "./components/pages/tag-page/tag-page.component";
import {ViewStatusPageComponent} from "./components/pages/view-status-page/view-status-page.component";
import {ProfilePageComponent} from "./components/pages/profile-page/profile-content/profile-page.component";

export const routes: Routes = [
  {path: 'home', component: HomePageComponent},
  {path: 'explore', component: ExplorePageComponent},
  {path: 'bookmarks', component: BookmarksPageComponent},
  {path: 'favorites', component: FavoritesPageComponent},
  {path: 'search', component: SearchPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'tags/:tag', component: TagPageComponent},
  {path: 'statuses/:statusId', component: ViewStatusPageComponent},
  { matcher: profilePathMatcher, component: ProfilePageComponent },
  {path: "**", component: HomePageComponent}
];

export function profilePathMatcher(url: UrlSegment[]) {

  if (url.length === 1 && url[0].toString().startsWith('@')) {
    return {
      consumed: url,
      posParams: {
        username: new UrlSegment(decodeURIComponent(url[0].toString()), {})
      }
    };
  }
  return null;
}
