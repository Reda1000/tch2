import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';

export interface Person {
  firstname: string;
  lastname: string;
  birthdate: Date;
  role: string;
}

export interface Athlete extends Person {}

export interface Roster {
  name: string;
  coaches: Person[];
  athletes: Athlete[];
}

const rosterCSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQKGEi8Q1FhlYrgksANNQulHBwkMvh2FUi5Ti-4gTaj75CNKm2CHGCphMYgolmeFutZ8N5DFLPGqs_/pub?gid=0&single=true&output=csv';
export class RostersService {
  private rosters: BehaviorSubject<{ [name: string]: Roster }> =
    new BehaviorSubject({});

  constructor(private http: HttpClient) {}

  getRoster(name: string): Observable<Roster> {
    if (!this.rosters)
      this.http.get(rosterCSV).subscribe((_) => {
        console.log(_); 
      });
    return this.rosters.asObservable().pipe(map((_) => _[name]));
  }
}
