import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntroComponent } from './views/intro/intro.component';
import { RosterComponent } from './views/roster/roster.component';

@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forRoot([
      { path: '', component: IntroComponent },
      { path: 'roster', component: RosterComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}


