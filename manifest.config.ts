import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'My Angular Extension',
  version: '0.0.1',
  action: { default_popup: 'popup.html' },
  options_page: 'options.html',
  background: { service_worker: 'background.js', type: 'module' },
  permissions: ['storage', 'tabs', 'activeTab'],
  host_permissions: ['https://*/*', 'http://*/*'],
  content_scripts: [
    {
      matches: ['https://*/*', 'http://*/*'],
      js: ['content.js'],
      run_at: 'document_idle',
    },
  ],
});
