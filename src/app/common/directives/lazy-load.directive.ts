import { Directive, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

import * as _ from 'lodash';

@Directive({
  selector: '[lazy-load]'
})
export class LazyLoadDirective implements OnInit, OnChanges {
  @Input() data: Object[];
  @Input() searchTerm: string;
  @Input() lazyLoadEnviroment: any;
  @Output() EmitService = new EventEmitter();
  @Output() EmitEnviroment = new EventEmitter();

  private tableLazyLoad: HTMLElement;
  private table: HTMLElement;
  private tableHeader: HTMLElement;
  private tableRows: Array<HTMLElement> = [];
  private rowHeight: number;
  private headerHeight: number;
  private _lazyLoadEnviroment: number;
  private _lastSearchTerm: string = '';
  private pageSize: number = 100;
  private registerOffsets= [];

  constructor(private el: ElementRef) { }

  ngOnInit() {
    setTimeout(() => {
      // get dom elements
      this.tableLazyLoad = this.el.nativeElement;
      this.table = this.tableLazyLoad.querySelector('table');
      this.tableHeader = this.tableLazyLoad.querySelector('thead');

      // set class necesaries
      this.table.classList.add("table-lazy-load");

      // init necesary vars
      this._lazyLoadEnviroment = parseInt(this.lazyLoadEnviroment) || 100;
      this.headerHeight = this.tableHeader.clientHeight;

      // call when scroll 
      this.tableLazyLoad.addEventListener("scroll", this.callService, true);
    }, 0);
  }

  ngOnChanges() {
    // console.log('change last search term: ', this._lastSearchTerm)
    if (this._lastSearchTerm != '' && this._lastSearchTerm != this.searchTerm) {
      this.tableLazyLoad.scrollTop = 0;
      this.registerOffsets = [{ offset: 0, limit: this.pageSize }];
    }
    setTimeout(() => {
      if (!this.tableLazyLoad) return;
      // console.log('directive lazy-load on changes: ', this.searchTerm)
      // console.log('directive lazy-load data: ', this.data)
      // get dom elements
      this.tableRows = this.castArray(this.tableLazyLoad.querySelectorAll('tbody tr'));

      if (this.data.length > 0) {
        this.getRowHeight();
        this.setTableTotalHeight();
        this.updateList(true);
      }
    }, 0);
  }

  @HostListener('scroll') onScroll() {
    this.updateList();
  }


  private callService = _.debounce(() => {
    this._lastSearchTerm = this.searchTerm;

    let firstVisibleRowIndex: number = this.getFirstVisibleRow(this.tableLazyLoad.scrollTop);
    if (!firstVisibleRowIndex) return

    let tableMiddle = Math.floor(this.tableLazyLoad.clientHeight / 2 / this.rowHeight) + firstVisibleRowIndex + 1;

    let minEnvT = Math.floor(tableMiddle - (this.tableLazyLoad.clientHeight / this.rowHeight) * 2);
    let maxEnvT = Math.floor(tableMiddle + (this.tableLazyLoad.clientHeight / this.rowHeight) * 2);

    minEnvT = minEnvT > 0 ? minEnvT : 0;
    maxEnvT = maxEnvT < this.data.length ? maxEnvT : this.data.length;

    let minEnv = Math.floor(minEnvT / this.pageSize) * this.pageSize;
    let maxEnv = Math.floor(maxEnvT / this.pageSize) * this.pageSize;

    if (!this.objectHasntVoid(this.data[minEnvT])) {
      this.emitService(minEnv, this.pageSize);
    }

    if (!this.objectHasntVoid(this.data[maxEnvT])) {
      this.emitService(maxEnv, this.pageSize);
    }

  }, 0);

  private emitService(offset: number, limit: number) {

    if (!this.serviceIsRegistred({ offset: offset, limit: limit }))
      this.EmitService.emit({
        offset: offset,
        limit: limit
      });

    this.serviceRegister({
      offset: offset,
      limit: limit
    })
  }

  private serviceIsRegistred(params) {
    return this.registerOffsets.filter(p => p.offset == params.offset && p.limit == params.limit).length != 0;
  }

  private serviceRegister(params) {
    if (!this.serviceIsRegistred(params))
      this.registerOffsets.push(params);
  }

  private serviceDeregister() {

  }

  private objectHasntVoid(obj) {
    if (typeof obj === 'undefined') return;
    return Object.keys(obj).length != 0;
  }

  private updateList(force?: boolean) {
    let firstVisibleRowIndex: number = this.getFirstVisibleRow(this.tableLazyLoad.scrollTop);
    let envIndex = this.calculateEnviroment(firstVisibleRowIndex);
    this.showEnviroment(envIndex.from, envIndex.to, this.tableRows, force);
  }

  private getFirstVisibleRow(scrollPosY): number {
    return Math.floor((scrollPosY - this.headerHeight) / this.rowHeight) + 1;
  }

  private calculateEnviroment(scrollItemNunmber) {
    let tolerance = -10;
    let envIndex = {
      from: 0,
      to: 0
    }
    if ((scrollItemNunmber + tolerance) > 0) {
      envIndex.from = scrollItemNunmber + tolerance;
      envIndex.to = scrollItemNunmber + this._lazyLoadEnviroment + tolerance;
    } else {
      envIndex.from = 0;
      envIndex.to = this._lazyLoadEnviroment;
    }

    return envIndex;
  }

  private getRowHeight() {
    this.tableRows[0].classList.add('shown');
    this.rowHeight = this.rowHeight || this.tableRows[0].clientHeight;
  }

  private setTableTotalHeight() {
    if (!this.tableLazyLoad.querySelector('.total-height')) {
      let node: HTMLElement = document.createElement("div");
      node.classList.add('total-height');
      node.style.width = '1px';
      node.style.position = 'absolute';
      node.style.top = '0';
      this.tableLazyLoad.appendChild(node);
    }
    let heightTotal = this.tableLazyLoad.querySelector('.total-height');
    (<HTMLElement>heightTotal).style.height = this.rowHeight * this.tableRows.length + this.headerHeight + 'px';

  }

  private fromBk: number;
  private showEnviroment(from: number, to: number, domElems: Array<HTMLElement>, force?: boolean) {

    if (from == this.fromBk && !force) return;

    let diff: number = Math.abs(this.fromBk - from) || 0;
    this.fromBk = from;

    let forfrom = from - diff < 1 ? 1 : from - diff;
    let forTo = to + diff >= domElems.length ? domElems.length : to + diff;

    if (force) {
      forfrom = 1;
      forTo = domElems.length;
    }

    // console.log(forfrom, ' ( ', from, to, ' ) ', forTo)

    this.EmitEnviroment.emit({ from: from, to: to })

    for (let i = forfrom; i < forTo; i++) {
      if (i >= from && i < to) {
        domElems[i].classList.add('shown');
      }
      else if (domElems[i].classList.contains('shown')) {
        domElems[i].classList.remove('shown')
      }
    }

    if (from > 0) {
      domElems[0].classList.add('invisible');
      domElems[0].setAttribute('height', this.rowHeight * from + '');
    } else if (domElems[0]) {
      domElems[0].removeAttribute('height');
      domElems[0].classList.remove('invisible');
    }
  }

  private castArray(htmlElem: any): Array<HTMLElement> {
    return Array.prototype.slice.call(htmlElem);
  }

}
