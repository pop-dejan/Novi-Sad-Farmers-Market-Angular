import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let element = entry.target;
        if (element.id === "img-2" || element.id === "img-4") {
          element?.classList.add('animation-right');
          this.renderer.setStyle(element, "opacity", "1");
        } else if (element.id === "img-3") {
          element?.classList.add('animation-left');
          this.renderer.setStyle(element, "opacity", "1");
        } else if (element.id === "markets-today") {
          element?.classList.add('animation-fade-in');
          this.renderer.setStyle(element, "opacity", "1");
        } else if (element.id === "today-text") {
          element?.classList.add('animation-fade-in');
          this.renderer.setStyle(element, "opacity", "1");
        } else if (element.className === "text") {
          element?.classList.add('animation-fade-in');
          this.renderer.setStyle(element, "opacity", "1");
        }
      }
    });
  }, { threshold: 0.5 });

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    let images = this.el.nativeElement.querySelectorAll('.about-image');
    let texts = this.el.nativeElement.querySelectorAll('.text');
    let marketsToday = this.el.nativeElement.querySelector('#markets-today');
    let todayText = this.el.nativeElement.querySelector('#today-text');

    this.observer.observe(marketsToday);
    this.observer.observe(todayText);

    images.forEach((image: Element) => {
      this.observer.observe(image);
    });

    texts.forEach((text: Element) => {
      this.observer.observe(text);
    });
  }
}
