import { loadCurrentDomain } from "./helpers/domain.js";


loadCurrentDomain("core").then((domain) => {
  const configUrl = chrome.runtime.getURL(`../configs/${domain}.json`);

  fetch(configUrl)
    .then(res => {
      /* FETCH JSON CONTENT RULES */
      if (!res.ok) {
        throw new Error(`Could not find ${domain}.json`);
      }
      return res.json();
    })
    .then(data => {
      /* EXECUTION OF JSON RULES */

      // 0) Meta Controls
      // applyMetaConfig(config.meta);

      // 1) DOM Manipulation
      // applyDomChanges(config.dom);

      // 2) Style Changes
      // applyStyles(config.style);

      // 3) Behavioural Scripts
      // runBehaviourScripts(config.behavior);

      if (data.style) {
        Object.entries(data.style).forEach(({selector, styles}) => {
          const element = document.querySelector(selector);
          if (element && styles) {
            Object.assign(element.style, styles);
          }
        });
      }
    })
    .catch(err => {
      console.error(`No config found named '${domain}.json'. Reason:`, err.message);
    });
});
