import { Component, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pugstun-angular';
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    //this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2024/02/26/19/39/monochrome-image-8598798_1280.jpg')";

    this.elementRef.nativeElement.ownerDocument.body.style.background = 'linear-gradient(180deg, #000000 0%, #141414 100%)';
  }

}
