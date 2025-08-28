
interface SpriteFrame {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
}

// Assumes the sprite sheets are grids of 32x32 pixel sprites.
const spriteSize = 32;

// Corrected sprite map to better match the provided sprite sheets.
// We are selecting side-view sprites suitable for a 2D platformer.
export const spriteMap: Record<string, Record<string, SpriteFrame[]>> = {
    human: {
        idle: [{ sx: 2 * spriteSize, sy: 0 * spriteSize, sw: spriteSize, sh: spriteSize }],
        run: [
            { sx: 2 * spriteSize, sy: 2 * spriteSize, sw: spriteSize, sh: spriteSize },
            { sx: 2 * spriteSize, sy: 3 * spriteSize, sw: spriteSize, sh: spriteSize },
        ],
        jump: [{ sx: 3 * spriteSize, sy: 1 * spriteSize, sw: spriteSize, sh: spriteSize }],
        attack: [
            { sx: 2 * spriteSize, sy: 1 * spriteSize, sw: spriteSize, sh: spriteSize },
            { sx: 2 * spriteSize, sy: 1 * spriteSize, sw: spriteSize, sh: spriteSize }, // Hold frame
        ],
        dash: [{ sx: 3 * spriteSize, sy: 1 * spriteSize, sw: spriteSize, sh: spriteSize }],
        clawAttack: [], // Not applicable for human form
    },
    werewolf: {
        idle: [{ sx: 2 * spriteSize, sy: 0 * spriteSize, sw: spriteSize, sh: spriteSize }],
        run: [
            { sx: 2 * spriteSize, sy: 1 * spriteSize, sw: spriteSize, sh: spriteSize },
            { sx: 2 * spriteSize, sy: 2 * spriteSize, sw: spriteSize, sh: spriteSize },
        ],
        jump: [{ sx: 3 * spriteSize, sy: 0 * spriteSize, sw: spriteSize, sh: spriteSize }],
        clawAttack: [
             { sx: 2 * spriteSize, sy: 2 * spriteSize, sw: spriteSize, sh: spriteSize },
             { sx: 2 * spriteSize, sy: 2 * spriteSize, sw: spriteSize, sh: spriteSize }, // Hold frame
        ],
        dash: [{ sx: 3 * spriteSize, sy: 0 * spriteSize, sw: spriteSize, sh: spriteSize }],
        attack: [], // Not applicable for werewolf form (uses clawAttack)
    }
};

class AssetManager {
    public images: { [key: string]: HTMLImageElement } = {};
    private promises: Promise<any>[] = [];

    constructor() {
        // Using root paths, assuming the 'public' folder is served as the web root.
        this.loadImage('human', '/human-sprites.png');
        this.loadImage('werewolf', '/werewolf-sprites.png');
    }

    private loadImage(key: string, src: string) {
        const img = new Image();
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
            img.onload = () => resolve(img);
            img.onerror = () => {
                const errorMsg = `Failed to load image at path: ${src}. Make sure the image is in the 'public' folder.`;
                console.error(errorMsg);
                reject(new Error(errorMsg));
            };
        });
        img.src = src;
        this.images[key] = img;
        this.promises.push(promise);
    }

    public onAllAssetsLoaded() {
        return Promise.all(this.promises);
    }
}

export const assetManager = new AssetManager();