import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { CookiesService } from './cookies.service';
import { Title } from '@angular/platform-browser';

export interface Club {
  name: string,
  favicon: string,
  logo: string,
  homepage: string,
  responsible: string,
  accountable: string,
  whatsapp: string,
  mail: string,
  instagram: string,
  collaboration: string,
  cookies: string,
  impressum: string,
}

const clubCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQKGEi8Q1FhlYrgksANNQulHBwkMvh2FUi5Ti-4gTaj75CNKm2CHGCphMYgolmeFutZ8N5DFLPGqs_/pub?gid=295375282&single=true&output=tsv';
const clubParser = (_: any): Club => ({
  name: _.Name,
  favicon: _.Icon,
  logo: _.Image,
  homepage: _.Homepage,
  responsible: _.Responsible,
  accountable: _.Accountable,
  whatsapp: _.Whatsapp,
  mail: _.Mail,
  instagram: _.Instagram,
  collaboration: _.Collaboration,
  cookies: _.Cookies,
  impressum: _.Impressum
})
const defaultClub = `Name	Image	Homepage	Responsible	Accountable	Whatsapp	Mail	Instagram	Collaboration	Impressum
Tide Cheersport Heide	mtv-heide.de/wp-content/uploads/2017/08/MTV-105-mobil.jpg	mtv-heide.de	Celine Herbst	Celine Herbst		tide-cheersport@mtv-heide.de	https://www.instagram.com/tidecheersport.heide/	Umsetzung: David Renner / Design: Cleine Herbst & David Renner	Hier ist rechlicher impressums text  Mit mehreren Zeilen und einem <a href="Link">Link</a>
`;

@Injectable({ 
  providedIn: 'root'
})
export class ClubsService {
  private clubs = new BehaviorSubject<{ [name: string]: Club }>({});

  constructor(private http: HttpClient, private cookies: CookiesService, private title: Title) {}

  private parseClubs(_: string) {
    return _
      .split('\n')
      .map(_ => _.split('\t'))
      .reduce((st, it, i) => { 
        if(!i) st.h=it.map(_ => _.replace('\r', '')) 
        else {
          const temp = clubParser(it.reduce((stt, it, i) => { if(st.h[i]) stt[st.h[i]]=it; return stt }, {} as any)) as Club;
          st.data[temp.name] = temp; 
        }
        return st 
      }, { h: [] as string[], data: {} as { [name: string]: Club } })
      .data
  }

  private loadClub() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    // Object.keys(this.clubs.value).length ? Promise.resolve(this.clubs.value) : new Promise<{ [name: string]: Club; }>(res => 
    return new Promise<{ [name: string]: Club; }>(res => this.http.get(clubCSV, { headers, responseType: 'text' })
      .pipe(
        tap(_ => this.clubs.next(this.parseClubs(_)))
      ).subscribe(() => res(this.clubs.value))
    );
  }
  private defaultClub() {
    this.clubs.next(this.parseClubs(defaultClub))
    return Promise.resolve(this.clubs.value);
  }

  /**
   * Load the club information according cookies from online or offline
   * @returns 
   */
  getClub(club: string): Observable<Club> {
    return this.cookies.getLiveCookie().pipe(
      tap(_ => _ ? this.loadClub() : this.defaultClub()),
      switchMap(() => this.clubs),
      tap(_ => this.title.setTitle(_ && _[club] ? _[club].name : club)),
      tap(_ => { const icon: Element | null = document.querySelector('#favIcon'); if(icon) icon.setAttribute('href', _ && _[club] ? _[club].favicon : ''); }),
      map(_ => _ && _[club])
    )
  }
}
