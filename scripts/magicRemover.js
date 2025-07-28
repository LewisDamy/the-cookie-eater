import { loadCurrentDomain } from "./helpers/domainHelper.js";

loadCurrentDomain("core").then((domain) => {
  // Future: Make HTTP Request to Github -> fetch all domain.json's
  const configUrl = chrome.runtime.getURL(`../websites/${domain}.json`);

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
        console.log("Apply style rules");
      }
    })
    .catch(err => {
      console.error(`No config found named '${domain}.json'. Reason:`, err.message);
    });
});
