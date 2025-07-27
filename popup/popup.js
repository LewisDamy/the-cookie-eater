// Get current tab domain and update the popup
async function getCurrentTabDomain() {
	try {
		// Query for the active tab in the current window
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

		if (tab && tab.url) {
			// Extract domain from URL
			const url = new URL(tab.url);
			const domain = url.hostname;

			// Update the domain display
			const domainElement = document.getElementById("current-domain");
			if (domainElement) {
				domainElement.textContent = domain;
			}
		} else {
			// Fallback if no tab or URL found
			const domainElement = document.getElementById("current-domain");
			if (domainElement) {
				domainElement.textContent = "Unknown";
			}
		}
	} catch (error) {
		console.error("Error getting current tab domain:", error);
		const domainElement = document.getElementById("current-domain");
		if (domainElement) {
			domainElement.textContent = "Error";
		}
	}
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
	// Get and display current domain
	getCurrentTabDomain();

	// Add event listeners for cookie mode radio buttons
	const radioButtons = document.querySelectorAll('input[name="cookieMode"]');
	radioButtons.forEach((radio) => {
		radio.addEventListener("change", (e) => {
			console.log("Cookie mode changed to:", e.target.value);
			// Store the selected mode in chrome storage
			chrome.storage.sync.set({ cookieMode: e.target.value });
		});
	});

	// Add event listener for deep clean checkbox
	const deepCleanCheckbox = document.getElementById("deepClean");
	if (deepCleanCheckbox) {
		deepCleanCheckbox.addEventListener("change", (e) => {
			console.log("Deep clean toggled:", e.target.checked);
			// Store the deep clean setting in chrome storage
			chrome.storage.sync.set({ deepClean: e.target.checked });
		});
	}

	// Load saved settings from storage
	loadSavedSettings();
});

// Load saved settings from chrome storage
async function loadSavedSettings() {
	try {
		const result = await chrome.storage.sync.get(["cookieMode", "deepClean"]);

		// Set cookie mode
		if (result.cookieMode) {
			const modeRadio = document.getElementById(result.cookieMode + "Mode");
			if (modeRadio) {
				modeRadio.checked = true;
			}
		}

		// Set deep clean checkbox
		if (result.deepClean !== undefined) {
			const deepCleanCheckbox = document.getElementById("deepClean");
			if (deepCleanCheckbox) {
				deepCleanCheckbox.checked = result.deepClean;
			}
		}
	} catch (error) {
		console.error("Error loading saved settings:", error);
	}
}
