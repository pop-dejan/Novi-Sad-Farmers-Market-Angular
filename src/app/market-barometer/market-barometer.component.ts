import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-market-barometer',
  templateUrl: './market-barometer.component.html',
  styleUrls: ['./market-barometer.component.scss']
})
export class MarketBarometerComponent implements OnInit {

  currentD = new Date();
  vegetables: boolean = true;
  fruits: boolean = false;
  other: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  vegetablesShow() {
    this.vegetables = true;
    this.fruits = false;
    this.other = false;
  }

  fruitsShow() {
    this.vegetables = false;
    this.fruits = true;
    this.other = false;
  }

  otherShow() {
    this.vegetables = false;
    this.fruits = false;
    this.other = true;
  }
}
