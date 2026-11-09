import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** Bloque de código con botón de copiar (solo para la demo). */
@Component({
  selector: 'app-code-block',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="head">
      <span>{{ title() }}</span>
      <button matButton (click)="copy()">
        <mat-icon>{{ copied() ? 'check' : 'content_copy' }}</mat-icon>
        {{ copied() ? 'Copiado' : 'Copiar' }}
      </button>
    </div>
    <pre><code>{{ code() }}</code></pre>
  `,
  styles: `
    :host {
      display: block;
      border-radius: var(--mat-sys-corner-medium);
      background: var(--mat-sys-surface-container-highest);
      overflow: hidden;
      margin-bottom: 16px;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px 4px 16px;
      font: var(--mat-sys-label-large);
      color: var(--mat-sys-on-surface-variant);
    }
    pre {
      margin: 0;
      padding: 0 16px 16px;
      overflow: auto;
      font: 13px/1.6 'Cascadia Code', Consolas, monospace;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlock {
  readonly title = input('');
  readonly code = input.required<string>();
  protected readonly copied = signal(false);
  private readonly clipboard = inject(Clipboard);

  protected copy() {
    this.clipboard.copy(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
