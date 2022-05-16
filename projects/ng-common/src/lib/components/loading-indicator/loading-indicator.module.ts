import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingIndicatorComponent } from './loading-indicator.component';

@NgModule({
  declarations: [LoadingIndicatorComponent],
  exports: [LoadingIndicatorComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class LoadingIndicatorModule {}
