import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seasonal-products',
  templateUrl: './seasonal-products.component.html',
  styleUrls: ['./seasonal-products.component.scss']
})
export class SeasonalProductsComponent implements OnInit {

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let element = entry.target;
        element?.classList.add('animation-right');
        this.renderer.setStyle(element, "opacity", "1");
      }
    });
  }, { threshold: 0.5 });

  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) {
  }

  ngOnInit(): void {
    let months = this.el.nativeElement.querySelectorAll('.month');
    months.forEach((month: Element) => {
      this.observer.observe(month);
    });
  }

  navigatePage(path: string) {
    this.router.navigate([`/${path}`])
      .then(() => {
        location.replace(location.pathname);
      });
  }
}
