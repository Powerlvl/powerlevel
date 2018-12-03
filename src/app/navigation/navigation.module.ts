import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation.component';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatIconModule} from '@angular/material';

@NgModule({
  declarations: [NavigationComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [NavigationComponent]
})
export class NavigationModule { }
