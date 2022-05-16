import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorResponse } from '@bjanderson/utils';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { httpOptions } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * Makes an HTTP DELETE call to the given url
   */
  public delete(url: string, options: any = httpOptions): Observable<any> {
    return this.http
      .delete(url, options)
      .pipe(map(this.mapResponse.bind(this)), catchError(this.mapError.bind(this)));
  }

  /**
   * Makes an HTTP GET call to the given url
   */
  public get(url: string, params?: any, options: any = httpOptions): Observable<any> {
    const requestOptions = { ...options };
    const httpParams = new HttpParams();

    if (params != null) {
      Object.keys(params).forEach((key) => {
        httpParams.set(key, params[key]);
      });
    }

    requestOptions.params = httpParams;

    return this.http
      .get(url, requestOptions)
      .pipe(map(this.mapResponse.bind(this)), catchError(this.mapError.bind(this)));
  }

  /**
   * Makes an HTTP PATCH call to the given url
   */
  public patch(url: string, body: any, options: any = httpOptions): Observable<any> {
    return this.http
      .patch(url, body, options)
      .pipe(map(this.mapResponse.bind(this)), catchError(this.mapError.bind(this)));
  }

  /**
   * Makes an HTTP POST call to the given url
   */
  public post(url: string, body: any, options: any = httpOptions): Observable<any> {
    return this.http
      .post(url, body, options)
      .pipe(map(this.mapResponse.bind(this)), catchError(this.mapError.bind(this)));
  }

  /**
   * Makes an HTTP PUT call to the given url
   */
  public put(url: string, body: any, options: any = httpOptions): Observable<any> {
    return this.http
      .put(url, body, options)
      .pipe(map(this.mapResponse.bind(this)), catchError(this.mapError.bind(this)));
  }

  /**
   * Handles any error responses from the server.
   */
  private mapError(error: any): Observable<ErrorResponse> {
    const err = new ErrorResponse(this.mapResponse(error));
    return throwError(this.mapResponse(err));
  }

  /**
   * Handles any non-error responses from the server, and returns the body of the response.
   */
  private mapResponse(response: any): any {
    let r: any;
    try {
      r = response.json();
    } catch (e) {
      r = response;
    }
    return r;
  }
}
