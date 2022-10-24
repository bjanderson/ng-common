import { getArrayOfModels } from '@bjanderson/utils';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../api';

export abstract class CrudService<T> {
  constructor(
    protected api: ApiService,
    protected url: string,
    protected Model: new (o?: Partial<T>) => T
  ) {}

  public getAll(): Observable<T[]> {
    return this.api
      .get(this.url)
      .pipe(map((response: any) => getArrayOfModels(this.Model, response)));
  }

  public get(id: string): Observable<T> {
    const url = `${this.url}/${id}`;
    return this.api.get(url).pipe(map((response: any) => new this.Model(response)));
  }

  public create(item: T): Observable<T> {
    return this.api.post(this.url, item).pipe(map((response: any) => new this.Model(response)));
  }

  public update(item: T): Observable<T> {
    return this.api.put(this.url, item).pipe(map((response: any) => new this.Model(response)));
  }

  public delete(item: T): Observable<any> {
    const url = `${this.url}/${(item as any).id}`;
    return this.api.delete(url);
  }
}
