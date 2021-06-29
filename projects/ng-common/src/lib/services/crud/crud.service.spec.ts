/* eslint-disable max-classes-per-file */
import { getObject, getString } from '@bjanderson/utils';
import { EMPTY } from 'rxjs';
import { ApiService } from '../api';
import { CrudService } from './crud.service';

const url = 'test/url';

class TestClass {
  public id: string;
  constructor(o?: Partial<TestClass>) {
    const obj = getObject(o);
    this.id = getString(obj.id);
  }
}

// tslint:disable-next-line: max-classes-per-file
class TestService extends CrudService<TestClass> {
  constructor(protected apiSvc: ApiService) {
    super(apiSvc, url, TestClass);
  }
}

const apiService: any = {
  delete: () => EMPTY,
  get: () => EMPTY,
  post: () => EMPTY,
  put: () => EMPTY,
};

let service: any;
function init(): void {
  service = new TestService(apiService);
}

describe('CrudService', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('constructs', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getAll()', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named getAll', () => {
      expect(typeof service.getAll).toEqual('function');
    });

    it('calls apiService.get()', () => {
      const spy = spyOn(service.api, 'get').and.callThrough();
      service.getAll();
      expect(spy).toHaveBeenCalledWith(url);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named get', () => {
      expect(typeof service.get).toEqual('function');
    });

    it('calls apiService.get()', () => {
      const spy = spyOn(service.api, 'get').and.callThrough();
      const id = 'id1';
      service.get(id);
      expect(spy).toHaveBeenCalledWith(`${url}/${id}`);
    });
  });

  describe('create()', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named create', () => {
      expect(typeof service.create).toEqual('function');
    });

    it('calls apiService.post()', () => {
      const spy = spyOn(service.api, 'post').and.callThrough();
      const testObj = new TestClass({ id: 'id1' });
      service.create(testObj);
      expect(spy).toHaveBeenCalledWith(url, testObj);
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named update', () => {
      expect(typeof service.update).toEqual('function');
    });

    it('calls apiService.put()', () => {
      const spy = spyOn(service.api, 'put').and.callThrough();
      const testObj = new TestClass({ id: 'id1' });
      service.update(testObj);
      expect(spy).toHaveBeenCalledWith(url, testObj);
    });
  });

  describe('delete()', () => {
    beforeEach(() => {
      init();
    });

    it('has a function named delete', () => {
      expect(typeof service.delete).toEqual('function');
    });

    it('calls apiService.delete()', () => {
      const spy = spyOn(service.api, 'delete').and.callThrough();
      const testObj = new TestClass({ id: 'id1' });
      service.delete(testObj);
      expect(spy).toHaveBeenCalledWith(`${url}/${testObj.id}`);
    });
  });
});
