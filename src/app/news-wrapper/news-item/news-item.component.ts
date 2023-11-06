import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NewsUnit } from 'src/app/model/news';
import { MarketsService } from 'src/app/service/markets.service';

@Component({
  selector: 'app-news-item',
  templateUrl: './news-item.component.html',
  styleUrls: ['./news-item.component.scss']
})
export class NewsItemComponent implements OnInit {

  newsUnit: NewsUnit = new NewsUnit()
  newsId: number = 0

  constructor(private service: MarketsService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.newsId = params['id'];
      this.getNewsDetails();
    });
  }

  getNewsDetails() {
    this.service.getNewsDetails(this.newsId).subscribe({
      next: (response: NewsUnit) => {
        this.newsUnit = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
