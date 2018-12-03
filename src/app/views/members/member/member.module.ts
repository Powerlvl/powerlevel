import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import {MatButtonModule, MatCardModule} from '@angular/material';

@NgModule({
  declarations: [MemberComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [MemberComponent]
})
export class MemberModule { }
