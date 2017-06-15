import { TableLazyLoadPage } from './app.po';

describe('table-lazy-load App', () => {
  let page: TableLazyLoadPage;

  beforeEach(() => {
    page = new TableLazyLoadPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
