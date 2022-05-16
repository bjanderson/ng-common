import { DataSource, SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ErrorResponse, isNullOrEmpty } from '@bjanderson/utils';
import { BehaviorSubject, catchError, EMPTY, Observable, take } from 'rxjs';

export abstract class AbstractDataSource<T> implements DataSource<T> {
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
    this.updateData();
    this.paginatorValue.page.subscribe(this.updateData.bind(this));
  }

  private sortValue: MatSort;
  public get sort(): MatSort {
    return this.sortValue;
  }

  public set sort(value: MatSort) {
    this.sortValue = value;
    this.updateData();
    this.sortValue.sortChange.subscribe(this.updateData.bind(this));
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

  public load(request?: any): void {
    this.loadingSubject.next(true);
    this.requestData(request)
      .pipe(
        take(1),
        catchError((error: ErrorResponse) => {
          this.alertService.errorResponse(error);
          this.loadingSubject.next(false);
          return EMPTY;
        })
      )
      .subscribe((response: T[]) => {
        this.data = response;
        this.totalSubject.next(this.data.length);
        this.updateData();
        this.loadingSubject.next(false);
      });
  }

  private updateData(): void {
    this.loadingSubject.next(true);
    let data = Array.isArray(this.data) ? this.data.slice() : [];
    data = this.sortData(data);
    data = this.filterData(data);
    data = this.paginateData(data);
    this.dataSubject.next(data);
    this.loadingSubject.next(false);
  }

  // PAGINATION
  public showPaginator(): boolean {
    return this.paginator != null && this.totalSubject.value > this.pageSizes[0];
  }

  private paginateData(data: T[]): T[] {
    let paginatedData = data.slice();
    if (this.paginatorValue != null) {
      const index = this.paginatorValue.pageIndex;
      const size = this.paginatorValue.pageSize;
      let firstI = index * size;
      if (firstI > paginatedData.length) {
        firstI = 0;
        this.paginatorValue.firstPage();
      }
      const lastI = Math.min(this.totalSubject.value, firstI + size);
      paginatedData = data.slice(firstI, lastI);
    }
    return paginatedData;
  }

  protected isOnLastPage(): boolean {
    const numPages = Math.ceil(this.data.length / (this.paginator.pageSize || 1));
    return this.paginator.pageIndex + 1 >= numPages;
  }

  // SORTING
  private sortData(data: T[]): T[] {
    let sortedData = data.slice();
    if (this.sort != null) {
      const dir = this.sort.direction;
      const prop = this.sort.active;
      if (dir && prop) {
        const isAsc = dir === 'asc';
        sortedData = data.sort((a, b) =>
          this.compare(this.sortingDataAccessor(a, prop), this.sortingDataAccessor(b, prop), isAsc)
        );
      }
    }
    return sortedData;
  }

  /** You can overwrite this in your table component to implement custom sorting. */
  public sortingDataAccessor(item: any, prop: string): string | number {
    return item == null || item[prop] == null
      ? 0
      : typeof item[prop].getTime === 'function'
      ? item[prop].getTime()
      : typeof item[prop] === 'string'
      ? item[prop].toLocaleLowerCase()
      : item[prop];
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  // FILTERING
  public applyFilter(): void {
    this.updateData();
  }

  private filterData(data: T[]): T[] {
    let filteredData = data.slice();
    if (!isNullOrEmpty(this.filter)) {
      filteredData = filteredData.filter((d) => this.filterPredicate(d, this.filter));
    }
    return filteredData;
  }

  /** You can overwrite this in your table component to implement custom filtering. */
  public filterPredicate(item: T, filter: string): boolean {
    return true;
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
