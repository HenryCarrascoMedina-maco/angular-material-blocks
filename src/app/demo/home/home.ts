import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { CATALOG } from '../catalog';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <section class="hero">
      <h1>angular-material-blocks</h1>
      <p>
        Componentes de Angular Material listos para copiar. Sin dependencias extra, con signals.
        Elige uno, mira cómo funciona y copia su carpeta a tu proyecto.
      </p>
      <div class="steps">
        <span><b>1</b> ng add &#64;angular/material</span>
        <span><b>2</b> Copia la carpeta del bloque</span>
        <span><b>3</b> Úsalo y cámbialo a tu gusto</span>
      </div>
    </section>

    <div class="grid">
      @for (b of catalog; track b.path) {
        <mat-card appearance="outlined" [class.soon]="!b.ready">
          <mat-card-header>
            <mat-icon mat-card-avatar>{{ b.icon }}</mat-icon>
            <mat-card-title>{{ b.title }}</mat-card-title>
            <mat-card-subtitle><code>{{ b.folder }}</code></mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ b.description }}</p>
          </mat-card-content>
          <mat-card-actions align="end">
            @if (b.ready) {
              <a matButton="filled" [routerLink]="b.path">Ver demo</a>
            } @else {
              <mat-chip disabled>Próximamente</mat-chip>
            }
          </mat-card-actions>
        </mat-card>
      }
    </div>
  `,
  styles: `
    .hero {
      max-width: 760px;
      margin-bottom: 32px;
    }
    h1 {
      font: var(--mat-sys-display-small);
      margin: 0 0 8px;
    }
    .hero p {
      font: var(--mat-sys-body-large);
      color: var(--mat-sys-on-surface-variant);
    }
    .steps {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .steps span {
      padding: 6px 14px;
      border-radius: var(--mat-sys-corner-full);
      background: var(--mat-sys-secondary-container);
      color: var(--mat-sys-on-secondary-container);
      font: var(--mat-sys-label-large);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }
    mat-card.soon {
      opacity: 0.6;
    }
    [mat-card-avatar] {
      color: var(--mat-sys-primary);
      font-size: 32px;
      width: 40px;
      height: 40px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly catalog = CATALOG;
}
