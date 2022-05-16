import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class AbstractServerSideDataSource<T> implements DataSource<T> {
  protected data: T[] = [];
  protected dataSubject = new BehaviorSubject<T[]>([]);
  protected loadingSubject = new BehaviorSubject<boolean>(false);
  protected totalSubject = new BehaviorSubject<number>(0);

  public loading = this.loadingSubject.asObservable();
  public total = this.totalSubject.asObservable();

  public selection = new SelectionModel<T>(true, []);
  public filter: string;

  public pageSizes = [10, 20, 50, 100];

  private paginatorValue: MatPaginator;
  public get paginator(): MatPaginator {
    return this.paginatorValue;
  }
  public set paginator(value: MatPaginator) {
    this.paginatorValue = value;
    this.paginatorValue.page.subscribe(this.requestData.bind(this));
  }

  private sortValue: MatSort;
  public get sort(): MatSort {
    return this.sortValue;
  }

  public set sort(value: MatSort) {
    this.sortValue = value;
    this.sortValue.sortChange.subscribe(this.requestData.bind(this));
  }

  public get pageIndex(): number {
    return this.paginator?.pageIndex || 0;
  }

  public get pageSize(): number {
    return this.paginator?.pageSize || this.pageSizes[0];
  }

  constructor(protected alertService: { errorResponse(error: any): void }) {}

  // TABLE DATA
  protected abstract requestData(request?: any): Observable<T[]>;

  public connect(): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  public disconnect(): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this.totalSubject.complete();
  }

  public getData(): T[] {
    return this.data;
  }

  // PAGINATION
  public showPaginator(): boolean {
    return this.paginator != null && this.totalSubject.value > this.pageSizes[0];
  }

  // SELECTION
  public get selectedItems(): T[] {
    return this.selection.selected;
  }

  public get allSelected(): boolean {
    return this.selection.hasValue() && this.isAllSelected();
  }

  public get someSelected(): boolean {
    return this.selection.hasValue() && !this.isAllSelected();
  }

  public get anySelected(): boolean {
    return this.selection.hasValue();
  }

  public get noneSelected(): boolean {
    return !this.selection.hasValue();
  }

  public isSelected(row: T): boolean {
    return this.selection.isSelected(row);
  }

  public isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  public toggleAll(): void {
    if (this.allSelected) {
      this.selection.clear();
    } else {
      this.data.forEach((row) => {
        this.selection.select(row);
      });
    }
  }

  public toggle(row: T): void {
    this.selection.toggle(row);
  }

  public clearAllSelections(): void {
    this.selection.clear();
  }

  public getCheckboxLabel(row?: T): string {
    if (!row) {
      return `${this.allSelected ? 'Select' : 'Deselect'} All`;
    } else {
      return `${this.selection.isSelected(row) ? 'Deselect' : 'Select'} Row`;
    }
  }
}
