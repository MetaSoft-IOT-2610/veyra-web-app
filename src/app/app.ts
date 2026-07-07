import { Component, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import {
  applyDocumentLanguage,
  persistLanguage,
  resolveInitialLanguage,
} from './shared/utils/language-preference';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Veyra');
  private readonly translate = inject(TranslateService);

  constructor() {
    this.translate.addLangs(['en', 'es']);
    const initialLang = resolveInitialLanguage();
    applyDocumentLanguage(initialLang);
    this.translate.use(initialLang);
    this.translate.onLangChange.subscribe(({ lang }) => {
      persistLanguage(lang);
      applyDocumentLanguage(lang);
    });
  }
}
