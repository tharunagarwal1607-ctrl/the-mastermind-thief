// ================================================================
//  THE MASTERMIND THIEF — Complete Game Engine
//  By Tharun & Team
// ================================================================

// ============ CONFIGURATION ============
const CFG = {
    TILE: 40,
    FPS: 60,
    PLAYER_SPEED: 2.5,
    SNEAK_SPEED: 1.2,
    GUARD_SPEED: 1.5,
    GUARD_CHASE_SPEED: 2.8,
    GUARD_FOV: Math.PI / 2.5,
    GUARD_VIEW_DIST: 6,
    CAMERA_FOV: Math.PI / 3,
    CAMERA_VIEW_DIST: 7,
    DETECTION_RATE: 1.5,
    DETECTION_DECAY: 0.6,
    NOISE_WALK: 0.35,
    NOISE_SNEAK: 0.08,
    NOISE_RUN: 0.7,
    SMOKE_DURATION: 180,
    EMP_DURATION: 300,
    DISGUISE_DURATION: 400,
};

const TILE_TYPES = {
    FLOOR: 0, WALL: 1, DOOR: 2, DOOR_LOCKED: 3, VENT: 4,
    EXIT: 5, ALARM: 6, SAFE: 7, LOOT: 8, COVER: 9,
    CAMERA_MOUNT: 10, LASER_H: 11, LASER_V: 12,
    MOTION_SENSOR: 13, FURNITURE: 14, GLASS: 15,
    VENT_EXIT: 16, HACKABLE: 17, FLOOR_LIT: 18,
    FLOOR_DARK: 19, DESK: 20, COUNTER: 21, DISPLAY: 22,
};

const COLORS = {
    floor: '#1a1a24', floorLit: '#22222e', floorDark: '#111118',
    wall: '#2a2a3a', wallTop: '#3a3a4e', wallEdge: '#15151f',
    door: '#4a6050', doorLocked: '#6a4040', doorFrame: '#555',
    vent: '#333848', ventGrate: '#556',
    exit: '#1a4a2a', exitGlow: 'rgba(0,230,118,0.15)',
    alarm: '#4a2a2a', safe: '#3a3a50', loot: '#4a4a20',
    cover: '#2a2a35', camera: '#445', laser: '#ff1744',
    motion: '#3a3050', furniture: '#2d2d38', glass: 'rgba(150,200,255,0.12)',
    player: '#00e5ff', playerGlow: 'rgba(0,229,255,0.2)',
    guard: '#ff5252', guardSuspicious: '#ffd740', guardAlert: '#ff1744',
    guardVision: 'rgba(255,82,82,0.08)', guardVisionEdge: 'rgba(255,82,82,0.02)',
    cameraVision: 'rgba(255,215,64,0.06)',
    counter: '#2d2d3a', desk: '#2a2a34', display: '#2a2a45',
};

// ============ LEVEL DEFINITIONS ============
const LEVEL_DEFS = [
    {
        id: 0, name: 'THE CORNER SHOP', subtitle: 'Shop Robbery',
        desc: 'A quiet convenience store. Disable the alarm, grab the cash, and slip out unnoticed.',
        difficulty: 1, timeLimit: 0,
        objectives: ['Disable the alarm panel', 'Steal the cash register loot', 'Escape through any exit'],
        threats: ['1 Guard', '1 CCTV', 'Alarm System'],
        items: { lockpick: 1, smokebomb: 0, emp: 0, disguise: 0 },
        lootTarget: 500,
        map: [
            "################",
            "#..............#",
            "#.TTT..TTTT....#",
            "#..............#",
            "#.TTT..TTTT..G.#",
            "#..............#",
            "#......##DD##..#",
            "#..CCC.#....#..#",
            "#..CCC.#.S..#..#",
            "#......#.A..#.E#",
            "#......######..#",
            "#P.............#",
            "##EEDD#########E",
        ],
        guards: [
            { x: 13, y: 4, patrol: [[13,4],[13,8],[8,8],[8,4]], speed: 1.2, fov: Math.PI/2.5, range: 5 }
        ],
        cameras: [
            { x: 1, y: 1, startAngle: Math.PI*0.25, endAngle: Math.PI*0.75, speed: 0.008, range: 6 }
        ],
        lasers: [],
        motionSensors: []
    },
    {
        id: 1, name: 'ATM HEIST', subtitle: 'ATM Robbery',
        desc: 'Hack the ATM before the police patrol returns. Time is your enemy.',
        difficulty: 2, timeLimit: 90,
        objectives: ['Hack the ATM terminal', 'Collect the cash', 'Escape before time runs out'],
        threats: ['2 Guards', 'Police Patrol', 'Timer'],
        items: { lockpick: 1, smokebomb: 1, emp: 0, disguise: 0 },
        lootTarget: 1200,
        map: [
            "####################",
            "#..................#",
            "#.###..............#",
            "#.#.#....####......#",
            "#.#G#....#..#..TT..#",
            "#.###....D..D......#",
            "#........#..#......#",
            "#........####...G..#",
            "#..................#",
            "#...HH.............#",
            "#...HH........###..#",
            "#.............#S#..#",
            "#..P..........###..#",
            "#..................#",
            "E.................EE",
        ],
        guards: [
            { x: 3, y: 4, patrol: [[3,4],[3,8],[7,8],[7,4]], speed: 1.4, fov: Math.PI/2.8, range: 5 },
            { x: 17, y: 7, patrol: [[17,7],[17,12],[12,12],[12,7]], speed: 1.6, fov: Math.PI/2.5, range: 6 }
        ],
        cameras: [
            { x: 10, y: 1, startAngle: Math.PI*0.4, endAngle: Math.PI*0.9, speed: 0.01, range: 7 },
            { x: 18, y: 1, startAngle: Math.PI*0.3, endAngle: Math.PI*0.8, speed: 0.012, range: 6 }
        ],
        lasers: [],
        motionSensors: []
    },
    {
        id: 2, name: 'CENTRAL BANK', subtitle: 'Bank Heist',
        desc: 'Multi-room bank with laser grids and vault. Crack the safe and find your way out.',
        difficulty: 3, timeLimit: 0,
        objectives: ['Navigate past laser grids', 'Crack the vault safe', 'Escape with the loot'],
        threats: ['3 Guards', '2 CCTV', 'Laser Grid', 'Vault Lock'],
        items: { lockpick: 2, smokebomb: 1, emp: 1, disguise: 0 },
        lootTarget: 5000,
        map: [
            "######################",
            "#.....##.....##......#",
            "#..G..DD.....DD......#",
            "#.....##.....##..TT..#",
            "#.....##.....##......#",
            "###DD###.....########E",
            "#......#.....#LLLL#..#",
            "#......#.....D....D..#",
            "#.CCC..#.....#LLLL#..#",
            "#.CCC..##DD###....#..#",
            "#......#......#...#..#",
            "#......D......D.S.#..#",
            "#......#......#.A.#..#",
            "###DD###......#####..#",
            "#..G...............G.#",
            "#P...................#",
            "EE####################",
        ],
        guards: [
            { x: 3, y: 2, patrol: [[3,2],[3,4],[6,4],[6,2]], speed: 1.3, fov: Math.PI/2.5, range: 5 },
            { x: 3, y: 14, patrol: [[3,14],[10,14],[10,15],[3,15]], speed: 1.5, fov: Math.PI/2.8, range: 6 },
            { x: 19, y: 14, patrol: [[19,14],[19,9],[16,9],[16,14]], speed: 1.4, fov: Math.PI/2.5, range: 6 }
        ],
        cameras: [
            { x: 1, y: 6, startAngle: -Math.PI*0.2, endAngle: Math.PI*0.3, speed: 0.009, range: 6 },
            { x: 20, y: 1, startAngle: Math.PI*0.5, endAngle: Math.PI*0.9, speed: 0.01, range: 7 }
        ],
        lasers: [
            { x1: 14, y1: 6, x2: 17, y2: 6, axis: 'h', speed: 0.02, active: true },
            { x1: 14, y1: 8, x2: 17, y2: 8, axis: 'h', speed: 0.025, active: true }
        ],
        motionSensors: []
    },
    {
        id: 3, name: 'ROYAL MUSEUM', subtitle: 'Museum Robbery',
        desc: 'Priceless artifacts protected by motion sensors and guard patrols. Find the hidden passages.',
        difficulty: 4, timeLimit: 0,
        objectives: ['Bypass motion sensors', 'Steal the artifact', 'Escape through hidden passage'],
        threats: ['4 Guards', '3 CCTV', 'Motion Sensors', 'Puzzle Locks'],
        items: { lockpick: 2, smokebomb: 2, emp: 1, disguise: 1 },
        lootTarget: 15000,
        map: [
            "########################",
            "#....##........##......#",
            "#.DD.##..DDDD..##.G....#",
            "#....#...M..M...#.....E#",
            "#....D...DSSD...D......#",
            "#....#...M..M...#.....##",
            "#....##..DDDD..##......#",
            "#G...##........##..DD..#",
            "######...........#.....#",
            "#......####DD####..TT..#",
            "#..G...#........#.....##",
            "#......D..DSSD..D......#",
            "#......#..M..M..#......#",
            "#......####DD####......#",
            "#..............##..G.###",
            "#P..............D.....V#",
            "EE######################",
        ],
        guards: [
            { x: 19, y: 2, patrol: [[19,2],[19,6],[21,6],[21,2]], speed: 1.3, fov: Math.PI/2.8, range: 6 },
            { x: 1, y: 7, patrol: [[1,7],[1,10],[4,10],[4,7]], speed: 1.5, fov: Math.PI/2.5, range: 5 },
            { x: 3, y: 10, patrol: [[3,10],[3,13],[6,13],[6,10]], speed: 1.4, fov: Math.PI/2.5, range: 6 },
            { x: 19, y: 14, patrol: [[19,14],[19,10],[17,10],[17,14]], speed: 1.6, fov: Math.PI/2.8, range: 7 }
        ],
        cameras: [
            { x: 11, y: 1, startAngle: Math.PI*0.3, endAngle: Math.PI*0.7, speed: 0.008, range: 6 },
            { x: 1, y: 9, startAngle: -Math.PI*0.1, endAngle: Math.PI*0.4, speed: 0.01, range: 6 },
            { x: 22, y: 9, startAngle: Math.PI*0.6, endAngle: Math.PI*1.1, speed: 0.009, range: 7 }
        ],
        lasers: [],
        motionSensors: [
            { x: 9, y: 3, radius: 2.2 }, { x: 12, y: 3, radius: 2.2 },
            { x: 9, y: 5, radius: 2.2 }, { x: 12, y: 5, radius: 2.2 },
            { x: 10, y: 12, radius: 2.2 }, { x: 13, y: 12, radius: 2.2 }
        ]
    },
    {
        id: 4, name: 'OMEGA VAULT', subtitle: 'High-Security Vault',
        desc: 'The ultimate heist. AI guards, rotating cameras, randomized lasers, and the most secure vault ever built.',
        difficulty: 5, timeLimit: 180,
        objectives: ['Hack security mainframe', 'Navigate the laser maze', 'Crack the Omega Vault', 'Escape alive'],
        threats: ['5 AI Guards', '4 CCTV', 'Laser Maze', 'Motion Grid', 'Timer'],
        items: { lockpick: 3, smokebomb: 2, emp: 2, disguise: 1 },
        lootTarget: 50000,
        map: [
            "##########################",
            "#........##....##........#",
            "#..G.....DD....DD.....G..#",
            "#........##....##........#",
            "####DD####......####DD####",
            "#......#..LLLLLL..#......#",
            "#......D..L....L..D......#",
            "#..TT..#..L.SS.L..#..TT.#",
            "#......#..L....L..#......#",
            "#......#..LLLLLL..#......#",
            "####DD####......####DD####",
            "#........##....##........#",
            "#..G.....DD....DD.....G..#",
            "#........##.H..##........#",
            "#..MM....##....##....MM..#",
            "#........##....##........#",
            "####DD############DD#####",
            "#.........P..............#",
            "EE......................EE",
        ],
        guards: [
            { x: 3, y: 2, patrol: [[3,2],[3,3],[6,3],[6,2]], speed: 1.8, fov: Math.PI/2.2, range: 7 },
            { x: 21, y: 2, patrol: [[21,2],[21,3],[18,3],[18,2]], speed: 1.8, fov: Math.PI/2.2, range: 7 },
            { x: 3, y: 12, patrol: [[3,12],[3,15],[6,15],[6,12]], speed: 1.6, fov: Math.PI/2.5, range: 6 },
            { x: 21, y: 12, patrol: [[21,12],[21,15],[18,15],[18,12]], speed: 1.6, fov: Math.PI/2.5, range: 6 },
            { x: 12, y: 13, patrol: [[12,13],[12,16],[14,16],[14,13]], speed: 2.0, fov: Math.PI/2, range: 8 }
        ],
        cameras: [
            { x: 1, y: 1, startAngle: -Math.PI*0.1, endAngle: Math.PI*0.4, speed: 0.015, range: 7 },
            { x: 24, y: 1, startAngle: Math.PI*0.6, endAngle: Math.PI*1.1, speed: 0.013, range: 7 },
            { x: 1, y: 18, startAngle: -Math.PI*0.3, endAngle: Math.PI*0.2, speed: 0.012, range: 7 },
            { x: 24, y: 18, startAngle: Math.PI*0.8, endAngle: Math.PI*1.2, speed: 0.014, range: 7 }
        ],
        lasers: [
            { x1: 10, y1: 5, x2: 15, y2: 5, axis: 'h', speed: 0.03, active: true },
            { x1: 10, y1: 9, x2: 15, y2: 9, axis: 'h', speed: 0.025, active: true },
            { x1: 10, y1: 5, x2: 10, y2: 9, axis: 'v', speed: 0.02, active: true },
            { x1: 15, y1: 5, x2: 15, y2: 9, axis: 'v', speed: 0.028, active: true }
        ],
        motionSensors: [
            { x: 4, y: 14, radius: 2.5 }, { x: 5, y: 14, radius: 2.5 },
            { x: 20, y: 14, radius: 2.5 }, { x: 21, y: 14, radius: 2.5 }
        ]
    }
];

// ============ UTILITY FUNCTIONS ============

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2-y1, x2-x1);
}

function normalizeAngle(a) {
    while (a < -Math.PI) a += Math.PI * 2;
    while (a > Math.PI) a -= Math.PI * 2;
    return a;
}

function isAngleInRange(angle, start, end) {
    angle = normalizeAngle(angle);
    start = normalizeAngle(start);
    end = normalizeAngle(end);
    if (start <= end) return angle >= start && angle <= end;
    return angle >= start || angle <= end;
}

function lerp(a, b, t) { return a + (b - a) * t; }

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function rand(min, max) { return Math.random() * (max - min) + min; }

function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

// ============ INPUT MANAGER ============

class InputManager {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        this.mouse = { x: 0, y: 0, down: false, clicked: false };
        window.addEventListener('keydown', e => {
            if (!this.keys[e.code]) this.justPressed[e.code] = true;
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; });
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX; this.mouse.y = e.clientY;
        });
        window.addEventListener('mousedown', e => {
            this.mouse.down = true; this.mouse.clicked = true;
        });
        window.addEventListener('mouseup', () => { this.mouse.down = false; });
    }
    isDown(code) { return !!this.keys[code]; }
    wasPressed(code) { return !!this.justPressed[code]; }
    resetFrame() {
        this.justPressed = {};
        this.mouse.clicked = false;
    }
}

// ============ PARTICLE SYSTEM ============

class Particle {
    constructor(x, y, vx, vy, life, color, size) {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
        this.life = this.maxLife = life;
        this.color = color;
        this.size = size;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.vx *= 0.98; this.vy *= 0.98;
        this.life--;
        return this.life > 0;
    }
    draw(ctx, camX, camY) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha * 0.7;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x - camX, this.y - camY, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class ParticleSystem {
    constructor() { this.particles = []; }
    emit(x, y, count, color, spread, life, size) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(
                x, y,
                rand(-spread, spread), rand(-spread, spread),
                randInt(life * 0.5, life),
                color, rand(size * 0.5, size)
            ));
        }
    }
    update() {
        this.particles = this.particles.filter(p => p.update());
    }
    draw(ctx, camX, camY) {
        this.particles.forEach(p => p.draw(ctx, camX, camY));
    }
}

// ============ SOUND SYSTEM (Web Audio) ============

class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) { this.enabled = false; }
    }
    play(type) {
        if (!this.enabled || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            const now = this.ctx.currentTime;
            switch(type) {
                case 'step':
                    osc.frequency.setValueAtTime(80, now);
                    gain.gain.setValueAtTime(0.03, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                    osc.start(now); osc.stop(now + 0.08);
                    break;
                case 'alert':
                    osc.frequency.setValueAtTime(880, now);
                    osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.start(now); osc.stop(now + 0.3);
                    break;
                case 'pickup':
                    osc.frequency.setValueAtTime(523, now);
                    osc.frequency.setValueAtTime(659, now + 0.08);
                    osc.frequency.setValueAtTime(784, now + 0.16);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.start(now); osc.stop(now + 0.3);
                    break;
                case 'hack':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.linearRampToValueAtTime(800, now + 0.15);
                    gain.gain.setValueAtTime(0.06, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    osc.start(now); osc.stop(now + 0.2);
                    break;
                case 'success':
                    osc.frequency.setValueAtTime(523, now);
                    osc.frequency.setValueAtTime(659, now + 0.12);
                    osc.frequency.setValueAtTime(784, now + 0.24);
                    osc.frequency.setValueAtTime(1047, now + 0.36);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    osc.start(now); osc.stop(now + 0.5);
                    break;
                case 'fail':
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                    osc.start(now); osc.stop(now + 0.5);
                    break;
                case 'click':
                    osc.frequency.setValueAtTime(600, now);
                    gain.gain.setValueAtTime(0.05, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                    osc.start(now); osc.stop(now + 0.05);
                    break;
                case 'alarm':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.setValueAtTime(1200, now + 0.15);
                    osc.frequency.setValueAtTime(800, now + 0.3);
                    osc.frequency.setValueAtTime(1200, now + 0.45);
                    gain.gain.setValueAtTime(0.1, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                    osc.start(now); osc.stop(now + 0.6);
                    break;
            }
        } catch(e) {}
    }
}

// ============ LEVEL CLASS ============

class Level {
    constructor(def) {
        this.def = def;
        this.grid = [];
        this.width = 0;
        this.height = def.map.length;
        this.playerStart = { x: 0, y: 0 };
        this.exits = [];
        this.interactables = [];
        this.safes = [];
        this.alarms = [];
        this.hackables = [];
        this.lootItems = [];
        this.alarmDisabled = false;
        this.safesCracked = [];
        this.totalLoot = 0;
        this.parseMap();
    }

    parseMap() {
        const charMap = {
            '#': TILE_TYPES.WALL, '.': TILE_TYPES.FLOOR, 'D': TILE_TYPES.DOOR,
            'E': TILE_TYPES.EXIT, 'A': TILE_TYPES.ALARM, 'S': TILE_TYPES.SAFE,
            'L': TILE_TYPES.LASER_H, 'V': TILE_TYPES.VENT, 'T': TILE_TYPES.FURNITURE,
            'C': TILE_TYPES.COUNTER, 'M': TILE_TYPES.MOTION_SENSOR, 'G': TILE_TYPES.FLOOR,
            'P': TILE_TYPES.FLOOR, 'H': TILE_TYPES.HACKABLE,
        };

        for (let y = 0; y < this.height; y++) {
            const row = this.def.map[y];
            if (row.length > this.width) this.width = row.length;
        }

        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            const row = this.def.map[y];
            for (let x = 0; x < this.width; x++) {
                const ch = x < row.length ? row[x] : '#';
                this.grid[y][x] = charMap[ch] !== undefined ? charMap[ch] : TILE_TYPES.WALL;

                if (ch === 'P') this.playerStart = { x: x, y: y };
                if (ch === 'E') this.exits.push({ x, y });
                if (ch === 'A') this.alarms.push({ x, y, disabled: false });
                if (ch === 'S') {
                    this.safes.push({ x, y, cracked: false });
                    this.safesCracked.push(false);
                }
                if (ch === 'H') this.hackables.push({ x, y, hacked: false });
                if (ch === 'L') {
                    // Loot placed at safe locations or scattered
                }
            }
        }

        // Add loot items at safe locations
        this.safes.forEach((s, i) => {
            this.lootItems.push({
                x: s.x, y: s.y, value: Math.floor(this.def.lootTarget / Math.max(1, this.safes.length)),
                collected: false, requiresCrack: true, safeIndex: i
            });
        });
    }

    isWalkable(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
        const t = this.grid[y][x];
        return t !== TILE_TYPES.WALL && t !== TILE_TYPES.FURNITURE &&
               t !== TILE_TYPES.COUNTER && t !== TILE_TYPES.GLASS;
    }

    isWall(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return true;
        return this.grid[y][x] === TILE_TYPES.WALL;
    }

    isCover(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
        const t = this.grid[y][x];
        return t === TILE_TYPES.FURNITURE || t === TILE_TYPES.COUNTER || t === TILE_TYPES.COVER;
    }

    isExit(x, y) {
        return this.grid[y] && this.grid[y][x] === TILE_TYPES.EXIT;
    }

    getTile(x, y) {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) return TILE_TYPES.WALL;
        return this.grid[y][x];
    }

    hasLineOfSight(x1, y1, x2, y2) {
        const dx = x2 - x1, dy = y2 - y1;
        const steps = Math.max(Math.abs(dx), Math.abs(dy)) * 2;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const cx = Math.floor(x1 + dx * t);
            const cy = Math.floor(y1 + dy * t);
            if (this.isWall(cx, cy)) return false;
        }
        return true;
    }
}

// ============ PLAYER CLASS ============

class Player {
    constructor(x, y) {
        this.x = x + 0.5;
        this.y = y + 0.5;
        this.angle = 0;
        this.sneaking = false;
        this.hiding = false;
        this.noiseLevel = 0;
        this.detection = 0;
        this.moving = false;
        this.disguised = false;
        this.disguiseTimer = 0;
        this.inventory = { lockpick: 0, smokebomb: 0, emp: 0, disguise: 0 };
        this.skills = { stealth: 0, hacking: 0, disguise: 0 };
        this.lootCollected = 0;
        this.itemsUsed = 0;
        this.alertCount = 0;
    }

    update(input, level, dt) {
        let dx = 0, dy = 0;
        if (input.isDown('KeyW') || input.isDown('ArrowUp')) dy -= 1;
        if (input.isDown('KeyS') || input.isDown('ArrowDown')) dy += 1;
        if (input.isDown('KeyA') || input.isDown('ArrowLeft')) dx -= 1;
        if (input.isDown('KeyD') || input.isDown('ArrowRight')) dx += 1;

        this.sneaking = input.isDown('ShiftLeft') || input.isDown('ShiftRight');
        this.moving = dx !== 0 || dy !== 0;

        if (this.moving) {
            const len = Math.sqrt(dx*dx + dy*dy);
            dx /= len; dy /= len;
            const speed = this.sneaking ? CFG.SNEAK_SPEED : CFG.PLAYER_SPEED;
            const skillBonus = 1 + this.skills.stealth * 0.1;
            const newX = this.x + dx * speed * dt * skillBonus;
            const newY = this.y + dy * speed * dt * skillBonus;

            // Collision
            const margin = 0.2;
            if (level.isWalkable(Math.floor(newX - margin), Math.floor(this.y - margin)) &&
                level.isWalkable(Math.floor(newX + margin), Math.floor(this.y + margin)) &&
                level.isWalkable(Math.floor(newX - margin), Math.floor(this.y + margin)) &&
                level.isWalkable(Math.floor(newX + margin), Math.floor(this.y - margin))) {
                this.x = newX;
            }
            if (level.isWalkable(Math.floor(this.x - margin), Math.floor(newY - margin)) &&
                level.isWalkable(Math.floor(this.x + margin), Math.floor(newY + margin)) &&
                level.isWalkable(Math.floor(this.x - margin), Math.floor(newY + margin)) &&
                level.isWalkable(Math.floor(this.x + margin), Math.floor(newY - margin))) {
                this.y = newY;
            }

            this.angle = Math.atan2(dy, dx);
        }

        // Noise
        const stealthReduction = 1 - this.skills.stealth * 0.15;
        if (this.moving) {
            this.noiseLevel = lerp(this.noiseLevel,
                (this.sneaking ? CFG.NOISE_SNEAK : CFG.NOISE_WALK) * stealthReduction, 0.1);
        } else {
            this.noiseLevel = lerp(this.noiseLevel, 0, 0.15);
        }

        // Hiding check
        const tx = Math.floor(this.x), ty = Math.floor(this.y);
        const nearCover = level.isCover(tx-1,ty) || level.isCover(tx+1,ty) ||
                          level.isCover(tx,ty-1) || level.isCover(tx,ty+1);
        if (input.isDown('Space') && nearCover && !this.moving) {
            this.hiding = true;
        } else {
            this.hiding = false;
        }

        // Disguise timer
        if (this.disguised) {
            this.disguiseTimer--;
            if (this.disguiseTimer <= 0) this.disguised = false;
        }

        // Detection decay
        if (this.detection > 0 && !this.moving) {
            this.detection = Math.max(0, this.detection - CFG.DETECTION_DECAY * dt);
        }
    }

    useItem(slot, game) {
        const items = ['lockpick', 'smokebomb', 'emp', 'disguise'];
        const item = items[slot];
        if (!item || this.inventory[item] <= 0) return false;

        switch(item) {
            case 'smokebomb':
                this.inventory.smokebomb--;
                this.itemsUsed++;
                game.particles.emit(
                    this.x * CFG.TILE, this.y * CFG.TILE,
                    40, '#888', 3, CFG.SMOKE_DURATION, 15
                );
                game.smokeZones.push({
                    x: this.x, y: this.y,
                    radius: 3, timer: CFG.SMOKE_DURATION
                });
                game.sound.play('hack');
                return true;
            case 'emp':
                this.inventory.emp--;
                this.itemsUsed++;
                game.empActive = CFG.EMP_DURATION;
                game.particles.emit(
                    this.x * CFG.TILE, this.y * CFG.TILE,
                    30, '#00e5ff', 5, 60, 8
                );
                game.sound.play('hack');
                return true;
            case 'disguise':
                this.inventory.disguise--;
                this.itemsUsed++;
                this.disguised = true;
                this.disguiseTimer = CFG.DISGUISE_DURATION + this.skills.disguise * 100;
                game.sound.play('pickup');
                return true;
            case 'lockpick':
                // Lockpick used contextually during interaction
                return false;
        }
        return false;
    }

    draw(ctx, camX, camY) {
        const sx = this.x * CFG.TILE - camX;
        const sy = this.y * CFG.TILE - camY;
        const r = CFG.TILE * 0.35;

        // Glow
        if (!this.hiding) {
            const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
            grad.addColorStop(0, this.disguised ? 'rgba(255,215,64,0.15)' : COLORS.playerGlow);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(sx, sy, r * 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // Body
        ctx.fillStyle = this.hiding ? 'rgba(0,229,255,0.3)' :
                        this.disguised ? '#ffd740' : COLORS.player;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();

        // Direction indicator
        ctx.strokeStyle = this.hiding ? 'rgba(0,229,255,0.4)' :
                          this.disguised ? '#ffab00' : '#00b8d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(this.angle) * r * 1.5, sy + Math.sin(this.angle) * r * 1.5);
        ctx.stroke();

        // Sneaking indicator
        if (this.sneaking && this.moving) {
            ctx.strokeStyle = 'rgba(0,229,255,0.3)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(sx, sy, r + 4, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}

// ============ GUARD CLASS ============

class Guard {
    constructor(def, level) {
        this.x = def.x + 0.5;
        this.y = def.y + 0.5;
        this.angle = 0;
        this.patrol = def.patrol.map(p => ({ x: p[0] + 0.5, y: p[1] + 0.5 }));
        this.patrolIndex = 0;
        this.speed = def.speed;
        this.fov = def.fov;
        this.range = def.range;
        this.state = 'patrol'; // patrol, suspicious, alert, chase, search, returning
        this.suspicion = 0;
        this.alertTimer = 0;
        this.searchTimer = 0;
        this.lastKnownPlayerX = 0;
        this.lastKnownPlayerY = 0;
        this.level = level;
        this.stunned = false;
        this.stunTimer = 0;
        this.waitTimer = 0;
    }

    update(player, level, dt, smokeZones, empActive) {
        if (this.stunned) {
            this.stunTimer -= dt;
            if (this.stunTimer <= 0) this.stunned = false;
            return;
        }

        // Check if guard can see player
        const d = dist(this.x, this.y, player.x, player.y);
        const angleToPlayer = angleBetween(this.x, this.y, player.x, player.y);
        const angleDiff = Math.abs(normalizeAngle(angleToPlayer - this.angle));

        // Check for smoke
        const inSmoke = smokeZones.some(s => dist(this.x, this.y, s.x, s.y) < s.radius);
        const playerInSmoke = smokeZones.some(s => dist(player.x, player.y, s.x, s.y) < s.radius);

        let canSeePlayer = false;
        if (!inSmoke && !playerInSmoke && !player.hiding && d < this.range && angleDiff < this.fov / 2) {
            canSeePlayer = level.hasLineOfSight(
                Math.floor(this.x), Math.floor(this.y),
                Math.floor(player.x), Math.floor(player.y)
            );
        }

        // Disguise reduces detection
        if (canSeePlayer && player.disguised) {
            const disguiseSkill = 1 - player.skills.disguise * 0.2;
            if (d > this.range * 0.4 * disguiseSkill) canSeePlayer = false;
        }

        // Hear player noise
        const noiseRange = player.noiseLevel * 5;
        const canHear = d < noiseRange && !playerInSmoke;

        // State machine
        switch(this.state) {
            case 'patrol':
                if (canSeePlayer) {
                    this.state = 'suspicious';
                    this.suspicion = 30;
                    this.lastKnownPlayerX = player.x;
                    this.lastKnownPlayerY = player.y;
                } else if (canHear) {
                    this.state = 'suspicious';
                    this.suspicion = 15;
                    this.lastKnownPlayerX = player.x;
                    this.lastKnownPlayerY = player.y;
                } else {
                    this.doPatrol(dt);
                }
                break;

            case 'suspicious':
                if (canSeePlayer) {
                    this.suspicion += 2 * dt;
                    this.lastKnownPlayerX = player.x;
                    this.lastKnownPlayerY = player.y;
                    if (this.suspicion >= 100) {
                        this.state = 'alert';
                        this.alertTimer = 60;
                        player.alertCount++;
                    }
                } else {
                    this.suspicion -= 0.5 * dt;
                    if (this.suspicion <= 0) {
                        this.state = 'returning';
                    }
                }
                // Look toward last known position
                this.angle = lerp(this.angle, angleBetween(this.x, this.y, this.lastKnownPlayerX, this.lastKnownPlayerY), 0.05);
                break;

            case 'alert':
                if (canSeePlayer) {
                    this.lastKnownPlayerX = player.x;
                    this.lastKnownPlayerY = player.y;
                    this.state = 'chase';
                } else {
                    this.alertTimer -= dt;
                    // Move toward last known position
                    this.moveToward(this.lastKnownPlayerX, this.lastKnownPlayerY, this.speed * 1.3, level, dt);
                    if (this.alertTimer <= 0 || dist(this.x, this.y, this.lastKnownPlayerX, this.lastKnownPlayerY) < 1) {
                        this.state = 'search';
                        this.searchTimer = 180;
                    }
                }
                break;

            case 'chase':
                if (canSeePlayer) {
                    this.lastKnownPlayerX = player.x;
                    this.lastKnownPlayerY = player.y;
                    this.moveToward(player.x, player.y, CFG.GUARD_CHASE_SPEED, level, dt);
                    // Catch check
                    if (d < 0.8) {
                        return 'caught';
                    }
                } else {
                    this.state = 'alert';
                    this.alertTimer = 90;
                }
                break;

            case 'search':
                this.searchTimer -= dt;
                this.angle += 0.03 * dt;
                if (canSeePlayer) {
                    this.state = 'chase';
                    this.lastKnownPlayerX = player.x;
                    this.lastKnownPlayerY = player.y;
                }
                if (this.searchTimer <= 0) {
                    this.state = 'returning';
                }
                break;

            case 'returning':
                const target = this.patrol[this.patrolIndex];
                this.moveToward(target.x, target.y, this.speed, level, dt);
                if (dist(this.x, this.y, target.x, target.y) < 0.3) {
                    this.state = 'patrol';
                }
                if (canSeePlayer) {
                    this.state = 'suspicious';
                    this.suspicion = 30;
                }
                break;
        }

        return null;
    }

    doPatrol(dt) {
        if (this.waitTimer > 0) {
            this.waitTimer -= dt;
            // Slowly look around while waiting
            this.angle += Math.sin(this.waitTimer * 0.03) * 0.01;
            return;
        }
        const target = this.patrol[this.patrolIndex];
        const d = dist(this.x, this.y, target.x, target.y);
        if (d < 0.3) {
            this.patrolIndex = (this.patrolIndex + 1) % this.patrol.length;
            this.waitTimer = rand(30, 90);
        } else {
            this.moveToward(target.x, target.y, this.speed, this.level, dt);
        }
    }

    moveToward(tx, ty, speed, level, dt) {
        const a = angleBetween(this.x, this.y, tx, ty);
        this.angle = lerp(this.angle, a, 0.1);
        const dx = Math.cos(a) * speed * dt;
        const dy = Math.sin(a) * speed * dt;
        const margin = 0.2;
        const nx = this.x + dx, ny = this.y + dy;
        if (level.isWalkable(Math.floor(nx - margin), Math.floor(ny - margin)) &&
            level.isWalkable(Math.floor(nx + margin), Math.floor(ny + margin))) {
            this.x = nx; this.y = ny;
        }
    }

    draw(ctx, camX, camY, empActive) {
        const sx = this.x * CFG.TILE - camX;
        const sy = this.y * CFG.TILE - camY;
        const r = CFG.TILE * 0.35;

        // Vision cone
        if (!this.stunned) {
            let coneColor, coneEdge;
            switch(this.state) {
                case 'patrol': case 'returning':
                    coneColor = COLORS.guardVision; coneEdge = COLORS.guardVisionEdge; break;
                case 'suspicious':
                    coneColor = 'rgba(255,215,64,0.12)'; coneEdge = 'rgba(255,215,64,0.03)'; break;
                case 'alert': case 'chase': case 'search':
                    coneColor = 'rgba(255,23,68,0.15)'; coneEdge = 'rgba(255,23,68,0.03)'; break;
            }
            const vDist = this.range * CFG.TILE;
            const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, vDist);
            grad.addColorStop(0, coneColor);
            grad.addColorStop(1, coneEdge);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.arc(sx, sy, vDist, this.angle - this.fov/2, this.angle + this.fov/2);
            ctx.closePath();
            ctx.fill();
        }

        // Body
        let bodyColor;
        if (this.stunned) {
            bodyColor = '#666';
        } else {
            switch(this.state) {
                case 'patrol': case 'returning': bodyColor = COLORS.guard; break;
                case 'suspicious': bodyColor = COLORS.guardSuspicious; break;
                default: bodyColor = COLORS.guardAlert; break;
            }
        }

        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();

        // Direction
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(this.angle) * r * 1.4, sy + Math.sin(this.angle) * r * 1.4);
        ctx.stroke();

        // State icon
        if (!this.stunned) {
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            if (this.state === 'suspicious') ctx.fillText('?', sx, sy - r - 8);
            if (this.state === 'alert' || this.state === 'chase') ctx.fillText('!', sx, sy - r - 8);
            if (this.state === 'search') ctx.fillText('??', sx, sy - r - 8);
        }
    }
}

// ============ SECURITY CAMERA CLASS ============

class SecurityCamera {
    constructor(def) {
        this.x = def.x + 0.5;
        this.y = def.y + 0.5;
        this.startAngle = def.startAngle;
        this.endAngle = def.endAngle;
        this.speed = def.speed;
        this.range = def.range;
        this.angle = def.startAngle;
        this.direction = 1;
        this.disabled = false;
        this.disableTimer = 0;
    }

    update(dt, empActive) {
        if (empActive > 0) {
            this.disabled = true;
            this.disableTimer = 60;
        }
        if (this.disabled) {
            this.disableTimer -= dt;
            if (this.disableTimer <= 0) this.disabled = false;
            return;
        }

        this.angle += this.speed * this.direction * dt;
        if (this.angle >= this.endAngle) { this.angle = this.endAngle; this.direction = -1; }
        if (this.angle <= this.startAngle) { this.angle = this.startAngle; this.direction = 1; }
    }

    canSee(px, py, level) {
        if (this.disabled) return false;
        const d = dist(this.x, this.y, px, py);
        if (d > this.range) return false;
        const a = angleBetween(this.x, this.y, px, py);
        const diff = Math.abs(normalizeAngle(a - this.angle));
        if (diff > CFG.CAMERA_FOV / 2) return false;
        return level.hasLineOfSight(Math.floor(this.x), Math.floor(this.y), Math.floor(px), Math.floor(py));
    }

    draw(ctx, camX, camY) {
        const sx = this.x * CFG.TILE - camX;
        const sy = this.y * CFG.TILE - camY;

        // Vision cone
        if (!this.disabled) {
            const vDist = this.range * CFG.TILE;
            const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, vDist);
            grad.addColorStop(0, COLORS.cameraVision);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.arc(sx, sy, vDist, this.angle - CFG.CAMERA_FOV/2, this.angle + CFG.CAMERA_FOV/2);
            ctx.closePath();
            ctx.fill();
        }

        // Camera body
        ctx.fillStyle = this.disabled ? '#333' : '#ffd740';
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();

        // Camera direction
        if (!this.disabled) {
            ctx.strokeStyle = '#ffd740';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(this.angle) * 12, sy + Math.sin(this.angle) * 12);
            ctx.stroke();
        }
    }
}

// ============ MINI-GAMES ============

class MiniGameManager {
    constructor() {
        this.active = false;
        this.type = null;
        this.canvas = null;
        this.ctx = null;
        this.timer = 0;
        this.maxTimer = 0;
        this.success = false;
        this.failed = false;
        this.data = {};
        this.onComplete = null;
    }

    start(type, skillLevel, onComplete) {
        this.active = true;
        this.type = type;
        this.success = false;
        this.failed = false;
        this.onComplete = onComplete;
        this.canvas = document.getElementById('minigame-canvas');
        this.ctx = this.canvas.getContext('2d');

        const overlay = document.getElementById('minigame-overlay');
        overlay.style.display = 'flex';

        const title = document.getElementById('minigame-title');
        const instructions = document.getElementById('minigame-instructions');

        const timerBonus = 1 + skillLevel * 0.3;

        switch(type) {
            case 'alarm':
                title.textContent = '⚡ DISABLE ALARM';
                instructions.textContent = 'Click the wires in the correct sequence (follow the colors: Red → Yellow → Green → Blue)';
                this.maxTimer = this.timer = 600 * timerBonus;
                this.initAlarmPuzzle();
                break;
            case 'safe':
                title.textContent = '🔒 CRACK THE SAFE';
                instructions.textContent = 'Click the dial to rotate. Stop on each number when the indicator turns green.';
                this.maxTimer = this.timer = 900 * timerBonus;
                this.initSafePuzzle();
                break;
            case 'hack':
                title.textContent = '💻 HACK TERMINAL';
                instructions.textContent = 'Match the pattern: memorize and repeat the sequence by clicking the nodes.';
                this.maxTimer = this.timer = 720 * timerBonus;
                this.initHackPuzzle();
                break;
            case 'lockpick':
                title.textContent = '🔓 PICK THE LOCK';
                instructions.textContent = 'Click when the moving pin is in the green zone for each tumbler.';
                this.maxTimer = this.timer = 480 * timerBonus;
                this.initLockpickPuzzle();
                break;
        }

        // Add click handler
        this._clickHandler = (e) => this.handleClick(e);
        this.canvas.addEventListener('click', this._clickHandler);
    }

    end(success) {
        this.active = false;
        this.success = success;
        document.getElementById('minigame-overlay').style.display = 'none';
        this.canvas.removeEventListener('click', this._clickHandler);
        if (this.onComplete) this.onComplete(success);
    }

    update(dt) {
        if (!this.active) return;

        this.timer -= dt;
        const pct = Math.max(0, this.timer / this.maxTimer);
        document.getElementById('minigame-timer-fill').style.width = (pct * 100) + '%';

        if (this.timer <= 0) {
            this.end(false);
            return;
        }

        this.render();
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        switch(this.type) {
            case 'alarm': this.clickAlarm(mx, my); break;
            case 'safe': this.clickSafe(mx, my); break;
            case 'hack': this.clickHack(mx, my); break;
            case 'lockpick': this.clickLockpick(mx, my); break;
        }
    }

    // ----- ALARM PUZZLE -----
    initAlarmPuzzle() {
        const colors = ['#ff1744', '#ffd740', '#00e676', '#2979ff'];
        const labels = ['RED', 'YLW', 'GRN', 'BLU'];
        // Shuffle order of wires visually
        const order = [0,1,2,3];
        const positions = [];
        const shuffled = [...order].sort(() => Math.random() - 0.5);
        for (let i = 0; i < 4; i++) {
            positions.push({
                x: 70 + shuffled[i] * 100,
                y: 80 + Math.random() * 200,
                color: colors[shuffled[i]],
                label: labels[shuffled[i]],
                index: shuffled[i],
                cut: false,
                w: 80, h: 50
            });
        }
        this.data = { wires: positions, nextCut: 0, sequence: [0,1,2,3] };
    }

    clickAlarm(mx, my) {
        const d = this.data;
        for (const wire of d.wires) {
            if (wire.cut) continue;
            if (mx > wire.x && mx < wire.x + wire.w && my > wire.y && my < wire.y + wire.h) {
                if (wire.index === d.sequence[d.nextCut]) {
                    wire.cut = true;
                    d.nextCut++;
                    game.sound.play('click');
                    if (d.nextCut >= 4) {
                        setTimeout(() => this.end(true), 300);
                    }
                } else {
                    this.end(false);
                }
                break;
            }
        }
    }

    // ----- SAFE PUZZLE -----
    initSafePuzzle() {
        const combo = [randInt(10,90), randInt(10,90), randInt(10,90)];
        this.data = {
            combo: combo,
            currentStep: 0,
            dialAngle: 0,
            dialSpeed: 0.6,
            tolerance: 8,
            rotating: true,
        };
    }

    clickSafe(mx, my) {
        const d = this.data;
        const cx = 250, cy = 200;
        const dx = mx - cx, dy = my - cy;
        const clickDist = Math.sqrt(dx*dx + dy*dy);

        if (clickDist < 120) {
            // Check if current angle matches target
            const currentNum = Math.floor(((d.dialAngle % 360 + 360) % 360) / 3.6);
            const target = d.combo[d.currentStep];
            if (Math.abs(currentNum - target) < d.tolerance || Math.abs(currentNum - target + 100) < d.tolerance) {
                d.currentStep++;
                game.sound.play('click');
                if (d.currentStep >= 3) {
                    setTimeout(() => this.end(true), 300);
                }
            } else {
                game.sound.play('fail');
                d.currentStep = 0;
            }
        }
    }

    // ----- HACK PUZZLE -----
    initHackPuzzle() {
        const seqLen = 4;
        const nodes = [];
        for (let i = 0; i < 9; i++) {
            nodes.push({
                x: 100 + (i % 3) * 130,
                y: 70 + Math.floor(i / 3) * 110,
                r: 30, active: false
            });
        }
        const sequence = [];
        for (let i = 0; i < seqLen; i++) {
            sequence.push(randInt(0, 8));
        }
        this.data = {
            nodes, sequence,
            phase: 'show', // show, input
            showIndex: 0,
            showTimer: 0,
            inputIndex: 0,
        };
    }

    clickHack(mx, my) {
        const d = this.data;
        if (d.phase !== 'input') return;
        for (let i = 0; i < d.nodes.length; i++) {
            const n = d.nodes[i];
            if (dist(mx, my, n.x, n.y) < n.r) {
                if (i === d.sequence[d.inputIndex]) {
                    d.inputIndex++;
                    n.active = true;
                    game.sound.play('click');
                    setTimeout(() => { n.active = false; }, 200);
                    if (d.inputIndex >= d.sequence.length) {
                        setTimeout(() => this.end(true), 300);
                    }
                } else {
                    this.end(false);
                }
                break;
            }
        }
    }

    // ----- LOCKPICK PUZZLE -----
    initLockpickPuzzle() {
        const tumblers = [];
        for (let i = 0; i < 4; i++) {
            tumblers.push({
                x: 70 + i * 100,
                y: 200,
                sweetSpot: rand(0.25, 0.75),
                tolerance: 0.12,
                pinPos: 0,
                pinSpeed: 0.015 + i * 0.004,
                pinDir: 1,
                locked: true,
                w: 60,
                h: 200
            });
        }
        this.data = { tumblers, currentTumbler: 0 };
    }

    clickLockpick(mx, my) {
        const d = this.data;
        const t = d.tumblers[d.currentTumbler];
        if (!t) return;
        // Click anywhere to try to set the pin
        const diff = Math.abs(t.pinPos - t.sweetSpot);
        if (diff < t.tolerance) {
            t.locked = false;
            d.currentTumbler++;
            game.sound.play('click');
            if (d.currentTumbler >= d.tumblers.length) {
                setTimeout(() => this.end(true), 300);
            }
        } else {
            game.sound.play('fail');
            // Reset all
            d.tumblers.forEach(t => { t.locked = true; t.pinPos = 0; });
            d.currentTumbler = 0;
        }
    }

    render() {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0d0d15';
        ctx.fillRect(0, 0, W, H);

        switch(this.type) {
            case 'alarm': this.renderAlarm(ctx, W, H); break;
            case 'safe': this.renderSafe(ctx, W, H); break;
            case 'hack': this.renderHack(ctx, W, H); break;
            case 'lockpick': this.renderLockpick(ctx, W, H); break;
        }
    }

    renderAlarm(ctx, W, H) {
        const d = this.data;
        // Background panel
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, W-60, H-60);

        // Title
        ctx.fillStyle = '#888';
        ctx.font = '12px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('CUT WIRES IN ORDER: RED → YELLOW → GREEN → BLUE', W/2, 55);

        // Draw wires
        d.wires.forEach((wire, i) => {
            ctx.fillStyle = wire.cut ? '#222' : wire.color;
            ctx.globalAlpha = wire.cut ? 0.3 : (wire.index === d.sequence[d.nextCut] ? 1 : 0.7);

            // Wire line from top
            ctx.strokeStyle = wire.cut ? '#222' : wire.color;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(wire.x + wire.w/2, 30);
            ctx.lineTo(wire.x + wire.w/2, wire.y);
            ctx.stroke();

            // Wire button
            ctx.fillStyle = wire.cut ? '#1a1a1a' : wire.color;
            ctx.beginPath();
            ctx.roundRect(wire.x, wire.y, wire.w, wire.h, 6);
            ctx.fill();
            ctx.strokeStyle = wire.cut ? '#333' : '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Label
            ctx.fillStyle = wire.cut ? '#444' : '#000';
            ctx.font = 'bold 14px "Orbitron"';
            ctx.textAlign = 'center';
            ctx.fillText(wire.label, wire.x + wire.w/2, wire.y + wire.h/2 + 5);

            if (wire.cut) {
                ctx.strokeStyle = '#ff1744';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(wire.x + 5, wire.y + 5);
                ctx.lineTo(wire.x + wire.w - 5, wire.y + wire.h - 5);
                ctx.moveTo(wire.x + wire.w - 5, wire.y + 5);
                ctx.lineTo(wire.x + 5, wire.y + wire.h - 5);
                ctx.stroke();
            }

            ctx.globalAlpha = 1;
        });

        // Progress
        ctx.fillStyle = '#00e5ff';
        ctx.font = '14px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(`Progress: ${d.nextCut}/4`, W/2, H - 40);
    }

    renderSafe(ctx, W, H) {
        const d = this.data;
        const cx = 250, cy = 200, r = 100;

        // Update dial
        d.dialAngle += d.dialSpeed;
        const currentNum = Math.floor(((d.dialAngle % 360 + 360) % 360) / 3.6);

        // Dial background
        ctx.strokeStyle = '#3a3a4e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Tick marks
        for (let i = 0; i < 100; i++) {
            const a = (i / 100) * Math.PI * 2 - Math.PI / 2;
            const len = i % 10 === 0 ? 15 : i % 5 === 0 ? 10 : 5;
            ctx.strokeStyle = i % 10 === 0 ? '#888' : '#444';
            ctx.lineWidth = i % 10 === 0 ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * (r - len), cy + Math.sin(a) * (r - len));
            ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
            ctx.stroke();

            if (i % 10 === 0) {
                ctx.fillStyle = '#888';
                ctx.font = '10px "Share Tech Mono"';
                ctx.textAlign = 'center';
                ctx.fillText(i, cx + Math.cos(a) * (r + 15), cy + Math.sin(a) * (r + 15) + 3);
            }
        }

        // Current position indicator
        const posAngle = (d.dialAngle / 360) * Math.PI * 2 - Math.PI / 2;
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(posAngle) * (r - 20), cy + Math.sin(posAngle) * (r - 20));
        ctx.stroke();

        // Check proximity to target
        if (d.currentStep < 3) {
            const target = d.combo[d.currentStep];
            const diff = Math.abs(currentNum - target);
            const close = diff < d.tolerance || Math.abs(diff - 100) < d.tolerance;

            // Target indicator
            ctx.fillStyle = close ? '#00e676' : '#ff1744';
            ctx.beginPath();
            ctx.arc(cx, cy - r - 25, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Display combo progress
        ctx.fillStyle = '#888';
        ctx.font = '14px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('COMBINATION:', cx, 40);

        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = i < d.currentStep ? '#00e676' : i === d.currentStep ? '#00e5ff' : '#444';
            ctx.font = 'bold 20px "Orbitron"';
            ctx.fillText(i < d.currentStep ? '✓' : '??', cx - 50 + i * 50, 70);
        }

        ctx.fillStyle = '#555';
        ctx.font = '12px "Share Tech Mono"';
        ctx.fillText('Click when the indicator turns GREEN', cx, H - 30);
        ctx.fillText(`Current: ${currentNum}`, cx, H - 50);
    }

    renderHack(ctx, W, H) {
        const d = this.data;

        // Show phase
        if (d.phase === 'show') {
            d.showTimer++;
            const showDuration = 40;
            const idx = Math.floor(d.showTimer / showDuration);
            if (idx >= d.sequence.length) {
                d.phase = 'input';
                d.nodes.forEach(n => n.active = false);
            } else {
                d.nodes.forEach((n, i) => {
                    n.active = (i === d.sequence[idx]);
                });
            }
        }

        // Draw nodes
        d.nodes.forEach((n, i) => {
            ctx.fillStyle = n.active ? '#00e5ff' : '#2a2a3a';
            ctx.strokeStyle = n.active ? '#00e5ff' : '#444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            if (n.active) {
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = n.active ? '#000' : '#666';
            ctx.font = 'bold 16px "Orbitron"';
            ctx.textAlign = 'center';
            ctx.fillText(i + 1, n.x, n.y + 6);
        });

        // Status
        ctx.fillStyle = d.phase === 'show' ? '#ffd740' : '#00e5ff';
        ctx.font = '14px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(d.phase === 'show' ? 'MEMORIZE THE SEQUENCE...' : `Input: ${d.inputIndex}/${d.sequence.length}`, W/2, H - 20);
    }

    renderLockpick(ctx, W, H) {
        const d = this.data;

        // Update pin positions
        d.tumblers.forEach((t, i) => {
            if (t.locked && i === d.currentTumbler) {
                t.pinPos += t.pinSpeed * t.pinDir;
                if (t.pinPos >= 1) { t.pinPos = 1; t.pinDir = -1; }
                if (t.pinPos <= 0) { t.pinPos = 0; t.pinDir = 1; }
            }
        });

        // Draw tumblers
        d.tumblers.forEach((t, i) => {
            const isCurrent = i === d.currentTumbler;

            // Track
            ctx.fillStyle = '#1a1a24';
            ctx.strokeStyle = isCurrent ? '#00e5ff' : '#333';
            ctx.lineWidth = isCurrent ? 2 : 1;
            ctx.beginPath();
            ctx.roundRect(t.x, t.y - t.h/2, t.w, t.h, 4);
            ctx.fill();
            ctx.stroke();

            // Sweet spot zone
            const ssY = t.y - t.h/2 + (1 - t.sweetSpot) * t.h;
            const ssH = t.tolerance * t.h * 2;
            ctx.fillStyle = 'rgba(0, 230, 118, 0.2)';
            ctx.fillRect(t.x + 2, ssY - ssH/2, t.w - 4, ssH);

            // Pin
            if (t.locked) {
                const pinY = t.y - t.h/2 + (1 - t.pinPos) * t.h;
                const diff = Math.abs(t.pinPos - t.sweetSpot);
                const inZone = diff < t.tolerance;
                ctx.fillStyle = inZone ? '#00e676' : '#ff5252';
                ctx.beginPath();
                ctx.roundRect(t.x + 5, pinY - 8, t.w - 10, 16, 3);
                ctx.fill();
            } else {
                // Unlocked indicator
                ctx.fillStyle = '#00e676';
                ctx.font = 'bold 20px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('✓', t.x + t.w/2, t.y + 6);
            }

            // Label
            ctx.fillStyle = '#666';
            ctx.font = '10px "Share Tech Mono"';
            ctx.textAlign = 'center';
            ctx.fillText(`PIN ${i+1}`, t.x + t.w/2, t.y + t.h/2 + 20);
        });

        ctx.fillStyle = '#888';
        ctx.font = '13px "Share Tech Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('Click when the pin is in the GREEN zone', W/2, H - 20);
    }
}

// ============ MAIN GAME CLASS ============

class Game {
    constructor() {
        this.state = 'intro'; // intro, title, levelSelect, howToPlay, skills, playing, paused, minigame, complete, gameover
        this.currentLevel = 0;
        this.maxUnlocked = 0;
        this.skillPoints = 3;
        this.playerSkills = { stealth: 0, hacking: 0, disguise: 0 };

        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputManager();
        this.particles = new ParticleSystem();
        this.sound = new SoundSystem();
        this.miniGame = new MiniGameManager();

        this.level = null;
        this.player = null;
        this.guards = [];
        this.cameras = [];
        this.smokeZones = [];
        this.empActive = 0;
        this.camX = 0;
        this.camY = 0;
        this.levelTime = 0;
        this.timeRemaining = 0;
        this.gameMessage = '';
        this.messageTimer = 0;

        // Laser animation
        this.laserPhase = 0;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Start intro
        this.playIntro();

        // Load saves
        this.loadProgress();

        // Game loop
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    loadProgress() {
        try {
            const save = localStorage.getItem('mastermindThief');
            if (save) {
                const data = JSON.parse(save);
                this.maxUnlocked = data.maxUnlocked || 0;
                this.skillPoints = data.skillPoints || 3;
                this.playerSkills = data.playerSkills || { stealth: 0, hacking: 0, disguise: 0 };
            }
        } catch(e) {}
    }

    saveProgress() {
        try {
            localStorage.setItem('mastermindThief', JSON.stringify({
                maxUnlocked: this.maxUnlocked,
                skillPoints: this.skillPoints,
                playerSkills: this.playerSkills
            }));
        } catch(e) {}
    }

    // ============ INTRO ============

    playIntro() {
        const logoCanvas = document.getElementById('logo-canvas');
        const logoCtx = logoCanvas.getContext('2d');
        const W = logoCanvas.width, H = logoCanvas.height;

        let frame = 0;
        const drawLogo = () => {
            frame++;
            logoCtx.clearRect(0, 0, W, H);

            // Background glow
            const grd = logoCtx.createRadialGradient(W/2, H/2 - 30, 0, W/2, H/2, 250);
            grd.addColorStop(0, `rgba(0,229,255,${Math.min(frame/60, 0.08)})`);
            grd.addColorStop(1, 'transparent');
            logoCtx.fillStyle = grd;
            logoCtx.fillRect(0, 0, W, H);

            // Diamond icon
            const iconAlpha = clamp((frame - 20) / 30, 0, 1);
            logoCtx.globalAlpha = iconAlpha;
            logoCtx.save();
            logoCtx.translate(W/2, 100);
            logoCtx.rotate(Math.PI/4);
            const s = 30 * iconAlpha;
            logoCtx.strokeStyle = '#00e5ff';
            logoCtx.lineWidth = 2;
            logoCtx.strokeRect(-s, -s, s*2, s*2);
            logoCtx.restore();

            // Mask silhouette in diamond
            logoCtx.fillStyle = '#00e5ff';
            logoCtx.beginPath();
            logoCtx.ellipse(W/2, 95, 12 * iconAlpha, 8 * iconAlpha, 0, 0, Math.PI * 2);
            logoCtx.fill();
            logoCtx.fillStyle = '#000';
            logoCtx.beginPath();
            logoCtx.ellipse(W/2, 95, 10 * iconAlpha, 6 * iconAlpha, 0, 0, Math.PI * 2);
            logoCtx.fill();
            logoCtx.fillStyle = '#00e5ff';
            logoCtx.beginPath();
            logoCtx.ellipse(W/2 - 5, 93, 2 * iconAlpha, 2 * iconAlpha, 0, 0, Math.PI * 2);
            logoCtx.fill();
            logoCtx.beginPath();
            logoCtx.ellipse(W/2 + 5, 93, 2 * iconAlpha, 2 * iconAlpha, 0, 0, Math.PI * 2);
            logoCtx.fill();

            // "THARUN" text
            const titleAlpha = clamp((frame - 40) / 40, 0, 1);
            logoCtx.globalAlpha = titleAlpha;
            logoCtx.fillStyle = '#e0e0e0';
            logoCtx.font = 'bold 52px "Orbitron"';
            logoCtx.textAlign = 'center';
            logoCtx.textBaseline = 'middle';

            // Glitch effect
            if (frame > 40 && frame < 80 && Math.random() < 0.15) {
                const offset = randInt(-3, 3);
                logoCtx.fillStyle = '#ff1744';
                logoCtx.fillText('THARUN', W/2 + offset, 200 + offset);
                logoCtx.fillStyle = '#00e5ff';
                logoCtx.fillText('THARUN', W/2 - offset, 200 - offset);
            }
            logoCtx.fillStyle = '#e0e0e0';
            logoCtx.fillText('THARUN', W/2, 200);

            // Cyan glow on text
            logoCtx.shadowColor = '#00e5ff';
            logoCtx.shadowBlur = 20 * titleAlpha;
            logoCtx.fillText('THARUN', W/2, 200);
            logoCtx.shadowBlur = 0;

            // "& TEAM" text
            const teamAlpha = clamp((frame - 70) / 30, 0, 1);
            logoCtx.globalAlpha = teamAlpha;
            logoCtx.fillStyle = '#888';
            logoCtx.font = '300 22px "Rajdhani"';
            logoCtx.letterSpacing = '8px';
            logoCtx.fillText('& T E A M', W/2, 255);

            // Decorative line
            const lineAlpha = clamp((frame - 90) / 20, 0, 1);
            logoCtx.globalAlpha = lineAlpha;
            const lineW = 200 * lineAlpha;
            logoCtx.strokeStyle = 'rgba(0,229,255,0.4)';
            logoCtx.lineWidth = 1;
            logoCtx.beginPath();
            logoCtx.moveTo(W/2 - lineW/2, 280);
            logoCtx.lineTo(W/2 + lineW/2, 280);
            logoCtx.stroke();

            // Particle sparkles
            if (frame > 60) {
                for (let i = 0; i < 3; i++) {
                    const px = W/2 + rand(-150, 150);
                    const py = 200 + rand(-60, 60);
                    const sparkAlpha = Math.random() * 0.5;
                    logoCtx.globalAlpha = sparkAlpha;
                    logoCtx.fillStyle = '#00e5ff';
                    logoCtx.beginPath();
                    logoCtx.arc(px, py, rand(1, 2.5), 0, Math.PI * 2);
                    logoCtx.fill();
                }
            }

            logoCtx.globalAlpha = 1;

            if (frame < 200) {
                requestAnimationFrame(drawLogo);
            }
        };
        drawLogo();

        // Auto-transition to title after 3.5 seconds
        setTimeout(() => {
            this.showTitle();
        }, 3500);
    }

    // ============ SCREEN MANAGEMENT ============

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    showTitle() {
        this.state = 'title';
        this.showScreen('title-screen');
        this.sound.init();
    }

    showLevelSelect() {
        this.state = 'levelSelect';
        this.showScreen('level-select-screen');
        this.buildLevelCards();
        this.sound.play('click');
    }

    showHowToPlay() {
        this.state = 'howToPlay';
        this.showScreen('howtoplay-screen');
        this.sound.play('click');
    }

    showSkillsMenu() {
        this.state = 'skills';
        this.showScreen('skills-screen');
        this.buildSkillsUI();
        this.sound.play('click');
    }

    // ============ LEVEL CARDS ============

    buildLevelCards() {
        const container = document.getElementById('level-cards');
        container.innerHTML = '';

        LEVEL_DEFS.forEach((def, i) => {
            const card = document.createElement('div');
            card.className = 'level-card' + (i > this.maxUnlocked ? ' locked' : '');
            card.innerHTML = `
                <div class="level-card-header">
                    <div class="level-number">MISSION ${i + 1}</div>
                    <div class="level-name">${def.name}</div>
                    <div class="level-difficulty">
                        ${[1,2,3,4,5].map(d => `<div class="diff-dot${d <= def.difficulty ? ' active' : ''}"></div>`).join('')}
                    </div>
                </div>
                <div class="level-card-body">
                    <div class="level-desc">${def.desc}</div>
                    <div class="level-threats">
                        ${def.threats.map(t => `<span class="threat-tag">${t}</span>`).join('')}
                    </div>
                </div>
            `;
            if (i <= this.maxUnlocked) {
                card.addEventListener('click', () => {
                    this.currentLevel = i;
                    this.startLevel(i);
                    this.sound.play('click');
                });
            }
            container.appendChild(card);
        });
    }

    // ============ SKILLS UI ============

    buildSkillsUI() {
        document.getElementById('skill-points-value').textContent = this.skillPoints;
        const grid = document.getElementById('skills-grid');
        grid.innerHTML = '';

        const skills = [
            { key: 'stealth', icon: '👁️', name: 'STEALTH', desc: 'Move quieter and harder to detect. Increases sneak speed and reduces noise.', maxLevel: 5 },
            { key: 'hacking', icon: '💻', name: 'HACKING', desc: 'Faster mini-game timers and easier puzzles. Reduces hack difficulty.', maxLevel: 5 },
            { key: 'disguise', icon: '🎭', name: 'DISGUISE', desc: 'Disguises last longer and are more effective at fooling guards.', maxLevel: 5 },
        ];

        skills.forEach(skill => {
            const level = this.playerSkills[skill.key];
            const card = document.createElement('div');
            card.className = 'skill-card';
            card.innerHTML = `
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-name">${skill.name}</div>
                <div class="skill-desc">${skill.desc}</div>
                <div class="skill-level">
                    ${Array(skill.maxLevel).fill(0).map((_, i) =>
                        `<div class="skill-pip${i < level ? ' filled' : ''}"></div>`
                    ).join('')}
                </div>
                <button class="skill-upgrade-btn" ${level >= skill.maxLevel || this.skillPoints <= 0 ? 'disabled' : ''}
                    onclick="game.upgradeSkill('${skill.key}')">
                    ${level >= skill.maxLevel ? 'MAXED' : `UPGRADE (1 PT)`}
                </button>
            `;
            grid.appendChild(card);
        });
    }

    upgradeSkill(key) {
        if (this.skillPoints > 0 && this.playerSkills[key] < 5) {
            this.playerSkills[key]++;
            this.skillPoints--;
            this.sound.play('pickup');
            this.saveProgress();
            this.buildSkillsUI();
        }
    }

    // ============ GAME START ============

    startNewGame() {
        this.currentLevel = 0;
        this.startLevel(0);
        this.sound.play('click');
    }

    startLevel(levelIndex) {
        const def = LEVEL_DEFS[levelIndex];
        this.level = new Level(def);
        this.player = new Player(this.level.playerStart.x, this.level.playerStart.y);
        this.player.skills = { ...this.playerSkills };
        Object.assign(this.player.inventory, def.items);

        // Create guards
        this.guards = def.guards.map(g => new Guard(g, this.level));

        // Create cameras
        this.cameras = def.cameras.map(c => new SecurityCamera(c));

        // Reset state
        this.smokeZones = [];
        this.empActive = 0;
        this.levelTime = 0;
        this.timeRemaining = def.timeLimit > 0 ? def.timeLimit * 60 : 0; // Convert to frames
        this.laserPhase = 0;
        this.gameMessage = '';
        this.messageTimer = 0;

        // Update HUD
        document.getElementById('hud-level-name').textContent = `MISSION ${levelIndex + 1}: ${def.name}`;
        document.getElementById('hud-objective').textContent = def.objectives[0];
        const timerEl = document.getElementById('hud-timer');
        if (def.timeLimit > 0) {
            timerEl.style.display = 'flex';
        } else {
            timerEl.style.display = 'none';
        }

        this.updateInventoryUI();

        this.state = 'playing';
        this.showScreen('game-screen');

        this.showMessage(def.name);
    }

    // ============ GAME LOOP ============

    gameLoop(now) {
        const dt = Math.min((now - this.lastTime) / (1000 / CFG.FPS), 3);
        this.lastTime = now;

        if (this.state === 'playing') {
            this.updateGame(dt);
            this.renderGame();
        }
        if (this.miniGame.active) {
            this.miniGame.update(dt);
        }

        this.input.resetFrame();
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // ============ GAME UPDATE ============

    updateGame(dt) {
        if (this.state !== 'playing') return;

        // Pause check
        if (this.input.wasPressed('Escape')) {
            this.pauseGame();
            return;
        }

        // Don't update during minigame
        if (this.miniGame.active) return;

        this.levelTime += dt;

        // Timer
        if (this.timeRemaining > 0) {
            this.timeRemaining -= dt;
            this.updateTimerUI();
            if (this.timeRemaining <= 0) {
                this.gameOver('Time ran out!');
                return;
            }
        }

        // Player update
        this.player.update(this.input, this.level, dt);

        // Item use (1-4)
        for (let i = 0; i < 4; i++) {
            if (this.input.wasPressed('Digit' + (i+1))) {
                this.player.useItem(i, this);
            }
        }

        // Interaction check
        this.checkInteraction();

        // Guard updates
        for (const guard of this.guards) {
            const result = guard.update(this.player, this.level, dt, this.smokeZones, this.empActive);
            if (result === 'caught') {
                this.gameOver('Caught by a guard!');
                return;
            }
        }

        // Camera updates
        for (const cam of this.cameras) {
            cam.update(dt, this.empActive);
            if (cam.canSee(this.player.x, this.player.y, this.level) && !this.player.hiding) {
                this.player.detection += CFG.DETECTION_RATE * dt * 0.5;
                if (this.player.detection >= 100) {
                    this.gameOver('Spotted by security camera!');
                    return;
                }
            }
        }

        // Laser check
        this.laserPhase += 0.02 * dt;
        if (this.empActive <= 0) {
            for (const laser of this.level.def.lasers) {
                if (this.isPlayerInLaser(laser)) {
                    this.gameOver('Hit by a laser trap!');
                    return;
                }
            }
        }

        // Motion sensor check
        if (this.empActive <= 0) {
            for (const ms of this.level.def.motionSensors) {
                const d = dist(this.player.x, this.player.y, ms.x + 0.5, ms.y + 0.5);
                if (d < ms.radius && this.player.moving && !this.player.sneaking) {
                    this.player.detection += CFG.DETECTION_RATE * dt * 2;
                    if (this.player.detection >= 100) {
                        this.gameOver('Triggered motion sensor!');
                        return;
                    }
                }
            }
        }

        // Guard detection of player through noise/proximity
        for (const guard of this.guards) {
            if (guard.state === 'alert' || guard.state === 'chase') {
                this.player.detection = Math.min(100, this.player.detection + CFG.DETECTION_RATE * dt);
            }
            if (guard.state === 'suspicious') {
                this.player.detection = Math.min(100, this.player.detection + CFG.DETECTION_RATE * dt * 0.3);
            }
        }

        // Smoke zone decay
        this.smokeZones = this.smokeZones.filter(s => {
            s.timer -= dt;
            return s.timer > 0;
        });

        // EMP decay
        if (this.empActive > 0) this.empActive -= dt;

        // Particles
        this.particles.update();

        // Exit check
        const px = Math.floor(this.player.x), py = Math.floor(this.player.y);
        if (this.level.isExit(px, py) && this.player.lootCollected > 0) {
            // Check if objectives met (alarm disabled, safe cracked)
            const allSafesCracked = this.level.safes.every(s => s.cracked);
            if (allSafesCracked || this.player.lootCollected > 0) {
                this.levelComplete();
                return;
            }
        }

        // Update HUD
        this.updateHUD();

        // Camera follow
        const targetCamX = this.player.x * CFG.TILE - this.canvas.width / 2;
        const targetCamY = this.player.y * CFG.TILE - this.canvas.height / 2;
        this.camX = lerp(this.camX, targetCamX, 0.08);
        this.camY = lerp(this.camY, targetCamY, 0.08);

        // Message timer
        if (this.messageTimer > 0) {
            this.messageTimer -= dt;
            if (this.messageTimer <= 0) {
                document.getElementById('game-message').style.display = 'none';
            }
        }
    }

    isPlayerInLaser(laser) {
        const px = this.player.x, py = this.player.y;
        // Animated laser with gaps
        const phase = this.laserPhase * laser.speed * 100;
        if (laser.axis === 'h') {
            if (Math.abs(py - laser.y1 - 0.5) < 0.4) {
                if (px >= laser.x1 && px <= laser.x2) {
                    // Create gaps in laser
                    const segPos = (px - laser.x1) + phase;
                    return Math.sin(segPos * 2) > 0;
                }
            }
        } else {
            if (Math.abs(px - laser.x1 - 0.5) < 0.4) {
                if (py >= laser.y1 && py <= laser.y2) {
                    const segPos = (py - laser.y1) + phase;
                    return Math.sin(segPos * 2) > 0;
                }
            }
        }
        return false;
    }

    // ============ INTERACTION ============

    checkInteraction() {
        const px = Math.floor(this.player.x), py = Math.floor(this.player.y);
        let interactable = null;
        let action = '';

        // Check adjacent tiles
        const checkTiles = [[px,py],[px-1,py],[px+1,py],[px,py-1],[px,py+1]];
        for (const [cx, cy] of checkTiles) {
            const tile = this.level.getTile(cx, cy);
            switch(tile) {
                case TILE_TYPES.ALARM:
                    const alarm = this.level.alarms.find(a => a.x === cx && a.y === cy);
                    if (alarm && !alarm.disabled) {
                        interactable = { type: 'alarm', x: cx, y: cy, alarm };
                        action = 'disable alarm';
                    }
                    break;
                case TILE_TYPES.SAFE:
                    const safe = this.level.safes.find(s => s.x === cx && s.y === cy);
                    if (safe && !safe.cracked) {
                        interactable = { type: 'safe', x: cx, y: cy, safe };
                        action = 'crack safe';
                    }
                    break;
                case TILE_TYPES.DOOR:
                    if (cx !== px || cy !== py) {
                        interactable = { type: 'door', x: cx, y: cy };
                        action = 'open door';
                    }
                    break;
                case TILE_TYPES.HACKABLE:
                    const hack = this.level.hackables.find(h => h.x === cx && h.y === cy);
                    if (hack && !hack.hacked) {
                        interactable = { type: 'hack', x: cx, y: cy, hack };
                        action = 'hack terminal';
                    }
                    break;
                case TILE_TYPES.VENT:
                    interactable = { type: 'vent', x: cx, y: cy };
                    action = 'enter vent';
                    break;
            }
            if (interactable) break;
        }

        // Check for loot
        if (!interactable) {
            for (const loot of this.level.lootItems) {
                if (!loot.collected) {
                    if (Math.abs(this.player.x - loot.x - 0.5) < 1 && Math.abs(this.player.y - loot.y - 0.5) < 1) {
                        if (loot.requiresCrack) {
                            const safe = this.level.safes[loot.safeIndex];
                            if (safe && safe.cracked) {
                                interactable = { type: 'loot', loot };
                                action = `collect $${loot.value}`;
                            }
                        } else {
                            interactable = { type: 'loot', loot };
                            action = `collect $${loot.value}`;
                        }
                    }
                }
            }
        }

        // Show/hide prompt
        const prompt = document.getElementById('interact-prompt');
        if (interactable) {
            prompt.style.display = 'block';
            document.getElementById('interact-action').textContent = action;

            if (this.input.wasPressed('KeyE')) {
                this.doInteraction(interactable);
            }
        } else {
            prompt.style.display = 'none';
        }
    }

    doInteraction(interactable) {
        switch(interactable.type) {
            case 'alarm':
                this.miniGame.start('alarm', this.player.skills.hacking, (success) => {
                    if (success) {
                        interactable.alarm.disabled = true;
                        this.level.alarmDisabled = true;
                        this.showMessage('ALARM DISABLED');
                        this.sound.play('success');
                        // Update objective
                        this.updateObjective();
                    } else {
                        this.showMessage('HACK FAILED');
                        this.sound.play('fail');
                        // Alert nearby guards
                        this.alertNearbyGuards(interactable.x, interactable.y, 5);
                    }
                });
                break;
            case 'safe':
                this.miniGame.start('safe', this.player.skills.hacking, (success) => {
                    if (success) {
                        interactable.safe.cracked = true;
                        this.showMessage('SAFE CRACKED');
                        this.sound.play('success');
                        this.updateObjective();
                    } else {
                        this.showMessage('CRACKING FAILED');
                        this.sound.play('fail');
                        this.alertNearbyGuards(interactable.x, interactable.y, 4);
                    }
                });
                break;
            case 'hack':
                this.miniGame.start('hack', this.player.skills.hacking, (success) => {
                    if (success) {
                        interactable.hack.hacked = true;
                        this.showMessage('TERMINAL HACKED');
                        this.sound.play('success');
                        // Disable nearby security
                        this.cameras.forEach(c => { c.disabled = true; c.disableTimer = 600; });
                        this.updateObjective();
                    } else {
                        this.showMessage('HACK FAILED');
                        this.sound.play('fail');
                        this.alertNearbyGuards(interactable.x, interactable.y, 6);
                    }
                });
                break;
            case 'door':
                const tile = this.level.getTile(interactable.x, interactable.y);
                if (tile === TILE_TYPES.DOOR) {
                    this.level.grid[interactable.y][interactable.x] = TILE_TYPES.FLOOR;
                    this.sound.play('click');
                } else if (tile === TILE_TYPES.DOOR_LOCKED) {
                    if (this.player.inventory.lockpick > 0) {
                        this.miniGame.start('lockpick', this.player.skills.hacking, (success) => {
                            if (success) {
                                this.level.grid[interactable.y][interactable.x] = TILE_TYPES.FLOOR;
                                this.player.inventory.lockpick--;
                                this.player.itemsUsed++;
                                this.updateInventoryUI();
                                this.showMessage('DOOR UNLOCKED');
                                this.sound.play('success');
                            } else {
                                this.showMessage('LOCKPICK BROKE');
                                this.player.inventory.lockpick--;
                                this.player.itemsUsed++;
                                this.updateInventoryUI();
                                this.sound.play('fail');
                            }
                        });
                    } else {
                        this.showMessage('NEED LOCKPICK');
                    }
                }
                break;
            case 'vent':
                // Find another vent to teleport to
                const vents = [];
                for (let y = 0; y < this.level.height; y++) {
                    for (let x = 0; x < this.level.width; x++) {
                        if (this.level.getTile(x, y) === TILE_TYPES.VENT &&
                            (x !== interactable.x || y !== interactable.y)) {
                            vents.push({x, y});
                        }
                    }
                }
                if (vents.length > 0) {
                    const target = vents[randInt(0, vents.length - 1)];
                    this.player.x = target.x + 0.5;
                    this.player.y = target.y + 0.5;
                    this.showMessage('USED VENT');
                    this.sound.play('hack');
                    this.particles.emit(this.player.x * CFG.TILE, this.player.y * CFG.TILE, 15, '#556', 2, 30, 5);
                }
                break;
            case 'loot':
                interactable.loot.collected = true;
                this.player.lootCollected += interactable.loot.value;
                this.showMessage(`+$${interactable.loot.value}`);
                this.sound.play('pickup');
                this.particles.emit(
                    interactable.loot.x * CFG.TILE + CFG.TILE/2,
                    interactable.loot.y * CFG.TILE + CFG.TILE/2,
                    10, '#ffd740', 2, 30, 4
                );
                this.updateObjective();
                break;
        }
    }

    alertNearbyGuards(x, y, radius) {
        this.guards.forEach(g => {
            if (dist(g.x, g.y, x, y) < radius) {
                g.state = 'suspicious';
                g.suspicion = 60;
                g.lastKnownPlayerX = x;
                g.lastKnownPlayerY = y;
            }
        });
    }

    updateObjective() {
        const def = this.level.def;
        let obj = def.objectives[0];
        if (this.level.alarmDisabled) obj = def.objectives[Math.min(1, def.objectives.length-1)];
        const allSafesCracked = this.level.safes.every(s => s.cracked);
        if (allSafesCracked && this.player.lootCollected > 0) {
            obj = def.objectives[def.objectives.length - 1];
        } else if (this.player.lootCollected > 0) {
            obj = 'Escape through any exit!';
        }
        document.getElementById('hud-objective').textContent = obj;
    }

    // ============ HUD UPDATES ============

    updateHUD() {
        // Detection meter
        document.getElementById('detection-fill').style.width = this.player.detection + '%';

        // Noise meter
        document.getElementById('noise-fill').style.width = (this.player.noiseLevel * 100) + '%';

        // Alert status
        const alertEl = document.getElementById('hud-alert-status');
        const alertText = document.getElementById('alert-text');
        const alertIcon = document.getElementById('alert-icon');

        const anyAlert = this.guards.some(g => g.state === 'alert' || g.state === 'chase');
        const anySuspicious = this.guards.some(g => g.state === 'suspicious');
        const cameraDetect = this.cameras.some(c => c.canSee(this.player.x, this.player.y, this.level));

        alertEl.className = '';
        if (anyAlert) {
            alertEl.className = 'alert';
            alertText.textContent = 'DETECTED';
            alertIcon.textContent = '🚨';
        } else if (anySuspicious || cameraDetect) {
            alertEl.className = 'suspicious';
            alertText.textContent = 'SUSPICIOUS';
            alertIcon.textContent = '⚠️';
        } else if (this.player.hiding) {
            alertText.textContent = 'HIDING';
            alertIcon.textContent = '🫥';
        } else if (this.player.sneaking) {
            alertText.textContent = 'SNEAKING';
            alertIcon.textContent = '🤫';
        } else {
            alertText.textContent = 'HIDDEN';
            alertIcon.textContent = '👁';
        }

        // Update inventory UI
        this.updateInventoryUI();
    }

    updateTimerUI() {
        const seconds = Math.ceil(this.timeRemaining / 60);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timerEl = document.getElementById('hud-timer');
        document.getElementById('timer-value').textContent =
            `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        if (seconds <= 30) {
            timerEl.className = 'warning';
        } else {
            timerEl.className = '';
        }
    }

    updateInventoryUI() {
        if (!this.player) return;
        const items = [
            { key: 'lockpick', icon: '🔓', name: 'Lockpick' },
            { key: 'smokebomb', icon: '💨', name: 'Smoke' },
            { key: 'emp', icon: '⚡', name: 'EMP' },
            { key: 'disguise', icon: '🎭', name: 'Disguise' }
        ];
        items.forEach((item, i) => {
            const slot = document.getElementById(`inv-slot-${i+1}`);
            const count = this.player.inventory[item.key];
            slot.querySelector('.inv-icon').textContent = item.icon;
            slot.querySelector('.inv-count').textContent = count > 0 ? `x${count}` : '';
            slot.classList.toggle('empty', count <= 0);
        });
    }

    showMessage(text) {
        const el = document.getElementById('game-message');
        document.getElementById('message-content').textContent = text;
        el.style.display = 'block';
        this.messageTimer = 120;
    }

    // ============ GAME RENDERING ============

    renderGame() {
        const ctx = this.ctx;
        const W = this.canvas.width, H = this.canvas.height;

        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, W, H);

        if (!this.level) return;

        const T = CFG.TILE;
        const camX = this.camX, camY = this.camY;

        // Calculate visible tile range
        const startCol = Math.max(0, Math.floor(camX / T));
        const endCol = Math.min(this.level.width, Math.ceil((camX + W) / T));
        const startRow = Math.max(0, Math.floor(camY / T));
        const endRow = Math.min(this.level.height, Math.ceil((camY + H) / T));

        // ---- DRAW TILES ----
        for (let y = startRow; y < endRow; y++) {
            for (let x = startCol; x < endCol; x++) {
                const sx = x * T - camX, sy = y * T - camY;
                const tile = this.level.getTile(x, y);

                switch(tile) {
                    case TILE_TYPES.FLOOR:
                    case TILE_TYPES.FLOOR_LIT:
                        ctx.fillStyle = tile === TILE_TYPES.FLOOR_LIT ? COLORS.floorLit : COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        // Floor pattern
                        ctx.strokeStyle = 'rgba(255,255,255,0.02)';
                        ctx.strokeRect(sx, sy, T, T);
                        break;

                    case TILE_TYPES.FLOOR_DARK:
                        ctx.fillStyle = COLORS.floorDark;
                        ctx.fillRect(sx, sy, T, T);
                        break;

                    case TILE_TYPES.WALL:
                        // Wall with 3D effect
                        ctx.fillStyle = COLORS.wall;
                        ctx.fillRect(sx, sy, T, T);
                        ctx.fillStyle = COLORS.wallTop;
                        ctx.fillRect(sx, sy, T, T * 0.3);
                        ctx.fillStyle = COLORS.wallEdge;
                        ctx.fillRect(sx, sy + T - 2, T, 2);
                        break;

                    case TILE_TYPES.DOOR:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        ctx.fillStyle = COLORS.door;
                        ctx.fillRect(sx + T*0.1, sy + T*0.1, T*0.8, T*0.8);
                        ctx.strokeStyle = COLORS.doorFrame;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(sx + T*0.1, sy + T*0.1, T*0.8, T*0.8);
                        // Door handle
                        ctx.fillStyle = '#888';
                        ctx.beginPath();
                        ctx.arc(sx + T*0.7, sy + T/2, 3, 0, Math.PI * 2);
                        ctx.fill();
                        break;

                    case TILE_TYPES.DOOR_LOCKED:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        ctx.fillStyle = COLORS.doorLocked;
                        ctx.fillRect(sx + T*0.1, sy + T*0.1, T*0.8, T*0.8);
                        ctx.fillStyle = '#ff5252';
                        ctx.font = '14px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('🔒', sx + T/2, sy + T/2 + 5);
                        break;

                    case TILE_TYPES.EXIT:
                        ctx.fillStyle = COLORS.exit;
                        ctx.fillRect(sx, sy, T, T);
                        // Exit glow
                        const exitGlow = 0.1 + Math.sin(this.levelTime * 0.05) * 0.05;
                        ctx.fillStyle = `rgba(0,230,118,${exitGlow})`;
                        ctx.fillRect(sx, sy, T, T);
                        ctx.fillStyle = '#00e676';
                        ctx.font = 'bold 10px "Orbitron"';
                        ctx.textAlign = 'center';
                        ctx.fillText('EXIT', sx + T/2, sy + T/2 + 4);
                        break;

                    case TILE_TYPES.ALARM:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        const alarmObj = this.level.alarms.find(a => a.x === x && a.y === y);
                        ctx.fillStyle = alarmObj && alarmObj.disabled ? '#1a3a1a' : COLORS.alarm;
                        ctx.fillRect(sx + 4, sy + 4, T - 8, T - 8);
                        ctx.fillStyle = alarmObj && alarmObj.disabled ? '#00e676' : '#ff5252';
                        ctx.font = '16px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(alarmObj && alarmObj.disabled ? '✓' : '⚠', sx + T/2, sy + T/2 + 6);
                        break;

                    case TILE_TYPES.SAFE:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        const safeObj = this.level.safes.find(s => s.x === x && s.y === y);
                        ctx.fillStyle = safeObj && safeObj.cracked ? '#1a3a1a' : COLORS.safe;
                        ctx.fillRect(sx + 3, sy + 3, T - 6, T - 6);
                        ctx.strokeStyle = '#666';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(sx + 3, sy + 3, T - 6, T - 6);
                        ctx.fillStyle = safeObj && safeObj.cracked ? '#00e676' : '#ffd740';
                        ctx.font = '16px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(safeObj && safeObj.cracked ? '💰' : '🔐', sx + T/2, sy + T/2 + 6);
                        break;

                    case TILE_TYPES.HACKABLE:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        const hackObj = this.level.hackables.find(h => h.x === x && h.y === y);
                        ctx.fillStyle = hackObj && hackObj.hacked ? '#1a3a1a' : '#1a2a3a';
                        ctx.fillRect(sx + 4, sy + 4, T - 8, T - 8);
                        ctx.fillStyle = hackObj && hackObj.hacked ? '#00e676' : '#00e5ff';
                        ctx.font = '14px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText(hackObj && hackObj.hacked ? '✓' : '💻', sx + T/2, sy + T/2 + 5);
                        break;

                    case TILE_TYPES.VENT:
                        ctx.fillStyle = COLORS.vent;
                        ctx.fillRect(sx, sy, T, T);
                        // Vent grate pattern
                        ctx.strokeStyle = COLORS.ventGrate;
                        ctx.lineWidth = 1;
                        for (let i = 0; i < 5; i++) {
                            ctx.beginPath();
                            ctx.moveTo(sx + 4, sy + 4 + i * 8);
                            ctx.lineTo(sx + T - 4, sy + 4 + i * 8);
                            ctx.stroke();
                        }
                        break;

                    case TILE_TYPES.FURNITURE:
                        ctx.fillStyle = COLORS.furniture;
                        ctx.fillRect(sx, sy, T, T);
                        ctx.fillStyle = '#363644';
                        ctx.fillRect(sx + 2, sy + 2, T - 4, T - 4);
                        break;

                    case TILE_TYPES.COUNTER:
                        ctx.fillStyle = COLORS.counter;
                        ctx.fillRect(sx, sy, T, T);
                        ctx.fillStyle = '#353540';
                        ctx.fillRect(sx + 1, sy + 1, T - 2, T - 2);
                        ctx.strokeStyle = '#454550';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(sx + 1, sy + 1, T - 2, T - 2);
                        break;

                    case TILE_TYPES.LASER_H:
                    case TILE_TYPES.LASER_V:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        break;

                    case TILE_TYPES.MOTION_SENSOR:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        break;

                    case TILE_TYPES.GLASS:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                        ctx.fillStyle = COLORS.glass;
                        ctx.fillRect(sx, sy, T, T);
                        break;

                    default:
                        ctx.fillStyle = COLORS.floor;
                        ctx.fillRect(sx, sy, T, T);
                }
            }
        }

        // ---- DRAW LASERS ----
        if (this.empActive <= 0) {
            for (const laser of this.level.def.lasers) {
                ctx.strokeStyle = COLORS.laser;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5 + Math.sin(this.laserPhase * 3) * 0.3;

                if (laser.axis === 'h') {
                    for (let x = laser.x1; x <= laser.x2; x++) {
                        const sx = x * T - camX, sy = laser.y1 * T + T/2 - camY;
                        const phase = this.laserPhase * laser.speed * 100;
                        if (Math.sin((x - laser.x1 + phase) * 2) > 0) {
                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(sx + T, sy);
                            ctx.stroke();
                            // Glow
                            ctx.strokeStyle = 'rgba(255,23,68,0.15)';
                            ctx.lineWidth = 8;
                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(sx + T, sy);
                            ctx.stroke();
                            ctx.strokeStyle = COLORS.laser;
                            ctx.lineWidth = 2;
                        }
                    }
                } else {
                    for (let y = laser.y1; y <= laser.y2; y++) {
                        const sx = laser.x1 * T + T/2 - camX, sy = y * T - camY;
                        const phase = this.laserPhase * laser.speed * 100;
                        if (Math.sin((y - laser.y1 + phase) * 2) > 0) {
                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(sx, sy + T);
                            ctx.stroke();
                            ctx.strokeStyle = 'rgba(255,23,68,0.15)';
                            ctx.lineWidth = 8;
                            ctx.beginPath();
                            ctx.moveTo(sx, sy);
                            ctx.lineTo(sx, sy + T);
                            ctx.stroke();
                            ctx.strokeStyle = COLORS.laser;
                            ctx.lineWidth = 2;
                        }
                    }
                }
                ctx.globalAlpha = 1;
            }
        }

        // ---- DRAW MOTION SENSORS ----
        if (this.empActive <= 0) {
            for (const ms of this.level.def.motionSensors) {
                const sx = (ms.x + 0.5) * T - camX;
                const sy = (ms.y + 0.5) * T - camY;
                const r = ms.radius * T;

                // Pulsing ring
                const pulse = 0.3 + Math.sin(this.levelTime * 0.08) * 0.15;
                ctx.strokeStyle = `rgba(176,136,255,${pulse})`;
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);

                // Center dot
                ctx.fillStyle = `rgba(176,136,255,${pulse + 0.2})`;
                ctx.beginPath();
                ctx.arc(sx, sy, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // ---- DRAW SMOKE ZONES ----
        for (const smoke of this.smokeZones) {
            const sx = smoke.x * T - camX;
            const sy = smoke.y * T - camY;
            const r = smoke.radius * T;
            const alpha = (smoke.timer / CFG.SMOKE_DURATION) * 0.5;
            const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
            grad.addColorStop(0, `rgba(120,120,120,${alpha})`);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
        }

        // ---- DRAW CAMERAS ----
        this.cameras.forEach(cam => cam.draw(ctx, camX, camY));

        // ---- DRAW GUARDS ----
        this.guards.forEach(guard => guard.draw(ctx, camX, camY, this.empActive));

        // ---- DRAW PLAYER ----
        this.player.draw(ctx, camX, camY);

        // ---- DRAW PARTICLES ----
        this.particles.draw(ctx, camX, camY);

        // ---- DRAW MINIMAP ----
        this.renderMinimap();

        // ---- DRAW VIGNETTE ----
        this.drawVignette(ctx, W, H);
    }

    drawVignette(ctx, W, H) {
        const grad = ctx.createRadialGradient(W/2, H/2, Math.min(W,H) * 0.3, W/2, H/2, Math.max(W,H) * 0.7);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    renderMinimap() {
        const mc = document.getElementById('minimap-canvas');
        const mctx = mc.getContext('2d');
        const mW = mc.width, mH = mc.height;
        mctx.clearRect(0, 0, mW, mH);
        mctx.fillStyle = 'rgba(0,0,0,0.6)';
        mctx.fillRect(0, 0, mW, mH);

        if (!this.level) return;

        const scale = Math.min(mW / this.level.width, mH / this.level.height);
        const ox = (mW - this.level.width * scale) / 2;
        const oy = (mH - this.level.height * scale) / 2;

        // Draw tiles
        for (let y = 0; y < this.level.height; y++) {
            for (let x = 0; x < this.level.width; x++) {
                const tile = this.level.getTile(x, y);
                if (tile === TILE_TYPES.WALL) {
                    mctx.fillStyle = '#3a3a4e';
                } else if (tile === TILE_TYPES.EXIT) {
                    mctx.fillStyle = '#00e676';
                } else if (tile === TILE_TYPES.DOOR) {
                    mctx.fillStyle = '#4a6050';
                } else {
                    mctx.fillStyle = '#1a1a24';
                }
                mctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
            }
        }

        // Draw guards
        this.guards.forEach(g => {
            mctx.fillStyle = g.state === 'patrol' ? '#ff5252' : '#ff1744';
            mctx.beginPath();
            mctx.arc(ox + g.x * scale, oy + g.y * scale, 3, 0, Math.PI * 2);
            mctx.fill();
        });

        // Draw cameras
        this.cameras.forEach(c => {
            if (!c.disabled) {
                mctx.fillStyle = '#ffd740';
                mctx.beginPath();
                mctx.arc(ox + c.x * scale, oy + c.y * scale, 2, 0, Math.PI * 2);
                mctx.fill();
            }
        });

        // Draw player
        mctx.fillStyle = '#00e5ff';
        mctx.beginPath();
        mctx.arc(ox + this.player.x * scale, oy + this.player.y * scale, 4, 0, Math.PI * 2);
        mctx.fill();
        mctx.strokeStyle = 'rgba(0,229,255,0.5)';
        mctx.lineWidth = 1;
        mctx.beginPath();
        mctx.arc(ox + this.player.x * scale, oy + this.player.y * scale, 6, 0, Math.PI * 2);
        mctx.stroke();
    }

    // ============ GAME STATE CHANGES ============

    pauseGame() {
        this.state = 'paused';
        document.getElementById('pause-overlay').style.display = 'flex';
    }

    resumeGame() {
        this.state = 'playing';
        document.getElementById('pause-overlay').style.display = 'none';
        this.sound.play('click');
    }

    restartLevel() {
        document.getElementById('pause-overlay').style.display = 'none';
        this.startLevel(this.currentLevel);
        this.sound.play('click');
    }

    quitToMenu() {
        document.getElementById('pause-overlay').style.display = 'none';
        this.showTitle();
        this.sound.play('click');
    }

    levelComplete() {
        this.state = 'complete';
        this.sound.play('success');

        const timeSeconds = Math.floor(this.levelTime / 60);
        const mins = Math.floor(timeSeconds / 60);
        const secs = timeSeconds % 60;

        document.getElementById('stat-time').textContent =
            `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        document.getElementById('stat-alerts').textContent = this.player.alertCount;
        document.getElementById('stat-items').textContent = this.player.itemsUsed;
        document.getElementById('stat-loot').textContent = `$${this.player.lootCollected.toLocaleString()}`;

        // Rating
        let stars = 1;
        if (this.player.alertCount === 0) stars++;
        if (this.player.lootCollected >= this.level.def.lootTarget) stars++;
        if (this.player.alertCount === 0 && this.player.itemsUsed <= 2) stars = 3;

        const starEls = document.querySelectorAll('#complete-rating .star');
        starEls.forEach((el, i) => {
            el.classList.remove('earned');
            if (i < stars) {
                setTimeout(() => {
                    el.classList.add('earned');
                    this.sound.play('click');
                }, 300 + i * 300);
            }
        });

        // Skill points reward
        const reward = stars + this.currentLevel;
        document.getElementById('reward-points').textContent = reward;
        this.skillPoints += reward;

        // Unlock next level
        if (this.currentLevel + 1 > this.maxUnlocked && this.currentLevel < LEVEL_DEFS.length - 1) {
            this.maxUnlocked = this.currentLevel + 1;
        }

        this.saveProgress();
        this.showScreen('complete-screen');
    }

    gameOver(reason) {
        this.state = 'gameover';
        this.sound.play('fail');
        document.getElementById('gameover-reason').textContent = reason;
        this.showScreen('gameover-screen');
    }

    nextLevel() {
        if (this.currentLevel < LEVEL_DEFS.length - 1) {
            this.currentLevel++;
            this.startLevel(this.currentLevel);
        } else {
            this.showTitle();
            this.showMessage('CONGRATULATIONS! ALL MISSIONS COMPLETE!');
        }
        this.sound.play('click');
    }
}

// ============ INITIALIZATION ============

let game;

window.addEventListener('load', () => {
    game = new Game();
});
