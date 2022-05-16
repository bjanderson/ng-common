import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor() {}

  public showLoading(): void {
    this.isLoading.next(true);
  }

  public hideLoading(): void {
    this.isLoading.next(false);
  }
}
