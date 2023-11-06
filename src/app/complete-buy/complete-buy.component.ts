import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-buy',
  templateUrl: './complete-buy.component.html',
  styleUrls: ['./complete-buy.component.scss']
})
export class CompleteBuyComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  navigatePage(path: string) {
    this.router.navigate([`/${path}`])
      .then(() => {
        location.replace(location.pathname);
      });
  }
}
