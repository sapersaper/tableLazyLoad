import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { TableComponent } from './table/table.component';
import { TracerComponent } from '../common/components/tracer/tracer.component';

import { GetSearchService } from '../common/services/get-search.service';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {
  private recordingSearchResults = 0;
  private recordingSearchLength;
  private inSearch: Boolean;

  @ViewChild('searchTerm') searchTerm;
  @ViewChild('from') from;
  @ViewChild('count') count;

  constructor(private getSearchService: GetSearchService) { }

  ngOnInit() {
    // this.startSearch(this.from.nativeElement.value, this.count.nativeElement.value)
  }

  getSearch(clean?: boolean) {
    this.startSearch(this.from.nativeElement.value, this.count.nativeElement.value, clean)
  }

  startSearch(offset, limit, clean?: boolean) {
    this.inSearch = true;
    this.getSearchService.getSearch(this.searchTerm.nativeElement.value, offset, limit)
      .subscribe(
      (search: any) => {
        this.inSearch = false;
        this.recordingSearchResults = clean ? [{title: 'tete'}] : search.result;
        this.recordingSearchLength = search.total_results_available;
      },
      err => {
        this.inSearch = false;
        console.log(err);
      });
  }

  getService(params) {
    console.log(params)
    this.startSearch(params.offset, params.limit)
  }

  getEnviroment(params) {
    console.log('params Enviroment: ', params)
  }


}
