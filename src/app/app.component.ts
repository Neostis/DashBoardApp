import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
} from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, IonRouterOutlet, RouterLink],
})
export class AppComponent implements OnInit {
  showMenu: boolean = true;
  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !['/login', '/register', '/'].includes(event.url);
      }
    });
  }

  ngOnInit() {
    this.showMenu = !['/login', '/register', '/'].includes(this.router.url);
  }

  logout() {
    this.authService.logout();
    if (!this.authService.isAuthen) {
      this.router.navigateByUrl('/login');
    }
  }
}
