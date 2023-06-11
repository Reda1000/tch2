import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface News {
  state: 'Active' | 'Inactive';
  type: string;
  date: Date;
  title: string;
  location: Date;
  roster: string[];
  text: string;
}
export interface Event extends News {
  from: Date;
  to: Date;
  type: string;
}

const newsCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQKGEi8Q1FhlYrgksANNQulHBwkMvh2FUi5Ti-4gTaj75CNKm2CHGCphMYgolmeFutZ8N5DFLPGqs_/pub?gid=918966204&single=true&output=tsv';
const newsParser = (_: any): News => ({
  state: _.Status==='Aktiv' ? 'Active' : 'Inactive' as 'Active' | 'Inactive',
  date: new Date(_.Datum),
  title: _.Titel,
  location: _.Ort,
  roster: _.Roster.split(','),
  text: _.Text,
  type: 'News'
})

const eventsCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQKGEi8Q1FhlYrgksANNQulHBwkMvh2FUi5Ti-4gTaj75CNKm2CHGCphMYgolmeFutZ8N5DFLPGqs_/pub?gid=1081287064&single=true&output=tsv';
const eventsParser = (_: any): Event => ({
  ...newsParser(_),
  from: new Date(_.Von),
  to: new Date(_.Bis),
  type: 'Event'
})

@Injectable({ 
  providedIn: 'root'
})
export class NewsService {
  private news = new BehaviorSubject<News[] | undefined>(undefined);
  private events = new BehaviorSubject<Event[] | undefined>(undefined);

  constructor(private http: HttpClient) {}

  loadNews() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.news.value ? Promise.resolve() : new Promise<void>(res => this.http.get(newsCSV, { headers, responseType: 'text' })
      .pipe(tap(() => res()))
      .subscribe(_ => this.news.next(_
        .split('\r\n')
        .map(_ => _.split('\t'))
        .reduce((st, it, i) => { 
          if(!i) st.h=it; 
          else st.data.push(newsParser(it.reduce((stt, it, i) => { if(st.h[i]) stt[st.h[i]]=it; return stt }, {} as any))); 
          return st 
        }, { h: [] as string[], data: [] as News[] })
        .data
      )
    ));
  }
  getNews(): Observable<News[]> {
    this.loadNews();
    return this.news.asObservable().pipe(map(_ => _ ? _ : []));
  }
  isNews(t: any): t is News {
    return !t.from;
  }

  loadEvents() {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.events.value ? Promise.resolve() : new Promise<void>(res => this.http.get(eventsCSV, { headers, responseType: 'text' })
      .pipe(tap(() => res()))
      .subscribe(_ => this.events.next(_
        .split('\r\n')
        .map(_ => _.split('\t'))
        .reduce((st, it, i) => { 
          if(!i) st.h=it; 
          else st.data.push(eventsParser(it.reduce((stt, it, i) => { if(st.h[i]) stt[st.h[i]]=it; return stt }, {} as any))); 
          return st 
        }, { h: [] as string[], data: [] as Event[] })
        .data
      )
    ));
  }
  getEvents(): Observable<Event[]> {
    this.loadEvents();
    return this.events.asObservable().pipe(map(_ => _ ? _ : []));
  }
  isEvent(t: any): t is Event {
    return !!t.from;
  }

  loadLatest() {
    return Promise.all([this.loadNews(), this.loadEvents()]);
  }
  getLatest(): Observable<(Event | News)[]> {
    this.loadLatest();
    return combineLatest([this.getEvents(), this.getNews()]).pipe(
      tap(_ => console.log('david2', _)),
      map(([events, news]) => [...events.map(_ => ({..._, data: _.from})), ...news].sort((a, b) => (a.date.getDate() - b.date.getDate())))
    );
  }
}
