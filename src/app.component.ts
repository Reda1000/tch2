import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'tch-app',
  template: `
    <!--div>Header</div-->
    <div class="body"><router-outlet></router-outlet></div>
    <div class="footer">
      <button class="footer__legal_button" mat-raised-button color="primary">Datenschutz & Impressum</button>
    </div>
  `,
  styleUrls: [ './app.component.css' ],
})
export class AppComponent  {

}
