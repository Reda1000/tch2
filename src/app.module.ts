import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, FormsModule, HttpClientModule, MatButtonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
