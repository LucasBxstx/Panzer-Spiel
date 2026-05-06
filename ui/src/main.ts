import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

window.onerror = (msg, src, line) => {
  document.body.innerHTML += `<p style="color:red">${msg} ${line}</p>`;
};
