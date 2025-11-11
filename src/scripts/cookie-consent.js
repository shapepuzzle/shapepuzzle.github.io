
if (localStorage.getItem("consentGranted") === null) {
    consent_modal.showModal();
    gtag("consent", "default", {
    "ad_user_data": "denied",
    "ad_personalization": "denied",
    "ad_storage": "denied",
    "analytics_storage": "denied",
    "functionality_storage": "denied",
    "wait_for_update": 500,
    });
    
} else {
    gtag("consent", "default", {
    "ad_user_data": localStorage.getItem("ad_user_data"),
    "ad_personalization": localStorage.getItem("ad_personalization"),
    "ad_storage": localStorage.getItem("ad_storage"),
    "analytics_storage": localStorage.getItem("analytics_storage"),
    "functionality_storage": "granted",
    });
}

//

window.addEventListener("keydown", (event) => {
    if (consent_modal.open && event.key == "Escape") {
        event.preventDefault();
    }
});

consent_tab_1.addEventListener("change", () => {
    if (consent_tab_1.checked) {
        consent_customize.classList.remove("hidden");
        consent_allow_selection.classList.add("hidden");
    }
});

consent_tab_2.addEventListener("change", () => {
    if (consent_tab_2.checked) {
        consent_customize.classList.add("hidden");
        consent_allow_selection.classList.remove("hidden");
    }
});

consent_tab_1.addEventListener("change", () => {
    if (consent_tab_1.checked) {
        consent_customize.classList.remove("hidden");
        consent_allow_selection.classList.add("hidden");
    }
});

consent_customize.addEventListener("click", () => {
    consent_tab_2.checked = true;
    consent_customize.classList.add("hidden");
    consent_allow_selection.classList.remove("hidden");
});

consent_allow_selection.addEventListener("click", () => {
    var consentStatistics = "denied";
    var consentMarketing = "denied";
    if(consent_statistics.checked) {
        consentStatistics = "granted";
    }
    if(consent_marketing.checked) {
        consentMarketing = "granted";
    }
    localStorage.setItem("consentGranted", "true");
    localStorage.setItem("ad_storage", consentMarketing);
    localStorage.setItem("ad_user_data", consentMarketing);
    localStorage.setItem("ad_personalization", consentMarketing);   
    localStorage.setItem("analytics_storage", consentStatistics);
    localStorage.setItem("functionality_storage", "granted");
    function gtag() { window.dataLayer.push(arguments); }
    gtag("consent", "update", {
        ad_user_data: consentMarketing,
        ad_personalization: consentMarketing,
        ad_storage: consentMarketing,
        analytics_storage: consentStatistics,
        functionality_storage: "granted"
    });
    consent_modal.close()
});

consent_allow.addEventListener("click", () => {
    localStorage.setItem("consentGranted", "true");
    localStorage.setItem("ad_storage", "granted");
    localStorage.setItem("ad_user_data", "granted");
    localStorage.setItem("ad_personalization", "granted");   
    localStorage.setItem("analytics_storage", "granted");
    localStorage.setItem("functionality_storage", "granted");
    function gtag() { window.dataLayer.push(arguments); }
    gtag("consent", "update", {
        ad_user_data: "granted",
        ad_personalization: "granted",
        ad_storage: "granted",
        analytics_storage: "granted",
        functionality_storage: "granted"
    });
    consent_modal.close()
});

// Load gtag.js script.
var gtagScript = document.createElement('script');
gtagScript.async = true;
gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-NY326CP2Y5';

var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore(gtagScript,firstScript);
