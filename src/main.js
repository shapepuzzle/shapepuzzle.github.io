import Alpine from 'alpinejs'

import { Game } from './scripts/game';

window.Alpine = Alpine
Alpine.start()

function setTheme(theme) {
    if (theme === "dark") {
        localStorage.theme = "dark";
        document.documentElement.setAttribute("data-theme", "dark")
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
    } else {
        localStorage.theme = "light";
        document.documentElement.setAttribute("data-theme", "light")
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded");
    footer_year.textContent = new Date().getFullYear();

    if (!localStorage.getItem("consentGranted")) {
        consent_modal.showModal();
    }

    document.documentElement.classList.toggle(
        "dark",
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
    );
    if (localStorage.theme === "dark") {
        theme_toggle.checked = true;
        setTheme("dark");
    } else {
        theme_toggle.checked = false;
        setTheme("light");
    }
    console.log(localStorage.theme);

    theme_toggle.addEventListener("change", () => {
        if (theme_toggle.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
        console.log(localStorage.theme);
    });

    playNow.addEventListener("click", () => {
        landing.classList.add("hidden");
        app.classList.remove("hidden");
        // GAME START
        window.game = new Game(document.getElementById("canvas"));
        window.game.init();
        window.game.debug = true;
        window.onresize = () => { window.game.resizeGame() };
    });

    screen.orientation.addEventListener("change", (event) => {
        window.game.resizeGame();
        console.log(`ScreenOrientation change: ${event.target.type}, ${event.target.angle} degrees.`);
    });

    canvas.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            settings_fullscreen.checked = true;
        } else {
            settings_fullscreen.checked = false;
        }
    });
    
    stage_next.addEventListener("click", () => {
        if (window.game.puzzle.hasVoice) {
            var voice = window.game.assetManager.get(`puzzle_${window.game.puzzle.id}_voice`);
            voice.pause();
            voice.currentTime = 0;
        }
        if (window.game.puzzle.hasSound) {
            var sound = window.game.assetManager.get(`puzzle_${window.game.puzzle.id}_sound`);
            sound.pause();
            sound.currentTime = 0;
        }
        window.game.nextStage();
        stage_modal.close()
    });

    stage_voice.addEventListener("click", () => {
        if (window.game.puzzle.hasVoice && !stage_voice.getAttribute("disabled")) {
            var voice = window.game.assetManager.get(`puzzle_${window.game.puzzle.id}_voice`);
            voice.addEventListener("ended", () => {
                stage_voice.removeAttribute("disabled");
            });
            stage_voice.setAttribute("disabled", true);
            voice.play();
        }
    });

    stage_sound.addEventListener("click", () => {
        if (window.game.puzzle.hasSound && !stage_sound.getAttribute("disabled")) {
            var sound = window.game.assetManager.get(`puzzle_${window.game.puzzle.id}_sound`);
            sound.addEventListener("ended", () => {
                stage_sound.removeAttribute("disabled");
            });
            stage_sound.setAttribute("disabled", true);
            sound.play();
        }
    });

    fab_button_pause.addEventListener("click", () => {
        console.log('fab_button_pause');
        window.game.pauseGame();
    });

    fab_button_play.addEventListener("click", () => {
        console.log('fab_button_play');
        window.game.resumeGame();
    });

    settings_fullscreen.addEventListener("change", () => {
        if (settings_fullscreen.checked) {
            window.game.fullscreen();
        } else {
            window.game.exitfullscreen();
        }
    });

    settings_bgm.addEventListener("change", () => {
        if (settings_bgm.checked) {
            window.game.startBGM();
        } else {
            window.game.stopBGM();
        }
    });

    settings_sfx.addEventListener("change", () => {
        if (settings_sfx.checked) {
            window.game.startSFX();
        } else {
            window.game.stopSFX();
        }
    });

    settings_autosnap.addEventListener("change", () => {
        if (settings_autosnap.checked) {
            window.game.autoSnapOn();
        } else {
            window.game.autoSnapOff();
        }
    });

    settings_button_close.addEventListener("click", () => {
        window.game.resumeGame();
    });
});

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
