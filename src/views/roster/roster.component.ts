import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { Athlete, Coach, Person, Roster, RostersService } from 'src/services/roster.service';
import { MatListModule } from '@angular/material/list';
import { map, tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MarkdownModule } from 'ngx-markdown';
import { Event, NewsService } from 'src/services/news.service';
import { Club, ClubsService } from 'src/services/club.service';

/**
 * @title Bottom Sheet Overview
 */
 @Component({
  selector: 'person-bottom-sheet',
  templateUrl: 'person.bottom.html',
  standalone: true,
  imports: [MatListModule, CommonModule],
})
export class PersonBottomSheet {
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: Athlete, private _bottomSheetRef: MatBottomSheetRef<PersonBottomSheet>) {}

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}

/**
 * @title Basic chips
 */
@Component({
  selector: 'roster',
  templateUrl: 'roster.component.html',
  styleUrls: ['./roster.component.css'],
  standalone: true,
  imports: [MatSidenavModule, CommonModule, MatListModule, MatButtonModule, MatBottomSheetModule, MatIconModule, MatExpansionModule, MarkdownModule],
})
export class RosterComponent {
  private sub: any;
  private subQ: any;
  club$: Observable<Club | undefined>=of(undefined);
  team$: Observable<Roster | undefined>=of(undefined);
  person$: Observable<Person | undefined>=of(undefined);
  events$: Observable<Event[]>=this.news.getEvents();
  team: Person | undefined;
  selected: Athlete | Coach | Person | undefined;

  constructor(private route: ActivatedRoute, private router: Router, @Inject(ClubsService) private _club: ClubsService,  @Inject(RostersService) private roster: RostersService, private news: NewsService, private _bottomSheet: MatBottomSheet) {}

  openBottomSheet(data: Person): void {
    this.selected = data;
    this.router.navigate([], {queryParams: {person: data.lastname}, queryParamsHandling: 'merge'});
//    this._bottomSheet.open(PersonBottomSheet, { data });
  }

  ngOnInit() {
    this.sub = combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, qParams]) => { 
      this.club$=this._club.getClub('Tide Cheersport Heide');
      this.team$=this.roster.getTeam(params['id']).pipe(tap(_ => {if(_) this.team = {firstname: '', lastname: '', ..._, role: 'Team', state: 'Active', team: _.name, description: '', details: '' } as Person}));
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