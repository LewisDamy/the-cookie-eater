// DOM elements
const currentDomainElement = document.getElementById("current-domain");
const autoModeRadio = document.getElementById("autoMode");
const askModeRadio = document.getElementById("askMode");
const deepCleanCheckbox = document.getElementById("deepClean");

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
	await loadCurrentDomain();
	await loadSettings();
	setupEventListeners();
});

// Get current tab domain
async function loadCurrentDomain() {
	try {
		// Query the active tab
		const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

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
	} catch (error) {
		console.error("Error getting current domain:", error);
		currentDomainElement.textContent = "Error loading domain";
	}
}

// Load saved settings from storage
async function loadSettings() {
	try {
		const result = await chrome.storage.sync.get({
			cookieMode: "auto",
			deepClean: false
		});

		// Set radio button
		if (result.cookieMode === "auto") {
			autoModeRadio.checked = true;
		} else {
			askModeRadio.checked = true;
		}

		// Set checkbox
		deepCleanCheckbox.checked = result.deepClean;
	} catch (error) {
		console.error("Error loading settings:", error);
	}
}

// Save settings to storage
async function saveSettings() {
	try {
		const settings = {
			cookieMode: autoModeRadio.checked ? "auto" : "ask",
			deepClean: deepCleanCheckbox.checked
		};

		await chrome.storage.sync.set(settings);

		// Send message to background script about settings change
		chrome.runtime.sendMessage({
			action: "settingsChanged",
			settings: settings
		});
	} catch (error) {
		console.error("Error saving settings:", error);
	}
}

// Setup event listeners
function setupEventListeners() {
	// Cookie mode radio buttons
	autoModeRadio.addEventListener("change", saveSettings);
	askModeRadio.addEventListener("change", saveSettings);

	// Deep clean checkbox
	deepCleanCheckbox.addEventListener("change", saveSettings);

	// Add visual feedback for interactions
	const radioOptions = document.querySelectorAll(".radio-option");
	const checkboxOption = document.querySelector(".checkbox-option");

	radioOptions.forEach((option) => {
		option.addEventListener("click", () => {
			// Add a subtle animation effect
			option.style.transform = "scale(0.98)";
			setTimeout(() => {
				option.style.transform = "scale(1)";
			}, 100);
		});
	});

	if (checkboxOption) {
		checkboxOption.addEventListener("click", () => {
			// Add a subtle animation effect
			checkboxOption.style.transform = "scale(0.98)";
			setTimeout(() => {
				checkboxOption.style.transform = "scale(1)";
			}, 100);
		});
	}
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "updateStatus") {
		// Update status indicator based on extension activity
		const statusIndicator = document.querySelector(".status-indicator");
		const statusText = document.querySelector(".status-text");

		if (message.active) {
			statusIndicator.classList.add("active");
			statusText.textContent = "Extension Active";
		} else {
			statusIndicator.classList.remove("active");
			statusText.textContent = "Extension Inactive";
		}
	}
});

// Add smooth transitions for better UX
document.querySelectorAll(".radio-option, .checkbox-option").forEach((option) => {
	option.style.transition = "all 0.2s ease";
});
