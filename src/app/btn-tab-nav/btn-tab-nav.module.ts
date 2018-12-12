import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnTabNavComponent } from './btn-tab-nav.component';
import {MatButtonModule, MatIconModule, MatTabNav, MatTabsModule, MatTooltipModule} from '@angular/material';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [BtnTabNavComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule
  ],
  exports: [BtnTabNavComponent],
  providers: [MatTabNav]
})
export class BtnTabNavModule { }
