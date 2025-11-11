export class AssetManager {
    constructor() {
        this.isLoaded = false;
        this.totalAssets = 0;
        this.loadedAssets = 0;

        this.assets = new Map();
        this.loadingAssets = new Map();

        this.onProgressCallbacks = [];
        this.onCompleteCallbacks = [];
        this.onErrorCallbacks = [];
    }

    register(key, url, type) {
        if (this.assets.has(key)) {
            console.warn(`Asset with key "${key}" is already registered.`);
            return;
        }
        if (this.loadingAssets.has(key)) {
            console.warn(`Asset with key "${key}" is already being loaded.`);
            return;
        }
        this.totalAssets++;
        this.loadingAssets.set(key, {"url": url, "type": type});
    }

    loadAll() {
        this.loadingAssets.forEach((value, key) => this.loadAsset(key, value.url, value.type));
    }

    get(key) {
        return this.assets.get(key);
    }

    has(key) {
        return this.assets.has(key);
    }

    onProgress(callback) {
        this.onProgressCallbacks.push(callback);
    }
    onComplete(callback) {
        this.onCompleteCallbacks.push(callback);
    }
    onError(callback) {
        this.onErrorCallbacks.push(callback);
    }

    loadAsset(key, url, type) {
        switch (type.toLowerCase()) {
            case 'image':
                this.loadImage(key, url);
                break;
            case 'audio':
                this.loadAudio(key, url);
                break;
            case 'json':
                this.loadJSON(key, url);
                break;
            default:
                this.onErrorCallbacks.forEach(callback => callback(`Unsupported asset type: ${type}`));
        }
    }

    loadImage(key, url) {
        const img = new Image();        
        img.onload = () => {
            this.assets.set(key, img);
            this.assetLoaded(key);
        };
        img.onerror = (error) => {
            this.onErrorCallbacks.forEach(callback => callback(`Failed to load image: ${url} - ${error.message}`));
        };
        img.src = url;
    }

    loadAudio(key, url) {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = 1.0;
        audio.src = url;
        
        const canPlayHandler = () => {
            this.assets.set(key, audio);
            this.assetLoaded(key);
            // // Some browsers need this to ensure the audio is ready
            // audio.play().then(() => {
            //     audio.pause();
            //     this.assets.set(key, audio);
            //     this.assetLoaded(key);
            // }).catch(e => {
            //     // If autoplay fails, we still consider it loaded
            //     this.assets.set(key, audio);
            //     this.assetLoaded(key);
            // });
        };

        audio.addEventListener('canplaythrough', canPlayHandler, { once: true });
        audio.addEventListener('error', (e) => {
            new Error(`Failed to load audio: ${url} - ${e.message}`);
        });

        // // Fallback if canplaythrough doesn't fire
        // setTimeout(() => {
        //     if (!this.assets.has(key)) {
        //         audio.removeEventListener('canplaythrough', canPlayHandler);
        //         this.assets.set(key, audio);
        //         this.assetLoaded(key);
        //     }
        // }, 3000);
    }

    // loadAudio(key, url) {
    //     const audio = new Audio();
    //     audio.oncanplaythrough = () => {
    //         this.assets.set(key, audio);
    //         this.assetLoaded(key);
    //     };
    //     audio.onerror = (error) => {
    //         this.onErrorCallbacks.forEach(callback => callback(`Failed to load audio: ${url} - ${error.message}`));
    //     };
    //     audio.src = url;
    // }

    loadJSON(key, url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.assets.set(key, data);
                this.assetLoaded(key);
            })
            .catch(error => {
                this.onErrorCallbacks.forEach(callback => callback(`Failed to load JSON: ${url} - ${error.message}`));
            });
    }

    assetLoaded(key) {
        this.loadedAssets++;
        this.loadingAssets.delete(key);
        // Update progress
        this.onProgressCallbacks.forEach(callback => callback(this.getProgress()));
        if (this.loadingAssets.size === 0) {
            this.isLoaded = true;
            this.onCompleteCallbacks.forEach(callback => callback());
        }
    }

    getProgress() {
        return this.totalAssets > 0 ? this.loadedAssets / this.totalAssets : 1;
    }

    clear() {
        this.assets.clear();
        this.loadingAssets.clear();
        this.isLoaded = false;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }
}

// Usage example:
/*
const assetManager = new AssetManager();

// Register assets
assetManager.register('player', 'assets/player.png', 'image');
assetManager.register('background', 'assets/bg.jpg', 'image');
assetManager.register('jump', 'assets/jump.mp3', 'audio', { volume: 0.7 });
assetManager.register('levels', 'assets/levels.json', 'json');

// Set up callbacks
assetManager.onProgress(progress => {
    console.log(`Loading: ${(progress * 100).toFixed(1)}%`);
});

assetManager.onComplete(() => {
    console.log('All assets loaded!');
    // Start your game here
    startGame();
});

assetManager.onError(error => {
    console.error('Asset loading error:', error);
});

// Start loading
assetManager.loadAll().catch(error => {
    console.error('Failed to load assets:', error);
});

// Later in your game code:
function render() {
    const playerImage = assetManager.get('player');
    // Use playerImage for rendering
}
*/