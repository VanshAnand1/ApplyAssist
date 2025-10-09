import { Component } from '@angular/core';

import HeaderComponent from './header/header.component';
import PercentageComponent from './percentage/percentage.component';
import KeywordInputComponent from './keyword-form/keyword-input/keyword-input.component';
import KeywordDisplayComponent from './keyword-form/keyword-display/keyword-display.component';
import WindowsComponent from './windows/windows.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    PercentageComponent,
    KeywordInputComponent,
    KeywordDisplayComponent,
    WindowsComponent,
  ],
  template: `
    <windows-component></windows-component>
    <header-component></header-component>
    <percentage-component></percentage-component>
    <keyword-input></keyword-input>
    <keyword-display></keyword-display>
  `,
})
export default class HomeComponent {}
