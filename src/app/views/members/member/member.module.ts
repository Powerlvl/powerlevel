import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberComponent } from './member.component';
import {MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule} from '@angular/material';

@NgModule({
  declarations: [MemberComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule
  ],
  exports: [MemberComponent]
})
export class MemberModule { }
