import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface Person {
  state: 'Active' | 'Inactive';
  firstname: string;
  lastname: string;
  team: string;
  birthdate: Date;
  description: string;
  details: string;
  role: string;
  avatar: string;
  sponsor: string;
}

export interface Athlete extends Person {
  role: 'Flyer' | 'Base' | 'Back';
}
export interface Coach extends Person {
  role: 'Coach';
}
export interface Team extends Person {
  role: 'Team';
}

export interface Roster {
  name: string;
  birthdate: Date;
  avatar: string;
  description: string;
  details: string;
  coaches: Person[];
  athletes: Athlete[];
  sponsor: string;
}

/**
Status	Vorname	Nachname	Team	Rolle	Kurzbeschreibung	Beschreibung	Alter	Bild
Aktiv			Shine	Team	6-11 Jahre	Altersklasse: Primary (Jahrgänge 2013-2017) | Trainingszeit: Freitag, 16:30-18:00 Uhr | Trainingsort: GHO - Halle (Friedrich-Elvers-Straße 7, 25746 Heide) | Es wird noch eine weitere Trainingszeit (voraussichtlich dienstags zur selben Zeit) dazukommen! Zusätzlich können Extra-Trainings am Wochenende angesetzt werden.		https://www.handball-world.news/images/fotos/size3/1643549338-_G9A9465.jpg
Aktiv	Charlotte	Schmidt-Harries	Shine	Coach		Head-Coach	08/23/1999	https://randomuser.me/api/portraits/men/59.jpg
Aktiv	Celine	Herbst	Shine	Coach		Co-Coach, Spartenleitung	04/13/1998	https://randomuser.me/api/portraits/women/27.jpg
Aktiv	Kevin	Friese	Shine	Coach		Tumbling-Coach	01/11/1995	https://randomuser.me/api/portraits/women/89.jpg
Aktiv	Jan-Philip	Werner	Shine	Coach		Tumbling-Coach (Leistungsförderung)	04/29/1988	https://randomuser.me/api/portraits/women/71.jpg
Aktiv			Rise	Team	11-15 Jahre	Altersklasse: Youth (Jahrgänge 2009-2013) | Trainingszeit: Freitag, 18:00-20:00 Uhr | Trainingsort: GHO - Halle (Friedrich-Elvers-Straße 7, 25746 Heide) | Es wird noch eine weitere Trainingszeit (voraussichtlich dienstags zur selben Zeit) dazukommen! Zusätzlich können Extra-Trainings am Wochenende angesetzt werden.		https://www.handball-world.news/images/fotos/size3/1643549338-_G9A9465.jpg
Aktiv	Celine	Herbst	Rise	Coach		Head-Coach	04/13/1998	
Aktiv	Kevin	Friese	Rise	Coach		Tumbling-Coach	01/11/1995	
Aktiv	Jan-Philip	Werner	Rise	Coach		Tumbling-Coach (Leistungsförderung)	04/29/1988	
Aktiv			Eclipse	Team	ab 15 Jahren	Altersklasse: Senior (Jahrgang 2008 und älter) | Trainingszeit: Freitag, 20:00-22:00 Uhr | Trainingsort: GHO - Halle (Friedrich-Elvers-Straße 7, 25746 Heide) | Es wird noch eine weitere Trainingszeit (voraussichtlich dienstags zur selben Zeit) dazukommen! Zusätzlich können Extra-Trainings am Wochenende angesetzt werden.		https://www.handball-world.news/images/fotos/size3/1643549338-_G9A9465.jpg
Aktiv	Kevin	Friese	Eclipse	Coach		Head-Coach, Tumbling-Coach	01/11/1995	
Aktiv	Celine	Herbst	Eclipse	Coach		Co-Coach, Spartenleitung	04/13/1998	
Aktiv	Jan-Philip	Werner	Eclipse	Coach		Tumbling-Coach (Leistungsförderung)	04/29/1988	
Aktiv	Charlotte		Eclipse	Flyer				
 */
const rosterCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQKGEi8Q1FhlYrgksANNQulHBwkMvh2FUi5Ti-4gTaj75CNKm2CHGCphMYgolmeFutZ8N5DFLPGqs_/pub?gid=0&single=true&output=tsv';
const personParser = (_: any): Person => ({
  state: _.Status==='Aktiv' ? 'Active' : 'Inactive' as 'Active' | 'Inactive',
  firstname: _.Vorname,
  lastname: _.Nachname,
  team: _.Team,
  role: _.Rolle,
  avatar: _.Bild,
  description: _.Kurzbeschreibung,
  details: _.Beschreibung,
  birthdate: new Date(_.Alter),
  sponsor: _.Sponsor
})

@Injectable({ 
  providedIn: 'root'
})
export class RostersService {
  private teams = new BehaviorSubject<{ [name: string]: Roster } | undefined>(undefined);

  constructor(private http: HttpClient) {}

  loadTeam() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.teams.value ? Promise.resolve() : new Promise<void>(res => this.http.get(rosterCSV, { headers, responseType: 'text' })
      .pipe(tap(() => res()))
      .subscribe(_ => this.teams.next(_
        .split('\r\n')
        .map(_ => _.split('\t'))
        .reduce((st, it, i) => { 
          if(!i) st.h=it; 
          else {
            const temp = personParser(it.reduce((stt, it, i) => { if(st.h[i]) stt[st.h[i]]=it; return stt }, {} as any)) as Athlete | Coach | Team;
            // initialize
            if(!st.data[temp.team]) st.data[temp.team]={ name: temp.team, avatar: '', birthdate: new Date(), description: '', details: '', coaches: [], athletes: [], sponsor: ''};
            // map members of roster
            if(this.isTeam(temp)) { st.data[temp.team]={...st.data[temp.team], avatar: temp.avatar, birthdate: temp.birthdate, description: temp.description, details: temp.details, sponsor: temp.sponsor } } 
            else if(this.isCoach(temp)) st.data[temp.team].coaches.push(temp); 
            else if(this.isAthlete(temp)) st.data[temp.team].athletes.push(temp); 
          }
          return st 
        }, { h: [] as string[], data: {} as { [name: string]: Roster } })
        .data
      )
    ));
  }
  getTeam(team: string): Observable<Roster | undefined> {
    this.loadTeam();
    return this.teams.asObservable().pipe(map((_) => _ && _[team]));
  }

  isAthlete(t: any): t is Athlete {
    return ['Flyer', 'Base', 'Back'].includes(t.role);
  }
  isCoach(t: any): t is Coach {
    return t.role === 'Coach';
  }
  isTeam(t: any): t is Team {
    return t.role === 'Team';
  }

  getTeams(): Observable<Roster[]> {
    this.loadTeam();
    return this.teams.asObservable().pipe(map(_ => _ ? Object.values(_) : []));
  }
}
