import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MobileTabbarComponent } from './shared/mobile-tabbar/mobile-tabbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MobileTabbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-mobile-tabbar></app-mobile-tabbar>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 400px);
    }
    @media (max-width: 768px) {
      main {
        padding-bottom: 58px;
      }
    }
  `]
})
export class AppComponent {
  title = 'DreamNest';
}
