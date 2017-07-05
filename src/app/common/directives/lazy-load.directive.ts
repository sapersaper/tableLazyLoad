import { Directive, OnInit, OnChanges, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[lazy-load]'
})
export class LazyLoadDirective implements OnInit, OnChanges {

  @Input() data: Object[];
  @Input() searchTerm: any;

  private tableLazyLoad: HTMLElement;
  private table: HTMLElement;
  private tableHeader: HTMLElement;
  private tableRows: Array<HTMLElement> = [];
  private rowHeight: number;
  private headerHeight: number;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.tableLazyLoad = this.el.nativeElement;
      this.table = this.tableLazyLoad.querySelector('table');
      this.tableHeader = this.tableLazyLoad.querySelector('thead');
      this.table.classList.add("table-lazy-load");

      this.headerHeight = this.tableHeader.clientHeight;
    }, 0);
  }

  ngOnChanges() {
    setTimeout(() => {
      if (!this.tableLazyLoad) return;

      this.tableRows = this.castArray(this.tableLazyLoad.querySelectorAll('tbody tr'));
      console.log('directive lazy-load on changes: ', this.searchTerm)
      console.log('directive lazy-load data: ', this.data)

      if (this.data.length > 0) {
        this.getRowHeight(this.tableRows);
        
        console.log('directive lazy-load tableRows: ', this.tableRows)
        this.showEnviroment(0, 100, this.tableRows);
      }
      // this.tableFixed = this.el.nativeElement;
      // this.tableHeaders = this.castArray(this.tableFixed.querySelectorAll('thead th'));
      // this.tableCols = this.castArray(this.tableFixed.querySelectorAll('tr > *:nth-child(1)'));

      // this.tableCols.forEach((tableCol) => {
      //     tableCol.classList.add('col-elem-pinned');
      // });

      // this.pinnedElements = this.castArray(this.tableFixed.querySelectorAll('.col-elem-pinned'));
      // this.pinnedHeaders = this.castArray(this.tableFixed.querySelectorAll('thead .col-elem-pinned'));

      // this.updateAll();
    }, 0);

  }

  getRowHeight(domElems) {
     domElems[0].classList.add('shown');
     this.rowHeight =  this.rowHeight || domElems[0].clientHeight;
  }

  @HostListener('scroll') onScroll() {
    this.getScrollItemNunmber(this.tableLazyLoad.scrollTop);
  }

  private getScrollItemNunmber(scrollPosY) {
    console.log(Math.floor((scrollPosY - this.headerHeight) / this.rowHeight)+1);
  }

  private showEnviroment(from: number, to: number, domElems: Array<HTMLElement>) {
    for (let i = from; i < to; i++) {
      domElems[i].classList.add('shown');
    }
    if (from > 0) {
      domElems[0].classList.add('shown');
      domElems[0].classList.add('invisible');
      domElems[0].setAttribute('height', this.rowHeight * from + '');
    }
  }

  private castArray(htmlElem: any): Array<HTMLElement> {
    return Array.prototype.slice.call(htmlElem);
  }

}
