import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bjng-inline-loading-indicator',
  styleUrls: ['./inline-loading-indicator.component.scss'],
  templateUrl: './inline-loading-indicator.component.html',
})
export class InlineLoadingIndicatorComponent {
  @Input() public show = true;
  @Input() public diameter = 100;

  constructor() {}
}
