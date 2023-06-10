import { Component } from '@angular/core';

@Component({
  selector: 'tch-app',
  template: `
  <div class="container">
    <!--a routerLinkActive="active" 
       routerLink="/login">Login</a> |

    <a routerLinkActive="active" 
       routerLink="/home">Home</a> | 

    <a routerLinkActive="active" 
      routerLink="/catalog">Catalog</a--> 
      
    <router-outlet></router-outlet>
  </div>
  `,
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

}
