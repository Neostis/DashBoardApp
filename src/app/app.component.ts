import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule, IonRouterOutlet, RouterLink],
})
export class AppComponent implements OnInit {
  protected showMenu: boolean = true;
  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showMenu = !['/login', '/register', '/'].includes(event.url);
      }
    });
  }

  ngOnInit() {
    this.showMenu = !['/login', '/register', '/'].includes(this.router.url);
    this.authService.initInactivityTimer();
  }

  protected logout() {
    this.authService.logout();
  }
}
