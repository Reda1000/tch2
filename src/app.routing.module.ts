import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { IntroComponent } from './views/intro/intro.component';

@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forRoot([
      { path: 'intro', component: IntroComponent },
      { path: '**', redirectTo: 'intro' }
    ])
  ],
  exports: [
    RouterModule,
  ],
  providers: [],

})
export class AppRoutingModule {}


