import {Component} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';

/**
 * @title Basic chips
 */
@Component({
  selector: 'intro',
  templateUrl: 'intro.component.html',
  standalone: true,
  imports: [MatChipsModule],
})
export class IntroComponent {}


/**  Copyright 2023 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */