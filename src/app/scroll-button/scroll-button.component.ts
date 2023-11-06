import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-scroll-button',
  templateUrl: './scroll-button.component.html',
  styleUrls: ['./scroll-button.component.scss']
})
export class ScrollButtonComponent implements OnInit {

  @HostListener('window:scroll', [])
  onScroll(): void {
    let mybutton = this.el.nativeElement.querySelector('.scroll-btn');
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      this.renderer.setStyle(mybutton, "display", "block");
    } else {
      this.renderer.setStyle(mybutton, "display", "none");
    }

    this.renderer.listen(mybutton, 'click', (event) => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    })
  }
  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
  }
}
