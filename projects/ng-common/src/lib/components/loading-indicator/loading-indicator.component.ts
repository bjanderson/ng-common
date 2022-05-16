import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadingService } from '../../services';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bjng-loading-indicator',
  styleUrls: ['./loading-indicator.component.scss'],
  templateUrl: './loading-indicator.component.html',
})
export class LoadingIndicatorComponent {
  @Input() public diameter = 100;

  public show = this.loadingService.isLoading;

  constructor(private loadingService: LoadingService) {}
}
