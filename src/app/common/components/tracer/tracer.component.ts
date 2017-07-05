import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'tracer',
  templateUrl: './tracer.component.html',
  styleUrls: ['./tracer.component.css']
})
export class TracerComponent implements OnInit, OnChanges {
  private startDate: any;
  private times: any[] = [];
  @Input() data;
  @Input() length;
  constructor() { }

  ngOnInit() {}

  ngOnChanges() {

    if (this.data) {
      this.startDate = moment().format('HH:mm:ss.SSS');
    } else if (typeof this.data != 'undefined' && !this.data) {
      let time = {
        length: this.length,
        amTimeAgo: new Date,
        startAt: this.startDate,
        endAt: moment().format('HH:mm:ss.SSS'),
        difference: ''
      }
      time.difference = moment.utc(moment(time.endAt, "HH:mm:ss.SSS").diff(moment(time.startAt, "HH:mm:ss.SSS"))).format('mm:ss.SSS') + ' minutes';
      this.times.push(time);
    }
  }

}
