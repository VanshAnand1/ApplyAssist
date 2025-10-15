import { Component } from '@angular/core';

import PercentageComponent from './keyword-form/percentage/percentage.component';
import KeywordInputComponent from './keyword-form/keyword-input/keyword-input.component';
import KeywordDisplayComponent from './keyword-form/keyword-display/keyword-display.component';
import WindowsComponent from './windows/windows.component';

@Component({
  selector: 'app-home',
  imports: [
    PercentageComponent,
    KeywordInputComponent,
    KeywordDisplayComponent,
    WindowsComponent,
  ],
  template: `
    <windows-component></windows-component>
    <percentage-component></percentage-component>
    <keyword-input></keyword-input>
    <keyword-display></keyword-display>
  `,
})
export default class HomeComponent {}
