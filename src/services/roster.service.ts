import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

export interface Person {
  state: 'Active' | 'Inactive';
  firstname: string;
  lastname: string;
  team: string;
  age: number;  
  birthdate: Date;
  description: string;
  details: string;
  role: string;
  avatar: string;
}

export interface Athlete extends Person {}

export interface Roster {
  name: string;
  birthdate: Date;
  avatar: string;
  description: string;
  details: string;
  coaches: Person[];
  athletes: Athlete[];
}

const rosterCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQKGEi8Q1FhlYrgksANNQulHBwkMvh2FUi5Ti-4gTaj75CNKm2CHGCphMYgolmeFutZ8N5DFLPGqs_/pub?gid=0&single=true&output=tsv';
const personParser = (_: any): Person => ({
  state: _.Status==='Aktiv' ? 'Active' : 'Inactive' as 'Active' | 'Inactive',
  firstname: _.Vorname,
  lastname: _.Nachname,
  team: _.Team,
  role: _.Rolle,
  age: _.Alter,
  avatar: _.Bild,
  description: _.Kurzbeschreibung,
  details: _.Beschreibung,
  birthdate: new Date(_.Alter)
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
            const temp = personParser(it.reduce((stt, it, i) => { if(st.h[i]) stt[st.h[i]]=it; return stt }, {} as any));
            if(!st.data[temp.team]) st.data[temp.team]={ name: temp.team, avatar: '', birthdate: new Date(), description: '', details: '', coaches: [], athletes: []};
            if(temp.role === 'Coach') st.data[temp.team].coaches.push(temp); 
            if(temp.role === 'Team') st.data[temp.team]={...st.data[temp.team], avatar: temp.avatar, birthdate: temp.birthdate, description: temp.description, details: temp.details}; 
            else st.data[temp.team].athletes.push(temp); 
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
  getTeams(): Observable<Roster[]> {
    this.loadTeam();
    return this.teams.asObservable().pipe(map(_ => _ ? Object.values(_) : []));
  }
}
