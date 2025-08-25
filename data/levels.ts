import { LevelData } from '../types';
import * as C from '../constants';

// To add more levels, simply add a new LevelData object to this array.
// The game will automatically detect and include it in the progression.

export const LEVELS: LevelData[] = [
    // LEVEL 1: The Escape
    {
        worldWidth: 2000,
        worldHeight: 600,
        playerStart: { x: 100, y: 400 },
        goal: { x: 1900, y: 300, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 550, width: 300, height: 50},
            {x: 350, y: 500, width: 200, height: 50},
            {x: 600, y: 450, width: 150, height: 50},
            {x: 800, y: 400, width: 200, height: 50},
            {x: 1100, y: 500, width: 150, height: 50},
            {x: 1300, y: 420, width: 200, height: 50},
            {x: 1600, y: 450, width: 300, height: 50},
            {x: 1850, y: 400, width: 150, height: 50}
        ],
        enemies: [
            {id: 1, x: 400, y: 452, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 360, patrolRange: 120},
            {id: 2, x: 850, y: 352, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 810, patrolRange: 120},
            {id: 4, x: 1400, y: 372, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 1310, patrolRange: 150},
            {id: 5, x: 1700, y: 402, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1650, patrolRange: 180},
        ],
        powerUps: [
            {id: 4, x: 850, y: 370, width: 24, height: 24, type: 'lunarFragment'}
        ]
    },
    // LEVEL 2: The Underbelly
    {
        worldWidth: 2500,
        worldHeight: 800,
        playerStart: { x: 50, y: 100 },
        goal: { x: 2400, y: 650, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 200, width: 200, height: 50},
            {x: 300, y: 300, width: 150, height: 30},
            {x: 500, y: 400, width: 150, height: 30},
            {x: 700, y: 500, width: 300, height: 50},
            {x: 1100, y: 450, width: 100, height: 30},
            {x: 1300, y: 400, width: 100, height: 30},
            {x: 1500, y: 350, width: 100, height: 30},
            {x: 1700, y: 450, width: 200, height: 30},
            {x: 1950, y: 550, width: 200, height: 30},
            {x: 2200, y: 650, width: 150, height: 30},
            // Goal Structure
            {x: 2350, y: 750, width: 200, height: 50},
            {x: 2320, y: 650, width: 30, height: 100},
            {x: 2520, y: 650, width: 30, height: 100},
            {x: 2320, y: 620, width: 230, height: 30},
        ],
        enemies: [
            {id: 6, x: 750, y: 452, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 710, patrolRange: 250},
            {id: 7, x: 1750, y: 402, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 1710, patrolRange: 150},
            {id: 8, x: 550, y: 250, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 400, patrolRange: 400},
            {id: 9, x: 2000, y: 400, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1, direction: -1, type: 'seeker', hitTimer: 0, startX: 1900, patrolRange: 300},
        ],
        powerUps: [
            {id: 1, x: 1325, y: 370, width: 24, height: 24, type: 'lunarFragment'},
            {id: 7, x: 1540, y: 320, width: 24, height: 24, type: 'healthVial'}
        ]
    },
    // LEVEL 3: The Ruined Spire (DIFFICULTY INCREASED)
    {
        worldWidth: 2500,
        worldHeight: 800,
        playerStart: { x: 100, y: 650 },
        goal: { x: 2350, y: 150, width: 60, height: 100 },
        platforms: [
            // Ground floor
            {x: 0, y: 750, width: 900, height: 50},
            {x: 1000, y: 750, width: 1500, height: 50},
            // Ascent platforms
            {x: 750, y: 650, width: 100, height: 30},
            {x: 600, y: 550, width: 100, height: 30},
            {x: 750, y: 450, width: 100, height: 30},
            // Second floor
            {x: 900, y: 350, width: 400, height: 40},
            {x: 1400, y: 350, width: 1100, height: 40},
            // Second floor floating platforms
            {x: 1800, y: 250, width: 150, height: 30},
            {x: 2050, y: 250, width: 150, height: 30},
        ],
        enemies: [
             // Ground floor enemies
            {id: 16, x: 500, y: 702, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 400, patrolRange: 400},
            {id: 17, x: 1300, y: 702, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: -1, type: 'enforcer', hitTimer: 0, startX: 1100, patrolRange: 500},
            {id: 21, x: 1800, y: 550, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.2, direction: 1, type: 'seeker', hitTimer: 0, startX: 1600, patrolRange: 400}, // NEW
            // Ascent enemy
            {id: 18, x: 650, y: 350, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 500, patrolRange: 400}, // Faster
            // Second floor enemies
            {id: 22, x: 1000, y: 302, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 950, patrolRange: 250}, // NEW
            {id: 19, x: 1500, y: 302, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1450, patrolRange: 300},
            {id: 20, x: 2200, y: 302, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: -1, type: 'enforcer', hitTimer: 0, startX: 2000, patrolRange: 300},
        ],
        powerUps: [
             {id: 6, x: 1925, y: 220, width: 24, height: 24, type: 'isoldeAid'},
             {id: 8, x: 790, y: 420, width: 24, height: 24, type: 'healthVial'},
             {id: 10, x: 1000, y: 320, width: 24, height: 24, type: 'lunarFragment' },
        ]
    },
    // LEVEL 4: Sanctuary Siege (DIFFICULTY INCREASED)
    {
        worldWidth: 3000,
        worldHeight: 600,
        playerStart: { x: 100, y: 450 },
        goal: { x: 2900, y: 450, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 550, width: 800, height: 50},
            {x: 900, y: 500, width: 300, height: 50},
            {x: 1300, y: 450, width: 300, height: 50},
            {x: 1700, y: 500, width: 300, height: 50},
            {x: 2100, y: 400, width: 150, height: 30},
            {x: 2300, y: 450, width: 150, height: 30},
            {x: 2500, y: 500, width: 150, height: 30},
            {x: 2800, y: 550, width: 200, height: 50},
        ],
        enemies: [
            {id: 10, x: 500, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 400, patrolRange: 300},
            {id: 11, x: 600, y: 502, width: 32, height: 48, health: 30, maxHealth: 30, speed: 2, direction: -1, type: 'enforcer', hitTimer: 0, startX: 400, patrolRange: 300},
            {id: 23, x: 950, y: 452, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.5, direction: 1, type: 'enforcer', hitTimer: 0, startX: 910, patrolRange: 250}, // NEW
            {id: 12, x: 1400, y: 402, width: 32, height: 48, health: 30, maxHealth: 30, speed: 1.2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1310, patrolRange: 250}, // Faster
            {id: 13, x: 1800, y: 350, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2.8, direction: -1, type: 'seeker', hitTimer: 0, startX: 1700, patrolRange: 300}, // Faster
            {id: 24, x: 2200, y: 250, width: 40, height: 40, health: 50, maxHealth: 50, speed: 2, direction: -1, type: 'seeker', hitTimer: 0, startX: 2100, patrolRange: 400}, // NEW
            {id: 14, x: 2600, y: 350, width: 40, height: 40, health: 50, maxHealth: 50, speed: 1.5, direction: 1, type: 'seeker', hitTimer: 0, startX: 2300, patrolRange: 400},
        ],
        powerUps: [
             {id: 2, x: 1050, y: 470, width: 24, height: 24, type: 'isoldeAid'},
             {id: 5, x: 2350, y: 420, width: 24, height: 24, type: 'lunarFragment'},
             {id: 9, x: 2560, y: 470, width: 24, height: 24, type: 'healthVial'}
        ]
    },
    // LEVEL 5: The Citadel's Shadow (DIFFICULTY DECREASED)
    {
        worldWidth: 1200,
        worldHeight: 600,
        playerStart: { x: 80, y: 450 },
        goal: { x: 1100, y: 400, width: 60, height: 100 },
        platforms: [
            {x: 0, y: 550, width: 1200, height: 50},
            {x: 200, y: 450, width: 150, height: 30},
            {x: 850, y: 450, width: 150, height: 30},
        ],
        enemies: [
            {id: 15, x: 600, y: 454, width: C.BOSS_WIDTH, height: C.BOSS_HEIGHT, health: 400, maxHealth: 400, speed: 0.4, direction: -1, type: 'boss', hitTimer: 0, startX: 100, patrolRange: 1000},
        ],
        powerUps: [
            {id: 3, x: 500, y: 300, width: 24, height: 24, type: 'lunarFragment'},
            {id: 11, x: 250, y: 420, width: 24, height: 24, type: 'healthVial'}, // NEW
        ]
    },
];
