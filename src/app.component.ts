import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'tch-app',
  template: `
    {{test}}
    <div class="header">
      <img src="https://stackblitz.com/files/tfwbd9/github/Reda1000/tch2/main/assets/WhatsApp-Image-2023-05-12-at-13.12.34.jpg" />
    </div>
    <div class="body"><router-outlet></router-outlet></div>
    <div class="footer">
      <button class="footer__legal_button" mat-raised-button color="primary">Datenschutz & Impressum</button>
    </div>
  `,
  styleUrls: [ './app.component.css' ],
})
export class AppComponent  {
  private sub: any;
  public test = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.sub = combineLatest([this.route.pathFromRoot]).subscribe(([params]) => { 
      this.test = params+''
    });
  }
}
