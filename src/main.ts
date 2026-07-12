import { initGsapCore, initScrollRefreshFixes } from "./global";
import { initExample } from "./components/example";

function init(): void {
  initGsapCore();

  initExample();
  // Neue Components hier importieren & aufrufen

  initScrollRefreshFixes();
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
