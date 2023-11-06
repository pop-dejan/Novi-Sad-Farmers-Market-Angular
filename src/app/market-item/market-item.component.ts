import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MarketsUnit } from 'src/app/model/markets';
import { MarketsService } from 'src/app/service/markets.service';

@Component({
  selector: 'app-market-item',
  templateUrl: './market-item.component.html',
  styleUrls: ['./market-item.component.scss']
})
export class MarketItemComponent implements OnInit {

  marketsUnit: MarketsUnit = new MarketsUnit()
  marketsId: number = 0;

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let element = entry.target;
        element?.classList.add('animation-fade-in');
        this.renderer.setStyle(element, "opacity", "1");
      }
    });
  }, { threshold: 0.5 });

  constructor(private service: MarketsService, private route: ActivatedRoute, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.marketsId = params['id'];
      this.getMarketsDetails();
    });

    let aboutText = this.el.nativeElement.querySelector('.about-text');
    let location = this.el.nativeElement.querySelector('.location');
    this.observer.observe(aboutText);
    this.observer.observe(location);
  }

  getMarketsDetails() {
    this.service.getMarketsDetails(this.marketsId).subscribe({
      next: (response: MarketsUnit) => {
        this.marketsUnit = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
