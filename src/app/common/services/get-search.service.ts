import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable, Subscriber } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GetSearchService {
  private searchTerms: any;
  private initSearch: string = '';

  constructor(private http: Http) { }

  private getUrl(search?: string, offset?: string, limit?: string) {
    this.searchTerms = {
      offset: (offset != '') ? offset : '0',
      limit: (limit != '') ? limit : '100',
      search: (search != '') ? search : 'a',
    }
    return 'http://192.168.99.100:3000/api/mlc/recordings?recordingClass=video&exact=false&targets=Recordings&q=' + this.searchTerms.search + '&skip=' + this.searchTerms.offset + '&top=' + this.searchTerms.limit + '&_ts=1498833645617';
  }

  private isChangeSearch() {
    if (this.initSearch != this.searchTerms.search) {
      this.initSearch = this.searchTerms.search
      return true;
    }
    return false;
  }

  private castArray(htmlElem: any): Array<HTMLElement> {
    return Array.prototype.slice.call(htmlElem);
  }

  backup() {
    let trs = this.castArray(document.querySelectorAll('tbody tr'));
    trs.forEach((tr, i) => { if (i > 200) tr.style.display = "none"; });
    trs.forEach((tr, i) => { if (i < 100 && i > 0) tr.style.display = "none"; })

    trs[0].removeAttribute('height')
    trs[0].style.visibility = 'hidden';
    trs[0].setAttribute('height', trs[0].clientHeight * 100 + '')
  }

  private totalResults;

  makeResult(res, offset, limit) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    this.totalResults = this.totalResults || [];

    if (this.isChangeSearch() && res.result.length > 0) {
      let totalRes = new Array(res.total_results_available - res.result.length).fill({});
      res.result = res.result.concat(totalRes);
      this.totalResults = res.result;
      return res;
    }

    for (let i = offset; i < offset + limit; i++) {
      this.totalResults.splice(i - 1, 1, res.result[i - offset]);
    }
    res.result = this.totalResults.slice(0);
    return res;
  }

  getSearch(search?: string, offset?: string, limit?: string): Observable<any[]> {
    let serviceUrl = this.getUrl(search, offset, limit);
    let result = this.http.get(serviceUrl)
      .map((res: Response) => {
      return this.makeResult(res.json(), offset, limit);
      })
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    return result;

  }

}
