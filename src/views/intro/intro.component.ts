import {Component, Inject} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NewsService } from 'src/services/news.service';

/**
 * @title Basic chips
 */
@Component({
  selector: 'intro',
  templateUrl: 'intro.component.html',
  styleUrls: ['./intro.component.css'],
  standalone: true,
  imports: [MatChipsModule, MatCardModule, MatDividerModule, MatButtonModule, MatProgressBarModule, CommonModule, MatIconModule],
  providers: [NewsService]
})
export class IntroComponent {
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;
  items$=this.news.getLatest();
  filters: {[key: string]: boolean}={ 'news': true, 'events': true };

  constructor(@Inject(NewsService) private news: NewsService) {}

  setFilter(filter: string) {
    this.filters[filter]=!this.filters[filter];
  }

  isNews(data: any) {
    return this.news.isNews(data);
  }
  isEvent(data: any) {
    return this.news.isEvent(data);
  }
}


/**  Copyright 2023 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */