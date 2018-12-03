import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {MembersModule} from './views/members/members.module';
import {HomeModule} from './views/home/home.module';
import {NavigationModule} from './navigation/navigation.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ContactModule} from './views/contact/contact.module';

const routes: Routes = [
  {path: 'home', loadChildren: () => HomeModule},
  {path: 'members', loadChildren: () => MembersModule },
  {path: 'contact', loadChildren: () => ContactModule },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    NavigationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
