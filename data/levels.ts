import { LevelData } from '../types';
import * as C from '../constants';

// The game now features 10 levels with a smoother difficulty curve.
// Levels are longer and power-ups are placed more strategically.

export const LEVELS: LevelData[] = [
    // LEVEL 1: The Escape (Expanded)
    {
        worldWidth: 3000,
        worldHeight: 600,
        playerStart: { x: 100, y: 400 },
        goal: { x: 2900, y: 300, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 550, width: 300, height: 50},
            {x: 350, y: 500, width: 200, height: 50},
            {x: 600, y: 450, width: 150, height: 50},
            {x: 800, y: 400, width: 200, height: 50},
            {x: 1100, y: 500, width: 150, height: 50},
            {x: 1300, y: 420, width: 200, height: 50},
            {x: 1600, y: 450, width: 300, height: 50},
            {x: 1950, y: 400, width: 150, height: 50},
            {x: 2200, y: 500, width: 250, height: 50},
            {x: 2500, y: 450, width: 100, height: 30},
            {x: 2650, y: 400, width: 100, height: 30},
            {x: 2850, y: 400, width: 150, height: 50},
        ],
        enemies: [
            {id: 1, x: 400, y: 452, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 360, patrolRange: 120},
            {id: 2, x: 850, y: 352, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 810, patrolRange: 120},
            {id: 4, x: 1400, y: 372, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 1310, patrolRange: 150},
            {id: 5, x: 1700, y: 402, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1650, patrolRange: 180},
            {id: 101, x: 2300, y: 452, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2210, patrolRange: 220},
        ],
        powerUps: [
            {id: 4, x: 1250, y: 390, width: 24, height: 24, type: 'lunarFragment'}
        ]
    },
    // LEVEL 2: The Underbelly (Expanded) - With Moving Platforms
    {
        worldWidth: 3500,
        worldHeight: 800,
        playerStart: { x: 50, y: 100 },
        goal: { x: 3400, y: 650, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 200, width: 200, height: 50},
            {x: 300, y: 300, width: 150, height: 30},
            {x: 500, y: 400, width: 150, height: 30},
            {x: 700, y: 500, width: 300, height: 50},
            {x: 1100, y: 450, width: 100, height: 30, type: 'horizontal', moveSpeed: 1, moveRange: 150},
            {x: 1400, y: 400, width: 100, height: 30},
            {x: 1600, y: 350, width: 100, height: 30},
            {x: 1800, y: 450, width: 200, height: 30, type: 'horizontal', moveSpeed: 1.5, moveRange: 200},
            {x: 2250, y: 550, width: 200, height: 30},
            {x: 2500, y: 650, width: 150, height: 30},
            {x: 2800, y: 750, width: 400, height: 50},
            {x: 3300, y: 650, width: 150, height: 30},
            {x: 3350, y: 750, width: 200, height: 50},
        ],
        enemies: [
            {id: 6, x: 750, y: 452, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 710, patrolRange: 250},
            {id: 7, x: 1850, y: 402, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 1810, patrolRange: 150},
            {id: 8, x: 550, y: 250, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 400, patrolRange: 400},
            {id: 9, x: 2000, y: 400, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1, direction: -1, type: 'seeker', hitTimer: 0, startX: 1900, patrolRange: 300},
            {id: 102, x: 2900, y: 702, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2810, patrolRange: 350},
        ],
        powerUps: [
            {id: 1, x: 1625, y: 320, width: 24, height: 24, type: 'lunarFragment'},
            {id: 7, x: 1900, y: 420, width: 24, height: 24, type: 'healthVial'}
        ],
        hazards: [
            { x: 2800, y: 740, width: 400, height: 10, type: 'spikes' },
            { x: 1400, y: 390, width: 100, height: 10, type: 'spikes' },
        ]
    },
    // LEVEL 3: The Ruined Spire (Expanded)
    {
        worldWidth: 4000,
        worldHeight: 800,
        playerStart: { x: 100, y: 650 },
        goal: { x: 3850, y: 150, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 750, width: 900, height: 50},
            {x: 1000, y: 750, width: 1500, height: 50},
            {x: 750, y: 650, width: 100, height: 30},
            {x: 600, y: 550, width: 100, height: 30},
            {x: 750, y: 450, width: 100, height: 30},
            {x: 900, y: 350, width: 400, height: 40},
            {x: 1400, y: 350, width: 1100, height: 40},
            {x: 2600, y: 350, width: 1300, height: 40},
            {x: 2800, y: 250, width: 150, height: 30},
            {x: 3050, y: 250, width: 150, height: 30},
            {x: 3400, y: 250, width: 300, height: 30},
            {x: 3800, y: 250, width: 200, height: 100},
        ],
        enemies: [
            {id: 16, x: 500, y: 702, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 400, patrolRange: 400},
            {id: 17, x: 1300, y: 702, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: -1, type: 'enforcer', hitTimer: 0, startX: 1100, patrolRange: 500},
            {id: 18, x: 650, y: 350, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 500, patrolRange: 400},
            {id: 19, x: 1500, y: 302, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1450, patrolRange: 300},
            {id: 20, x: 2200, y: 302, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: -1, type: 'enforcer', hitTimer: 0, startX: 2000, patrolRange: 300},
            {id: 103, x: 2700, y: 302, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2650, patrolRange: 400},
            {id: 104, x: 3500, y: 200, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.2, direction: 1, type: 'seeker', hitTimer: 0, startX: 3410, patrolRange: 250},
        ],
        powerUps: [
             {id: 6, x: 2400, y: 320, width: 24, height: 24, type: 'isoldeAid'},
             {id: 8, x: 790, y: 420, width: 24, height: 24, type: 'healthVial'},
             {id: 10, x: 1000, y: 320, width: 24, height: 24, type: 'lunarFragment' },
        ],
        hazards: [
            { x: 900, y: 740, width: 100, height: 10, type: 'spikes' },
            { x: 1400, y: 340, width: 1100, height: 10, type: 'spikes' },
            { x: 2800, y: 240, width: 150, height: 10, type: 'spikes' }
        ]
    },
    // LEVEL 4: Sanctuary Siege (Expanded)
    {
        worldWidth: 4500,
        worldHeight: 600,
        playerStart: { x: 100, y: 450 },
        goal: { x: 4400, y: 450, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 550, width: 800, height: 50},
            {x: 900, y: 500, width: 300, height: 50},
            {x: 1300, y: 450, width: 300, height: 50},
            {x: 1700, y: 500, width: 300, height: 50},
            {x: 2100, y: 400, width: 150, height: 30},
            {x: 2300, y: 450, width: 150, height: 30},
            {x: 2500, y: 500, width: 150, height: 30},
            {x: 2800, y: 550, width: 500, height: 50},
            {x: 3300, y: 500, width: 80, height: 30, type: 'vertical', moveSpeed: 1, moveRange: 150},
            {x: 3400, y: 500, width: 400, height: 50},
            {x: 3900, y: 450, width: 150, height: 30},
            {x: 4100, y: 400, width: 150, height: 30},
            {x: 4350, y: 550, width: 200, height: 50},
        ],
        enemies: [
            {id: 10, x: 500, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 400, patrolRange: 300},
            {id: 11, x: 600, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: -1, type: 'enforcer', hitTimer: 0, startX: 400, patrolRange: 300},
            {id: 12, x: 1400, y: 402, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1310, patrolRange: 250},
            {id: 13, x: 1800, y: 350, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2.8, direction: -1, type: 'seeker', hitTimer: 0, startX: 1700, patrolRange: 300},
            {id: 14, x: 2600, y: 350, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 2300, patrolRange: 400},
            {id: 105, x: 3000, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2850, patrolRange: 400},
            {id: 106, x: 3200, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: -1, type: 'enforcer', hitTimer: 0, startX: 2850, patrolRange: 400},
            {id: 107, x: 3600, y: 350, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2, direction: -1, type: 'seeker', hitTimer: 0, startX: 3450, patrolRange: 300},
        ],
        powerUps: [
             {id: 2, x: 1050, y: 470, width: 24, height: 24, type: 'isoldeAid'},
             {id: 5, x: 2700, y: 470, width: 24, height: 24, type: 'lunarFragment'},
             {id: 9, x: 2200, y: 370, width: 24, height: 24, type: 'healthVial'}
        ],
        hazards: [
             { x: 800, y: 540, width: 100, height: 10, type: 'spikes' }
        ]
    },
    // LEVEL 5: The Grand Library (New)
    {
        worldWidth: 3000,
        worldHeight: 900,
        playerStart: { x: 100, y: 750 },
        goal: { x: 2800, y: 100, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 850, width: 500, height: 50},
            {x: 300, y: 700, width: 40, height: 150}, // Bookshelf
            {x: 400, y: 600, width: 150, height: 30},
            {x: 600, y: 750, width: 40, height: 100}, // Bookshelf
            {x: 650, y: 800, width: 80, height: 30, type: 'vertical', moveSpeed: 1.5, moveRange: 220},
            {x: 700, y: 850, width: 600, height: 50},
            {x: 1000, y: 700, width: 150, height: 30},
            {x: 1200, y: 600, width: 150, height: 30},
            {x: 1400, y: 500, width: 800, height: 50}, // Mid-floor
            {x: 1500, y: 350, width: 150, height: 30},
            {x: 1750, y: 300, width: 150, height: 30},
            {x: 2000, y: 250, width: 150, height: 30},
            {x: 2300, y: 200, width: 500, height: 50}, // Top floor
            {x: 2750, y: 200, width: 200, height: 150},
        ],
        enemies: [
            {id: 201, x: 800, y: 802, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 710, patrolRange: 550},
            {id: 205, x: 1250, y: 400, width: 32, height: 40, health: 40, maxHealth: 40, speed: 0, direction: 1, type: 'gargoyle', hitTimer: 0, startX: 1250},
            {id: 202, x: 1500, y: 452, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1410, patrolRange: 750},
            {id: 203, x: 1800, y: 200, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 1600, patrolRange: 400},
            {id: 204, x: 2400, y: 152, width: 32, height: 48, health: 60, maxHealth: 60, speed: 2.5, direction: -1, type: 'enforcer', hitTimer: 0, startX: 2310, patrolRange: 450},
        ],
        powerUps: [
            {id: 20, x: 1250, y: 570, width: 24, height: 24, type: 'healthVial'},
            {id: 21, x: 1450, y: 470, width: 24, height: 24, type: 'lunarFragment'},
        ],
        hazards: [
            { x: 1600, y: 490, width: 400, height: 10, type: 'spikes' }
        ]
    },
     // LEVEL 6: The Corrupted Aqueducts (New)
    {
        worldWidth: 4000,
        worldHeight: 700,
        playerStart: { x: 50, y: 100 },
        goal: { x: 3850, y: 50, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 200, width: 300, height: 30},
            {x: 450, y: 250, width: 200, height: 30},
            {x: 800, y: 300, width: 400, height: 30},
            {x: 1350, y: 350, width: 100, height: 30},
            {x: 1550, y: 350, width: 100, height: 30},
            {x: 1750, y: 350, width: 100, height: 30},
            {x: 2000, y: 300, width: 500, height: 30},
            {x: 2650, y: 250, width: 200, height: 30},
            {x: 3000, y: 200, width: 200, height: 30},
            {x: 3350, y: 150, width: 550, height: 30},
        ],
        enemies: [
            {id: 301, x: 900, y: 150, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.8, direction: 1, type: 'seeker', hitTimer: 0, startX: 810, patrolRange: 350},
            {id: 306, x: 1450, y: 200, width: 32, height: 48, health: 60, maxHealth: 60, speed: 0, direction: 1, type: 'specter', hitTimer: 0, startX: 1450},
            {id: 302, x: 1600, y: 200, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2, direction: -1, type: 'seeker', hitTimer: 0, startX: 1400, patrolRange: 400},
            {id: 303, x: 2200, y: 252, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2010, patrolRange: 450},
            {id: 304, x: 3100, y: 50, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2.2, direction: -1, type: 'seeker', hitTimer: 0, startX: 3010, patrolRange: 150},
            {id: 305, x: 3500, y: 102, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 3360, patrolRange: 400},
        ],
        powerUps: [
            {id: 30, x: 2300, y: 270, width: 24, height: 24, type: 'isoldeAid'},
            {id: 31, x: 1650, y: 320, width: 24, height: 24, type: 'healthVial'},
        ],
        hazards: [
            { x: 800, y: 690, width: 3000, height: 10, type: 'spikes' }
        ]
    },
    // LEVEL 7: The Gilded Prison (New) - With Moving Platforms
    {
        worldWidth: 4500,
        worldHeight: 1000,
        playerStart: { x: 100, y: 850 },
        goal: { x: 4300, y: 100, width: 60, height: 100 },
        platforms: [
            // Bottom floor
            {x: 0, y: 950, width: 1500, height: 50},
            // Mid floor
            {x: 500, y: 650, width: 2000, height: 50},
            // Top floor
            {x: 1000, y: 350, width: 1000, height: 50},
            {x: 2500, y: 350, width: 1900, height: 50},
            // Connecting platforms
            {x: 1400, y: 850, width: 100, height: 30},
            {x: 1200, y: 750, width: 100, height: 30},
            {x: 1800, y: 600, width: 100, height: 30, type: 'vertical', moveSpeed: 2, moveRange: 220},
            {x: 2400, y: 550, width: 100, height: 30, type: 'horizontal', moveSpeed: 2, moveRange: 300},
            {x: 2200, y: 250, width: 100, height: 30},
            {x: 2000, y: 200, width: 100, height: 30},
            {x: 4250, y: 350, width: 200, height: 150},
        ],
        enemies: [
            {id: 401, x: 700, y: 902, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 510, patrolRange: 950},
            {id: 407, x: 1100, y: 310, width: 32, height: 40, health: 40, maxHealth: 40, speed: 0, direction: 1, type: 'gargoyle', hitTimer: 0, startX: 1100},
            {id: 402, x: 900, y: 902, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.2, direction: -1, type: 'enforcer', hitTimer: 0, startX: 510, patrolRange: 950},
            {id: 403, x: 600, y: 602, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 510, patrolRange: 1950},
            {id: 404, x: 1800, y: 602, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: -1, type: 'enforcer', hitTimer: 0, startX: 510, patrolRange: 1950},
            {id: 405, x: 2800, y: 302, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2510, patrolRange: 1800},
            {id: 406, x: 3500, y: 150, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2, direction: 1, type: 'seeker', hitTimer: 0, startX: 3000, patrolRange: 1000},
        ],
        powerUps: [
            {id: 40, x: 2000, y: 620, width: 24, height: 24, type: 'lunarFragment'},
            {id: 41, x: 1500, y: 620, width: 24, height: 24, type: 'healthVial'},
        ],
        hazards: [
            { x: 100, y: 940, width: 300, height: 10, type: 'spikes' },
            { x: 500, y: 640, width: 100, height: 10, type: 'spikes' },
            { x: 2000, y: 340, width: 500, height: 10, type: 'spikes' },
        ]
    },
    // LEVEL 8: The Skybridge (New)
    {
        worldWidth: 5000,
        worldHeight: 600,
        playerStart: { x: 100, y: 450 },
        goal: { x: 4900, y: 450, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 550, width: 200, height: 50},
            {x: 220, y: 550, width: 100, height: 30, type: 'horizontal', moveSpeed: 1.5, moveRange: 80},
            {x: 400, y: 550, width: 500, height: 50},
            {x: 1100, y: 550, width: 400, height: 50},
            {x: 1700, y: 500, width: 100, height: 30},
            {x: 1900, y: 450, width: 100, height: 30},
            {x: 2100, y: 400, width: 100, height: 30},
            {x: 2400, y: 400, width: 800, height: 50},
            {x: 3400, y: 450, width: 100, height: 30},
            {x: 3600, y: 500, width: 100, height: 30},
            {x: 3800, y: 550, width: 1200, height: 50},
        ],
        enemies: [
            {id: 501, x: 600, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 410, patrolRange: 480},
            {id: 502, x: 1200, y: 400, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2, direction: 1, type: 'seeker', hitTimer: 0, startX: 1110, patrolRange: 380},
            {id: 503, x: 2500, y: 352, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2410, patrolRange: 780},
            {id: 507, x: 2800, y: 250, width: 32, height: 48, health: 60, maxHealth: 60, speed: 0, direction: 1, type: 'specter', hitTimer: 0, startX: 2800},
            {id: 504, x: 3000, y: 352, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: -1, type: 'enforcer', hitTimer: 0, startX: 2410, patrolRange: 780},
            {id: 505, x: 3900, y: 400, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 3810, patrolRange: 1100},
            {id: 506, x: 4500, y: 400, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2.5, direction: -1, type: 'seeker', hitTimer: 0, startX: 3810, patrolRange: 1100},
        ],
        powerUps: [
            {id: 50, x: 2800, y: 370, width: 24, height: 24, type: 'lunarFragment'},
            {id: 51, x: 1950, y: 420, width: 24, height: 24, type: 'healthVial'},
        ],
        hazards: [
            { x: 200, y: 590, width: 200, height: 10, type: 'spikes' },
            { x: 900, y: 590, width: 200, height: 10, type: 'spikes' },
            { x: 1500, y: 590, width: 200, height: 10, type: 'spikes' },
        ]
    },
     // LEVEL 9: The Outer Citadel (New)
    {
        worldWidth: 6000,
        worldHeight: 700,
        playerStart: { x: 100, y: 550 },
        goal: { x: 5850, y: 550, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 650, width: 1000, height: 50},
            {x: 1200, y: 600, width: 500, height: 50},
            {x: 1900, y: 650, width: 1500, height: 50},
            {x: 2200, y: 550, width: 100, height: 30}, {x: 2400, y: 500, width: 100, height: 30}, {x: 2600, y: 450, width: 400, height: 40},
            {x: 3600, y: 650, width: 2400, height: 50},
            {x: 4000, y: 550, width: 300, height: 30},
            {x: 4500, y: 550, width: 300, height: 30},
            {x: 5000, y: 550, width: 300, height: 30},
        ],
        enemies: [
            {id: 601, x: 800, y: 602, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 10, patrolRange: 980},
            {id: 609, x: 1800, y: 500, width: 32, height: 40, health: 40, maxHealth: 40, speed: 0, direction: 1, type: 'gargoyle', hitTimer: 0, startX: 1800},
            {id: 602, x: 1400, y: 552, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1210, patrolRange: 480},
            {id: 603, x: 2000, y: 500, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2.2, direction: -1, type: 'seeker', hitTimer: 0, startX: 1910, patrolRange: 1480},
            {id: 604, x: 2800, y: 402, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 2610, patrolRange: 380},
            {id: 605, x: 3800, y: 602, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 3610, patrolRange: 2300},
            {id: 606, x: 4200, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2.5, direction: -1, type: 'enforcer', hitTimer: 0, startX: 4010, patrolRange: 280},
            {id: 607, x: 4600, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 4510, patrolRange: 280},
            {id: 608, x: 5200, y: 400, width: 40, height: 40, health: 50, maxHealth: 50, speed: 3, direction: -1, type: 'seeker', hitTimer: 0, startX: 5010, patrolRange: 700},
        ],
        powerUps: [
             {id: 60, x: 2700, y: 420, width: 24, height: 24, type: 'lunarFragment'},
             {id: 61, x: 4150, y: 520, width: 24, height: 24, type: 'isoldeAid'},
             {id: 62, x: 3050, y: 620, width: 24, height: 24, type: 'healthVial'},
        ]
    },
    // LEVEL 10: The Citadel's Throne (Final Boss)
    {
        worldWidth: 1600,
        worldHeight: 600,
        playerStart: { x: 80, y: 450 },
        goal: { x: -1000, y: 400, width: 60, height: 100 }, // Initially off-screen
        platforms: [
            {x: 0, y: 550, width: 1600, height: 50},
            {x: 200, y: 450, width: 200, height: 30},
            {x: 1200, y: 450, width: 200, height: 30},
        ],
        enemies: [
            {id: 15, x: 800, y: 454, width: C.BOSS_WIDTH, height: C.BOSS_HEIGHT, health: 800, maxHealth: 800, speed: 0.6, direction: -1, type: 'boss', hitTimer: 0, startX: 100, patrolRange: 1400},
        ],
        powerUps: [
            {id: 3, x: 788, y: 300, width: 24, height: 24, type: 'lunarFragment'},
            {id: 11, x: 1250, y: 420, width: 24, height: 24, type: 'healthVial'},
        ]
    },
];