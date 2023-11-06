import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MarketsService } from '../../service/markets.service';
import { NewsUnit } from '../../model/news';
import { Router } from '@angular/router';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  news: NewsUnit[] = [];
  newsSlice: NewsUnit[] = [];
  @ViewChildren('itemElement') itemElements!: QueryList<any>;

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let element = entry.target;
        element?.classList.add('animation-fade-in');
      }
    });
  }, { threshold: 0.5 });

  constructor(private service: MarketsService, private el: ElementRef, private renderer: Renderer2, private router: Router) {
  }

  ngOnInit(): void {
    this.getNewsInfo();
  }

  ngAfterViewInit(): void {
    this.itemElements.changes.forEach(elements => {
      elements.forEach((element: any) => {
        this.observer.observe(element.nativeElement);
      });
    });
  }

  getNewsInfo() {
    this.service.getNewsInfo().subscribe({
      next: (data: any) => {
        this.news = data;
        this.newsSlice = this.news.slice(0, 3);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  navigatePage(path: string, id: number) {
    this.router.navigate([`/${path}`, id])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  navigatePage2(path: string) {
    this.router.navigate([`/${path}`])
      .then(() => {
        location.replace(location.pathname);
      });
  }
}
