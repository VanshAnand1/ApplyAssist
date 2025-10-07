import { Component } from '@angular/core';

import PracticePage from './practice';
import HeaderComponent from './header/header.component';

@Component({
  selector: 'app-home',
  imports: [PracticePage, HeaderComponent],
  template: `
    <header-component></header-component>
    <practice-page></practice-page>
  `,
})
export default class HomeComponent {}
