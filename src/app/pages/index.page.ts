import { Component } from '@angular/core';

import KeywordFormComponent from './keyword-form/keyword-form.component';
import WindowsComponent from './windows/windows.component';

@Component({
  selector: 'app-home',
  imports: [WindowsComponent, KeywordFormComponent],
  template: `
    <windows-component></windows-component>
    <keyword-form-component></keyword-form-component>
  `,
})
export default class HomeComponent {}
