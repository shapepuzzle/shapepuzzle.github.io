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

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded");

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

    theme_toggle.addEventListener("change", function () {
        if (theme_toggle.checked) {
            setTheme("dark");
        } else {
            setTheme("light");
        }
        console.log(localStorage.theme);
    });

    playNow.addEventListener("click", function () {
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

    canvas.addEventListener("fullscreenchange", (event) => {
        if (document.fullscreenElement) {
            settings_fullscreen.checked = true;
        } else {
            settings_fullscreen.checked = false;
        }
    });
    
    stage_next.addEventListener("click", function () {
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

    stage_voice.addEventListener("click", function () {
        if (window.game.puzzle.hasVoice && !stage_voice.getAttribute("disabled")) {
            var voice = window.game.assetManager.get(`puzzle_${window.game.puzzle.id}_voice`);
            voice.addEventListener("ended", function () {
                stage_voice.removeAttribute("disabled");
            });
            stage_voice.setAttribute("disabled", true);
            voice.play();
        }
    });

    stage_sound.addEventListener("click", function () {
        if (window.game.puzzle.hasSound && !stage_sound.getAttribute("disabled")) {
            var sound = window.game.assetManager.get(`puzzle_${window.game.puzzle.id}_sound`);
            sound.addEventListener("ended", function () {
                stage_sound.removeAttribute("disabled");
            });
            stage_sound.setAttribute("disabled", true);
            sound.play();
        }
    });

    fab_button_pause.addEventListener("click", () => {
        console.log('fab_button_pause');
        // fab_button_pause_link.classList.add("hidden");
        window.game.pauseGame();
    });

    fab_button_play.addEventListener("click", function () {
        console.log('fab_button_play');
        // fab_button_pause_link.classList.remove("hidden");
        window.game.resumeGame();
    });

    settings_fullscreen.addEventListener("change", function (event) {
        if (settings_fullscreen.checked) {
            window.game.fullscreen();
        } else {
            window.game.exitfullscreen();
        }
    });

    settings_bgm.addEventListener("change", function (event) {
        if (settings_bgm.checked) {
            window.game.startBGM();
        } else {
            window.game.stopBGM();
        }
    });

    settings_sfx.addEventListener("change", function (event) {
        if (settings_sfx.checked) {
            window.game.startSFX();
        } else {
            window.game.stopSFX();
        }
    });

    settings_autosnap.addEventListener("change", function (event) {
        if (settings_autosnap.checked) {
            window.game.autoSnapOn();
        } else {
            window.game.autoSnapOff();
        }
    });
});
