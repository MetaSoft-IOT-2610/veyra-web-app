import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { APP_DOCUMENT_TITLE_SUFFIX } from './route-page-data';

@Injectable()
export class I18nTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);
    if (!titleKey) {
      return;
    }
    this.translate.get(titleKey).subscribe((translated) => {
      this.title.setTitle(`${translated} | ${APP_DOCUMENT_TITLE_SUFFIX}`);
    });
  }
}
