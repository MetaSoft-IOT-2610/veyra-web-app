import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslatePipe, UpperCasePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  protected currentLang = 'en';
  protected readonly languages: string[] = ['en', 'es'];
  private readonly translate = inject(TranslateService);

  constructor() {
    this.currentLang = this.translate.getCurrentLang() || 'en';
  }

  useLanguage(language: string): void {
    this.translate.use(language);
    this.currentLang = language;
  }
}
