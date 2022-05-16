import { Observable, of } from 'rxjs';
import { AbstractServerSideDataSource } from './abstract-server-side-data-source';

const alertService: any = {
  errorResponse: () => undefined,
};

const apiService: any = {
  getItems: () => of([{ pk: 1 }]),
};

class TestDataSource extends AbstractServerSideDataSource<any> {
  constructor(protected alertSvc: any, private apiSvc: any) {
    super(alertSvc);
  }

  protected requestData(request?: any): Observable<any[]> {
    return this.apiSvc.getItems();
  }
}

let component: any;
function init(): void {
  component = new TestDataSource(alertService, apiService);
}

describe('AbstractServerSideDataSource()', () => {
  describe('constructor()', () => {
    beforeEach(() => {
      init();
    });

    it('constructs', () => {
      expect(component).toBeDefined();
    });
  });

  describe('connect()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.connect).toEqual('function');
    });

    it('returns the data as an Observable', (done) => {
      component.dataSubject.next([{ pk: 1 }]);
      const expected = [{ pk: 1 }];
      component.connect().subscribe((result: any[]) => {
        expect(result).toEqual(expected);
        done();
      });
    });
  });

  describe('disconnect()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.disconnect).toEqual('function');
    });

    it('calls dataSubject.complete()', () => {
      const spy = jest.spyOn(component.dataSubject, 'complete');
      component.disconnect();
      expect(spy).toHaveBeenCalled();
    });

    it('calls loadingSubject.complete()', () => {
      const spy = jest.spyOn(component.loadingSubject, 'complete');
      component.disconnect();
      expect(spy).toHaveBeenCalled();
    });

    it('calls totalSubject.complete()', () => {
      const spy = jest.spyOn(component.totalSubject, 'complete');
      component.disconnect();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getData()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.getData).toEqual('function');
    });

    it('returns the data', () => {
      const expected = [{ pk: 1 }];
      component.data = [{ pk: 1 }];
      const result = component.getData();
      expect(result).toEqual(expected);
    });
  });

  describe('showPaginator()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.showPaginator).toEqual('function');
    });

    it('returns false', () => {
      component.totalSubject.next(1);
      component.paginator = { pageSize: 10, page: of({}) };
      const result = component.showPaginator();
      expect(result).toEqual(false);
    });

    it('returns true', () => {
      component.totalSubject.next(100);
      component.paginator = { pageSize: 10, page: of({}) };
      const result = component.showPaginator();
      expect(result).toEqual(true);
    });
  });

  describe('selectedItems()', () => {
    beforeEach(() => {
      init();
    });

    it('returns the selected items', () => {
      const item = { pk: 1 };
      component.selection.select(item);
      const expected = [item];
      const result = component.selectedItems;
      expect(result).toEqual(expected);
    });
  });

  describe('isAllSelected()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.isAllSelected).toEqual('function');
    });

    it('returns true', () => {
      const item = { pk: 1 };
      component.selection.select(item);
      component.data = [item];
      const result = component.isAllSelected();
      expect(result).toEqual(true);
    });

    it('returns false', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const result = component.isAllSelected();
      expect(result).toEqual(false);
    });
  });

  describe('isSelected()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.isSelected).toEqual('function');
    });

    it('returns true', () => {
      const item = { pk: 1 };
      component.selection.select(item);
      component.data = [item];
      const result = component.isSelected(item);
      expect(result).toEqual(true);
    });

    it('returns false', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const result = component.isSelected(item2);
      expect(result).toEqual(false);
    });
  });

  describe('noneSelected', () => {
    beforeEach(() => {
      init();
    });

    it('returns true', () => {
      component.selection.clear;
      const result = component.noneSelected;
      expect(result).toEqual(true);
    });

    it('returns false', () => {
      const item = { pk: 1 };
      component.selection.select(item);
      component.data = [item];
      const result = component.noneSelected;
      expect(result).toEqual(false);
    });
  });

  describe('allSelected', () => {
    beforeEach(() => {
      init();
    });

    it('returns true', () => {
      const item = { pk: 1 };
      component.selection.select(item);
      component.data = [item];
      const result = component.allSelected;
      expect(result).toEqual(true);
    });

    it('returns false', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const result = component.allSelected;
      expect(result).toEqual(false);
    });
  });

  describe('someSelected', () => {
    beforeEach(() => {
      init();
    });

    it('returns false', () => {
      const item = { pk: 1 };
      component.selection.select(item);
      component.data = [item];
      const result = component.someSelected;
      expect(result).toEqual(false);
    });

    it('returns true', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const result = component.someSelected;
      expect(result).toEqual(true);
    });
  });

  describe('anySelected', () => {
    beforeEach(() => {
      init();
    });

    it('returns false', () => {
      const item = { pk: 1 };
      component.data = [item];
      const result = component.anySelected;
      expect(result).toEqual(false);
    });

    it('returns true', () => {
      const item = { pk: 1 };
      component.selection.select(item);
      component.data = [item];
      const result = component.anySelected;
      expect(result).toEqual(true);
    });

    it('returns true', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const result = component.anySelected;
      expect(result).toEqual(true);
    });
  });

  describe('toggleAll()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.toggleAll).toEqual('function');
    });

    it('calls selection.clear()', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.selection.select(item2);
      component.data = [item1, item2];
      const spy = jest.spyOn(component.selection, 'clear');
      component.toggleAll();
      expect(spy).toHaveBeenCalled();
    });

    it('calls selection.select()', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const spy = jest.spyOn(component.selection, 'select');
      component.toggleAll();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('toggle()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.toggle).toEqual('function');
    });

    it('calls selection.toggle()', () => {
      const spy = jest.spyOn(component.selection, 'toggle');
      const row = { pk: 1 };
      component.toggle(row);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('clearAllSelections()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.clearAllSelections).toEqual('function');
    });

    it('calls selection.clear()', () => {
      const spy = jest.spyOn(component.selection, 'clear');
      component.clearAllSelections();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getCheckboxLabel()', () => {
    beforeEach(() => {
      init();
    });

    it('is a function', () => {
      expect(typeof component.getCheckboxLabel).toEqual('function');
    });

    it('returns Select All', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.selection.select(item2);
      component.data = [item1, item2];
      const expected = 'Select All';
      const result = component.getCheckboxLabel();
      expect(result).toEqual(expected);
    });

    it('returns Deselect All', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const expected = 'Deselect All';
      const result = component.getCheckboxLabel();
      expect(result).toEqual(expected);
    });

    it('returns Deselect Row', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const expected = 'Deselect Row';
      const result = component.getCheckboxLabel(item1);
      expect(result).toEqual(expected);
    });

    it('returns Select Row', () => {
      const item1 = { pk: 1 };
      const item2 = { pk: 2 };
      component.selection.select(item1);
      component.data = [item1, item2];
      const expected = 'Select Row';
      const result = component.getCheckboxLabel(item2);
      expect(result).toEqual(expected);
    });
  });
});
