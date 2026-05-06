window.onerror = (msg, src, line) => {
  document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;background:red;color:white;padding:10px;z-index:9999;font-size:14px">ERROR: ${msg} | line ${line}</div>`;
};

window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;background:darkred;color:white;padding:10px;z-index:9999;font-size:14px">PROMISE ERROR: ${JSON.stringify(e.reason)}</div>`;
});

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => {
  document.body.innerHTML += `<div style="position:fixed;top:0;left:0;right:0;background:purple;color:white;padding:10px;z-index:9999;font-size:14px">BOOTSTRAP ERROR: ${err}</div>`;
  console.error(err);
});
