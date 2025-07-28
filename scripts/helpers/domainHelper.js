/**
 * Loads the current active tab's domain name.
 *
 * @param {"core"|"full"} [mode="core"] - Determines what to return:
 *    - "core": returns the core domain part (e.g., "glassdoor" from "www.glassdoor.com").
 *    - "full": returns the full hostname (e.g., "www.glassdoor.com").
 *
 * @returns {Promise<string|null>} Resolves to the domain string based on mode or null if error occurs.
 *
 * @example
 * // Get core domain:
 * const coreDomain = await loadCurrentDomain();
 *
 * // Get full domain:
 * const fullDomain = await loadCurrentDomain("full");
 */
export const loadCurrentDomain = async (format = "full") => {
  try {
    // Query the active tab
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    if (tab && tab.url) {
      const url = new URL(tab.url);
      const domain = url.hostname;

      // Display the domain
      currentDomainElement.textContent = domain;

      // Handle special cases
      if (url.protocol === "chrome:" || url.protocol === "chrome-extension:") {
        currentDomainElement.textContent = "Chrome internal page";
      } else if (url.protocol === "file:") {
        currentDomainElement.textContent = "Local file";
      }
    } else {
      currentDomainElement.textContent = "Unknown";
    }
    // Return formatted domain name
    if (format === "core") {
      const host = currentDomainElement.textContent.replace(/^www\./, "");
      const parts = host.split(".");
      return parts.length >= 3 ? parts[parts.length - 3] : parts[0];
    } else {
      return currentDomainElement.textContent;
    }
  } catch (error) {
    console.error("Error getting current domain:", error);
    currentDomainElement.textContent = "Error loading domain";
  }
};
