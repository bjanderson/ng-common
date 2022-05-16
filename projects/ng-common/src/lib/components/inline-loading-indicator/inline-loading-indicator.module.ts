import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InlineLoadingIndicatorComponent } from './inline-loading-indicator.component';

@NgModule({
  declarations: [InlineLoadingIndicatorComponent],
  exports: [InlineLoadingIndicatorComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class InlineLoadingIndicatorModule {}
