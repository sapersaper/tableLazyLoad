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

  private totalResults;

  makeResult(res, offset, limit) {
    offset = parseInt(offset);
    limit = parseInt(limit);

    this.totalResults = this.totalResults || [];

    if (this.isChangeSearch() && res.result.length > 0) {
      this.totalResults = [];
    }

    for (let i = offset; i < offset + res.result.length; i++) {
      this.totalResults[i] = res.result[i - offset];
    }
    console.log(res.result);
    res.result = this.totalResults.slice(0);
    return res;
  }

  getSearch(search?: string, offset?: string, limit?: string): Observable<any[]> {
    let serviceUrl = this.getUrl(search, offset, limit);
    let result = this.http.get(serviceUrl)
      .map((res: Response) => {
        return this.makeResult(res.json(), offset, limit);
      })
      .catch((error: any) => Observable.throw(error.json().error || { message: 'Error Server', offset: offset, limit: limit }));
    return result;

  }

  getSimpleSearch(search?: string, offset?: string, limit?: string): Observable<any[]> {
    let serviceUrl = this.getUrl(search, offset, limit);
    let result = this.http.get(serviceUrl)
      .map((res: Response) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error.json().error || { message: 'Error Server', offset: offset, limit: limit }));
    return result;

  }

}
