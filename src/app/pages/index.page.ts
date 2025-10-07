import { Component } from '@angular/core';

import HeaderComponent from './header/header.component';
import PercentageComponent from './percentage/percentage.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, PercentageComponent],
  template: `
    <header-component></header-component>
    <percentage-component></percentage-component>
  `,
})
export default class HomeComponent {}
