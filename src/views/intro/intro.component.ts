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
import { RouterModule } from '@angular/router';

/**
 * @title Basic chips
 */
@Component({
  selector: 'intro',
  templateUrl: 'intro.component.html',
  styleUrls: ['./intro.component.css'],
  standalone: true,
  imports: [MatChipsModule, MatCardModule, MatDividerModule, MatButtonModule, MatProgressBarModule, CommonModule, MatIconModule, RouterModule],
  providers: [NewsService]
})
export class IntroComponent {
  items$=this.news.getLatest();
  teams$=this.roster.getTeams();
  filters: {[key: string]: boolean}={ 'news': true, 'events': true };

  constructor(@Inject(NewsService) private news: NewsService, @Inject(RostersService) private roster: RostersService) {}

  setFilter(filter: string) {
    this.filters[filter]=!this.filters[filter];
  }

  isNews(data: any) {
    return this.news.isNews(data) ? data : undefined;
  }
  isEvent(data: any) {
    return this.news.isEvent(data) ? data : undefined;
  }
}


/**  Copyright 2023 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */