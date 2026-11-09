import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CATALOG } from './demo/catalog';

/** Layout de la app de demostración. No forma parte de los bloques. */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly catalog = CATALOG;
  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 840px)')
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );
  protected readonly dark = signal(
    this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  );

  constructor() {
    // El tema usa color-scheme: con cambiarlo, Material pasa a claro u oscuro
    effect(() => {
      this.document.documentElement.style.colorScheme = this.dark() ? 'dark' : 'light';
    });
  }
}
