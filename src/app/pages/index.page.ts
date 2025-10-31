import { Component } from '@angular/core';

import KeywordFormComponent from './keyword-form/keyword-form.component';
import WindowsComponent from './windows/windows.component';
import WindowSettingsComponent from './window-settings/window-settings.component';

@Component({
  selector: 'app-home',
  imports: [WindowsComponent, KeywordFormComponent, WindowSettingsComponent],
  template: `
    <windows-component></windows-component>
    <keyword-form-component></keyword-form-component>
    <window-settings-component></window-settings-component>
  `,
})
export default class HomeComponent {}
