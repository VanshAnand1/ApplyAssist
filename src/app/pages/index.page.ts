import { Component } from '@angular/core';

import HeaderComponent from './header/header.component';
import PercentageComponent from './percentage/percentage.component';
import KeywordInputComponent from './keyword-form/keyword-input/keyword-input.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, PercentageComponent, KeywordInputComponent],
  template: `
    <header-component></header-component>
    <percentage-component></percentage-component>
    <keyword-input></keyword-input>
  `,
})
export default class HomeComponent {}
