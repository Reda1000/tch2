import { CommonModule } from '@angular/common';
import { Component, Inject, SecurityContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { combineLatest, filter, map, tap } from 'rxjs';
import { Club, ClubsService } from './services/club.service';
import { CookiesService } from './services/cookies.service';
import { Event, NewsService } from './services/news.service';
import {MatDividerModule} from '@angular/material/divider'; 
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: 'popup.cookies.component.html',
  standalone: true,
  imports: [CommonModule, MarkdownModule, MatListModule, MatButtonModule, MatDialogModule, MatSlideToggleModule, MatProgressSpinnerModule, FormsModule],
})
export class AppCookiesComponent {
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private _cookies: CookiesService, 
    @Inject(MAT_DIALOG_DATA) public data: {club: Club}) {
  }

  public description = this.data.club?.cookies || '';
  public live$ = this._cookies.getLiveCookie().pipe(map(_ => ({value: _})));
  public setLive(val: boolean) { this._cookies.setLiveCookie(val); }
  public gmaps$ = this._cookies.getGMapsCookie().pipe(map(_ => ({value: _})));
  public setGMaps(val: boolean) { this._cookies.setGMapsCookie(val); }
  public omaps$ = this._cookies.getOMapsCookie().pipe(map(_ => ({value: _})));
  public setOMaps(val: boolean) { this._cookies.setOMapsCookie(val); }

  public deactivate() { 
    this._cookies.setLiveCookie(false); 
    this._cookies.setGMapsCookie(false); 
    this._cookies.setOMapsCookie(false); 
  }
  public close() {
    this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {popup: undefined}, queryParamsHandling: 'merge' });
  }
}

@Component({
  templateUrl: 'popup.impressum.component.html',
  standalone: true,
  imports: [MatDialogModule, MarkdownModule, MatProgressSpinnerModule, CommonModule ],
})
export class AppImpressumComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {club: Club}) {}
}

@Component({
  templateUrl: 'popup.news.component.html',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, MarkdownModule, MatDividerModule, CommonModule ],
})
export class AppNewsComponent {
  public news$ = combineLatest([this.route.queryParams, this._news.getEvents()])
    .pipe(map(_ => _[1].filter(__ => __.title===_[0].news)[0]));

  constructor(
    private route: ActivatedRoute,
    private _news: NewsService, 
    private _cookies: CookiesService, 
    private domSanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: {club: Club}
  ) {}
  public maps$ = combineLatest([
    this._cookies.getGMapsCookie(),
    this._cookies.getOMapsCookie(),
    this.news$.pipe(map(_ => _.technical))
  ]).pipe(
    map(_ => _[0] ? `https://www.google.com/maps?q=${encodeURIComponent(_[2])}&output=embed` : 
      // _[1] ? `https://www.openstreetmap.org/export/embed.html?query=test&bbox=-62.04673002474011%2C16.95487694424327%2C-61.60521696321666%2C17.196751341562923&amp;layer=mapnik` : 
      ''
    ),
    map(_ => !_ ? 'empty' : this.domSanitizer.bypassSecurityTrustResourceUrl(_)));

  public bookmark(news: Event) {
    let from = news.from.toISOString().replaceAll('-', '').replaceAll(':', '').split('.')[0]+'Z';
    let to = news.to.toISOString().replaceAll('-', '').replaceAll(':', '').split('.')[0]+'Z';
    window.open( "data:text/calendar;charset=utf8," + escape(`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Our Company//NONSGML v1.0//EN\r\nBEGIN:VEVENT\r\nUID:me@google.com\r\nDTSTAMP:${(new Date()).toISOString().replaceAll('-', '').replaceAll(':', '').split('.')[0]+'Z'}\r\nATTENDEE;CN=My Self ;RSVP=TRUE:MAILTO:me@gmail.com\r\nORGANIZER;CN=Me:MAILTO::me@gmail.com\r\nDTSTART:${from}\r\nDTEND:${to}\r\nLOCATION:${news.location}\r\nSUMMARY:${news.title}\r\nEND:VEVENT\r\nEND:VCALENDAR`));
  }

  public mapsOpen(news: Event) {
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(news.technical)}&output=embed`);
  }
}

@Component({
  templateUrl: 'popup.calendar.component.html',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule, MarkdownModule, MatDividerModule, CommonModule ],
})
export class AppCalendarComponent {
  public news$ = combineLatest([this.route.queryParams, this._news.getEvents()])
    .pipe(map(_ => _[1].filter(__ => __.title===_[0].news)[0]));

  constructor(
    private route: ActivatedRoute,
    private _news: NewsService, 
    @Inject(MAT_DIALOG_DATA) public data: {club: Club}
  ) {}

  public bookmark(news: Event) {
    let from = news.from.toISOString().replaceAll('-', '').replaceAll(':', '').split('.')[0]+'Z';
    let to = news.to.toISOString().replaceAll('-', '').replaceAll(':', '').split('.')[0]+'Z';
    window.open( "data:text/calendar;charset=utf8," + escape(`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Our Company//NONSGML v1.0//EN\r\nBEGIN:VEVENT\r\nUID:me@google.com\r\nDTSTAMP:${(new Date()).toISOString().replaceAll('-', '').replaceAll(':', '').split('.')[0]+'Z'}\r\nATTENDEE;CN=My Self ;RSVP=TRUE:MAILTO:me@gmail.com\r\nORGANIZER;CN=Me:MAILTO::me@gmail.com\r\nDTSTART:${from}\r\nDTEND:${to}\r\nLOCATION:${news.location}\r\nSUMMARY:${news.title}\r\nEND:VEVENT\r\nEND:VCALENDAR`));
  }
}


@Component({
  templateUrl: 'popup.archive.component.html',
  standalone: true,
  imports: [MatDialogModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, MarkdownModule, MatDividerModule, CommonModule ],
})
export class AppArchiveComponent {
  public news$ = this._news.getNews().pipe(
    map(_ => _.filter(_ => _.state==='Archive').sort((a, b) => b.date.getTime() - a.date.getTime())),
    filter(_ => !!_.length)
  );

  constructor(
    private _news: NewsService, 
    @Inject(MAT_DIALOG_DATA) public data: {club: Club}
  ) {}
}
  
@Component({
  selector: 'tch-app',
  template: `<ng-container *ngIf="club$ | async as club">
    <div class="header" *ngIf="showHeader">
      <img [src]="club[0].logo" />
    </div>
    <div class="body"><router-outlet></router-outlet></div>
    <div class="footer">
      <button [routerLink]="[]" [queryParams]="{popup: 'impressum'}" class="footer__legal_button" mat-raised-button color="primary">Datenschutz & Impressum</button>
      <button [routerLink]="[]" [queryParams]="{popup: 'cookies'}" class="footer__legal_button" mat-raised-button color="primary">Cookies</button>
    </div></ng-container>
  `,
  styleUrls: [ './app.component.css' ],
})
export class AppComponent  {
  private opened = false;
  public showHeader = false;
  public club$ = combineLatest([ this._club.getClub('Tide Cheersport Heide'), this.route.queryParams ]).pipe(
    tap(([club, query]) => {
      this.showHeader = !this.router.url.includes('/roster/')
      if(club && query.popup === 'impressum' && !this.opened) this.openImpressum(club);
      if(club && query.popup === 'cookies' && !this.opened) this.openCookies(club);
      if(club && query.popup === 'news' && !this.opened) this.openNews(club);
      if(club && query.popup === 'calendar' && !this.opened) this.openCalendar(club);
      if(club && query.popup === 'archive' && !this.opened) this.openArchive(club);
    })
  );

  constructor(private route: ActivatedRoute, private router: Router, public dialog: MatDialog, public _club: ClubsService, private _cookies: CookiesService, private activatedRoute: ActivatedRoute ) {}

  openImpressum(club: Club) {
    this.opened=true;
    this.dialog.open(AppImpressumComponent, {data: { club }, width: '60vw', minWidth: '400px', height: '60vh', minHeight: '600px'}).afterClosed().subscribe(() => {
      this.opened=false;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {popup: undefined}, queryParamsHandling: 'merge' });
    });
  }

  openCookies(club: Club) {
    this.opened=true;
    this.dialog.open(AppCookiesComponent, {data: { club }, width: '60vw', minWidth: '400px', height: '60vh', minHeight: '600px'}).afterClosed().subscribe(() => {
      this.opened=false;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {popup: undefined}, queryParamsHandling: 'merge' });
    });
  }
  
  openNews(club: Club) {
    this.opened=true;
    this.dialog.open(AppNewsComponent, {data: { club }, width: '60vw', minWidth: '400px'}).afterClosed().subscribe(() => {
      this.opened=false;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {popup: undefined}, queryParamsHandling: 'merge' });
    });
  }
  
  openCalendar(club: Club) {
    this.opened=true;
    this.dialog.open(AppCalendarComponent, {data: { club }, width: '60vw', minWidth: '400px'}).afterClosed().subscribe(() => {
      this.opened=false;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {popup: undefined}, queryParamsHandling: 'merge' });
    });
  }
  
  openArchive(club: Club) {
    this.opened=true;
    this.dialog.open(AppArchiveComponent, {data: { club }, width: '60vw', minWidth: '400px'}).afterClosed().subscribe(() => {
      this.opened=false;
      this.router.navigate([], { relativeTo: this.activatedRoute, queryParams: {popup: undefined}, queryParamsHandling: 'merge' });
    });
  }
}
