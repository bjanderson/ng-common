import { EMPTY } from 'rxjs';
import { ApiService } from './api.service';

const http: any = {
  delete: () => EMPTY,
  get: () => EMPTY,
  patch: () => EMPTY,
  post: () => EMPTY,
  put: () => EMPTY,
};

let service: any;
function init(): void {
  service = new ApiService(http);
}

describe('ApiService', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('constructs', () => {
      expect(service).toBeDefined();
    });
  });

  describe('delete(url: string, body: any, options: any = this.options): void', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named delete', () => {
      expect(typeof service.delete).toEqual('function');
    });
  });

  describe('get(url: string, params?: any, options: any = this.options): void', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named get', () => {
      expect(typeof service.get).toEqual('function');
    });
  });

  describe('patch(url: string, body: any, options: any = this.options): void', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named patch', () => {
      expect(typeof service.patch).toEqual('function');
    });
  });

  describe('post(url: string, body: any, options: any = this.options): void', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named post', () => {
      expect(typeof service.post).toEqual('function');
    });
  });

  describe('put(url: string, body: any, options: any = this.options): void', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named put', () => {
      expect(typeof service.put).toEqual('function');
    });
  });

  describe('mapError<TResponse>(error: any): Observable<TResponse>', () => {
    beforeEach(() => {
      init();
      service.mapResponse = () => {};
    });

    it('calls the mapResponse function', () => {
      spyOn(service, 'mapResponse').and.returnValue(EMPTY);
      service.mapError({});
      expect(service.mapResponse).toHaveBeenCalled();
    });
  });

  describe('mapResponse(response: any): any', () => {
    beforeEach(() => {
      init();
    });

    it('returns response.json() if possible', () => {
      const response = { a: 'a', json: () => 'test response' };
      const test = service.mapResponse(response);
      expect(test).toEqual('test response');
    });

    it('returns the given response if response.json() fails', () => {
      const response = { a: 'a', b: 'test response' };
      const test = service.mapResponse(response);
      expect(test).toEqual(response);
    });
  });
});
