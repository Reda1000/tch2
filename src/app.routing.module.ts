import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntroComponent } from './views/intro/intro.component';
import { RosterComponent } from './views/roster/roster.component';
import { CalendarComponent } from './views/calendar/calendar.component';
import { NewsComponent } from './views/news/news.component';

@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forRoot([
      { path: '', component: IntroComponent },
      { path: 'roster/:id', component: RosterComponent },
//      { path: 'calendar', component: CalendarComponent },
      { path: 'calendar/:id', component: CalendarComponent },
//      { path: 'news', component: NewsComponent },
      { path: 'news/:id', component: NewsComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],
})
export class AppRoutingModule {}


