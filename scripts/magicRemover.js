function getBaseDomainAsync(url) {
  return new Promise((resolve, reject) => {
    try {
      const {hostname} = new URL(url);
      const host = hostname.replace(/^www\./, "");
      const parts = host.split(".");
      resolve(parts[0]);
    } catch (error) {
      console.error("Invalid URL:", error);
      reject("Invalid URL: " + error.message);
    }
  });
}

getBaseDomainAsync(window.location.href).then((domain) => {
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
    .then(configRules => {
      console.log(configRules);
      /* EXECUTION OF JSON RULES */

      // 0) Meta Controls
      // applyMetaConfig(config.meta);

      // 1) DOM Manipulation
      // applyDomChanges(config.dom);

      // 2) Style Changes
      // applyStyles(config.style);
      if (configRules.style) {
        for (const [selector, styles] of Object.entries(configRules.style || {})) {
          const el = document.querySelector(selector);
          if (el && styles) {
            console.log(`Applying styles to '${selector}':`, styles);
            Object.assign(el.style, styles);
          } else {
            console.warn(`Element not found for selector '${selector}' or no styles defined.`);
          }
        }
      }

      // 3) Behavioural Scripts
      // runBehaviourScripts(config.behavior);

    })
    .catch(err => {
      console.log(`Current URL: ${err}`);
      console.error(`No config found named '${domain}.json'. Reason:`, err.message);
    });
});
