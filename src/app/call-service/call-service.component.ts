import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { GetSearchService } from '../common/services/get-search.service';



@Component({
  selector: 'app-call-service',
  templateUrl: './call-service.component.html',
  styleUrls: ['./call-service.component.css']
})
export class CallServiceComponent implements OnInit {

  @ViewChild('searchTerm') searchTerm;
  @ViewChild('from') from;
  @ViewChild('count') count;

  private data: any;

  constructor(private getSearchService: GetSearchService) { }

  ngOnInit() {
  }

  getSearch() {
    this.getSearchService.getSimpleSearch(this.searchTerm.nativeElement.value, this.from.nativeElement.value, this.count.nativeElement.value)
      .subscribe(
      (search: any) => {
        this.data = search.result;
      },
      err => {
        console.log(err);
      });
  }

}
