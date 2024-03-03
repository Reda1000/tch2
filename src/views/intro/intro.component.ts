import {Component, Inject} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Event, News, NewsService } from 'src/services/news.service';
import { RostersService } from 'src/services/roster.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { map } from 'rxjs';

/**
 * @title Basic chips
 */
@Component({
  selector: 'intro',
  templateUrl: 'intro.component.html',
  styleUrls: ['./intro.component.css'],
  standalone: true,
  imports: [MatChipsModule, MatCardModule, MatDividerModule, MatButtonModule, MatProgressBarModule, MarkdownModule, CommonModule, MatIconModule, RouterModule],
  providers: [NewsService]
})
export class IntroComponent {
  items$=this.news.getLatest().pipe(map(_ => _.filter(_ => _.state==='Active')));
  teams$=this.roster.getTeams();
  filters: {[key: string]: boolean}={ 'news': true, 'events': true };

  constructor(private route: ActivatedRoute, private router: Router, @Inject(NewsService) private news: NewsService, @Inject(RostersService) private roster: RostersService) {}

  setFilter(filter: string) {
    this.filters[filter]=!this.filters[filter];
  }

  isNews(data: any) { return this.news.isNews(data) ? data : undefined; }
  isEvent(data: any) { return this.news.isEvent(data) ? data : undefined; }

  showMore(title: string) {
    this.router.navigate([], { relativeTo: this.route, queryParams: {popup: 'news', news: title}, queryParamsHandling: 'merge' });
  }
}


/**  Copyright 2023 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */