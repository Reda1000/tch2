import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ 
  providedIn: 'root'
})
export class CookiesService {
  private cookies = { 
    live: new BehaviorSubject(localStorage.getItem("liveCookie")==='true'),
    omaps: new BehaviorSubject(localStorage.getItem("omapsCookie")==='true'),
    gmaps: new BehaviorSubject(localStorage.getItem("gmapsCookie")==='true'),
  };
  setLiveCookie(state: boolean) {
    localStorage.setItem("liveCookie", state+'');
    this.cookies.live.next(state);
  }
  getLiveCookie() {
    return this.cookies.live.asObservable();
  }
  setOMapsCookie(state: boolean) {
    localStorage.setItem("omapsCookie", state+'');
    this.cookies.omaps.next(state);
  }
  getOMapsCookie() {
    return this.cookies.omaps.asObservable();
  }
  setGMapsCookie(state: boolean) {
    localStorage.setItem("gmapsCookie", state+'');
    this.cookies.gmaps.next(state);
  }
  getGMapsCookie() {
    return this.cookies.gmaps.asObservable();
  }
  clearCookie() {
    localStorage.clear();
  }
}
