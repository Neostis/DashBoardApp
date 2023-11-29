import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, IonRouterOutlet, RouterLink],
})
export class AppComponent implements OnInit {
  route: string = '';

  constructor() {}

  ngOnInit() {
    const storedRoute = localStorage.getItem('currentRoute');
    if (storedRoute) {
      this.route = storedRoute;
    }
  }

  setRoute(value: string) {
    localStorage.setItem('currentRoute', value.toLowerCase());
    this.route = value.toLowerCase();
  }
}
