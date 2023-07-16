import { CommonModule } from '@angular/common';
import {Component, Inject} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { Athlete, Coach, Person, Roster, RostersService } from 'src/services/roster.service';
import { MatListModule } from '@angular/material/list';
import { map, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';

/**
 * @title Basic chips
 */
@Component({
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatBottomSheetModule, MatIconModule],
})
export class CalendarComponent {
  private sub: any;
  private subQ: any;
  team$: Observable<Roster | undefined>=of(undefined);
  person$: Observable<Person | undefined>=of(undefined);
  team: Person | undefined;
  selected: Athlete | Coach | Person | undefined;

  constructor(private route: ActivatedRoute, private router: Router, @Inject(RostersService) private roster: RostersService, private _bottomSheet: MatBottomSheet) {}

  ngOnInit() {
    this.sub = combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, qParams]) => { 
      this.team$=this.roster.getTeam(params['id']).pipe(
        tap(_ => {if(_) this.team = {firstname: '', lastname: '', avatar: _.avatar, birthdate: _.birthdate, role: 'Team', state: 'Active', team: _.name, description: '', details: '' } as Person}),
      );
      this.person$=this.team$.pipe(map(_ => {if(_ && qParams['person']) return [..._.athletes, ..._.coaches].find(_ => _.lastname===qParams['person']); return undefined}))
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  selectPerson(person?: Athlete | Coach) {
    if(!person) this.selected = undefined;
    else this.selected = person;
  }

  isCoach(data: any) { return this.roster.isCoach(data) ? data : undefined; }
  isAthlete(data: any) { return this.roster.isAthlete(data) ? data : undefined; }
  isTeam(data: any) { return this.roster.isTeam(data) ? data : undefined; }
}