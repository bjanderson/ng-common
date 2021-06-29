import { HttpHeaders } from '@angular/common/http';

/**
 * These are some default http request options used in the ApiService.
 * You can override them by passing an options object into each respective ApiService call.
 */
export const httpOptions: any = {
  headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'),
  responseType: 'json',
  withCredentials: true,
};
