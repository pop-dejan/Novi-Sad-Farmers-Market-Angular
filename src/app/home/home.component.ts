import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let width: MediaQueryList = window.matchMedia('(max-width: 562px)');
        let element = entry.target;
        if (width.matches == false) {
          if (element.className === "location-main") {
            element?.classList.add('animation-right');
            this.renderer.setStyle(element, "opacity", "1");
          } else if (element.className === "news") {
            element?.classList.add('animation-left');
            this.renderer.setStyle(element, "opacity", "1");
          } else if (element.className === "seasonal") {
            element?.classList.add('animation-left');
            this.renderer.setStyle(element, "opacity", "1");
          }
        } else {
          if (element.className === "location-main") {
            element?.classList.add('animation-right');
            this.renderer.setStyle(element, "opacity", "1");
          } else if (element.className === "news") {
            let wrapper = element.children[1];
            this.renderer.setStyle(wrapper, "display", "block");
            element?.classList.add('animation-left');
            this.renderer.setStyle(element, "opacity", "1");
          } else if (element.className === "seasonal") {
            let wrapper = element.firstElementChild;
            this.renderer.setStyle(wrapper, "display", "block");
            element?.classList.add('animation-left');
            this.renderer.setStyle(element, "opacity", "1");
          }
        }
      }

    });
  }, { threshold: 0.5 });

  constructor(private renderer: Renderer2, private el: ElementRef, private router: Router) {
  }

  ngOnInit(): void {
    let news = this.el.nativeElement.querySelector('.news');
    let locationMain = this.el.nativeElement.querySelector('.location-main');
    let seasonal = this.el.nativeElement.querySelector('.seasonal');
    this.observer.observe(news);
    this.observer.observe(locationMain);
    this.observer.observe(seasonal);

    let width: MediaQueryList = window.matchMedia('(max-width: 562px)');
    width.addEventListener('change', (event) => {
      let newsWrapper = news.children[1];
      let seasonalWrapper = seasonal.firstElementChild;
      if (width.matches) {
        this.renderer.setStyle(newsWrapper, "display", "block");
        this.renderer.setStyle(seasonalWrapper, "display", "block");
      } else {
        this.renderer.setStyle(newsWrapper, "display", "flex");
        this.renderer.setStyle(seasonalWrapper, "display", "flex");
      }
    })
  }

  navigatePage(path: string) {
    this.router.navigate([`/${path}`])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  navigateNews(path: string, id: number) {
    this.router.navigate([`/${path}`, id])
      .then(() => {
        location.replace(location.pathname);
      });
  }
}
