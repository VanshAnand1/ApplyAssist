import { Component } from '@angular/core';

import HeaderComponent from './header/header.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent],
  template: ` <header-component></header-component> `,
})
export default class HomeComponent {}
