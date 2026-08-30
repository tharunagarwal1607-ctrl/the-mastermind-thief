// ================================================================
//  THE MASTERMIND THIEF — 2D ACTION RUNNER
// ================================================================

// ============ CONFIGURATION ============
const CFG = {
    FPS: 60,
    GRAVITY: 0.6,
    JUMP_FORCE: -12,
    MAX_FALL: 15,
    BASE_SPEED: 8,
    SPEED_INC: 0.2, // Speed increase per level
    TILE_SIZE: 60,
    GROUND_Y: 0, // Calculated on resize
};

// ============ LEVEL DEFINITIONS ============
const LEVELS = [
    { name: "THE CORNER SHOP", targetDist: 2000, theme: "city", color1: "#1a1a24", color2: "#2d2d3a", difficulty: 1 },
    { name: "ATM RUN", targetDist: 3000, theme: "streets", color1: "#0f1520", color2: "#1c2536", difficulty: 2 },
    { name: "CENTRAL BANK", targetDist: 4000, theme: "bank", color1: "#2a2020", color2: "#4a3535", difficulty: 3 },
    { name: "ROYAL MUSEUM", targetDist: 5000, theme: "museum", color1: "#150f20", color2: "#2a1c3d", difficulty: 4 },
    { name: "OMEGA VAULT", targetDist: 7000, theme: "vault", color1: "#0a0b10", color2: "#1a1c25", difficulty: 5 }
];

// ============ INPUT MANAGER ============
class InputManager {
    constructor() {
        this.keys = {};
        this.justPressed = {};
        window.addEventListener('keydown', e => {
            if (!this.keys[e.code]) this.justPressed[e.code] = true;
            this.keys[e.code] = true;
        });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; });
        
        // Touch controls
        this.setupTouch('btn-jump', 'Space');
        this.setupTouch('btn-slide', 'KeyS');
        this.setupTouch('btn-shoot', 'KeyF');
    }
    
    setupTouch(id, code) {
        const el = document.getElementById(id);
        if(!el) return;
        el.addEventListener('touchstart', (e) => { e.preventDefault(); if (!this.keys[code]) this.justPressed[code] = true; this.keys[code] = true; });
        el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[code] = false; });
    }
    
    isDown(code) { return !!this.keys[code]; }
    wasPressed(code) { return !!this.justPressed[code]; }
    resetFrame() { this.justPressed = {}; }
}

// ============ PLAYER ============
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 80;
        this.baseY = y;
        this.vy = 0;
        
        this.state = 'run'; // run, jump, fall, slide, dead
        this.health = 3;
        this.maxHealth = 3;
        this.invulnerableTimer = 0;
        
        this.jumps = 0;
        this.maxJumps = 2; // Double jump
        
        this.shootTimer = 0;
        
        // Animation
        this.animTimer = 0;
    }

    update(input, dt, speed, game) {
        if (this.state === 'dead') {
            this.x -= speed * dt;
            this.y += this.vy * dt;
            this.vy += CFG.GRAVITY * dt;
            return;
        }

        // Timers
        if (this.invulnerableTimer > 0) this.invulnerableTimer -= dt;
        if (this.shootTimer > 0) this.shootTimer -= dt;

        // Input
        const jumpPressed = input.wasPressed('Space') || input.wasPressed('ArrowUp') || input.wasPressed('KeyW');
        const slideDown = input.isDown('ArrowDown') || input.isDown('KeyS');
        const shootPressed = input.wasPressed('KeyF') || (input.wasPressed('Space') && !jumpPressed); // Simplified

        if (jumpPressed && this.jumps < this.maxJumps) {
            this.vy = CFG.JUMP_FORCE;
            this.state = 'jump';
            this.jumps++;
            this.h = 80; // Reset height if was sliding
        }

        if (slideDown && this.state !== 'jump' && this.state !== 'fall') {
            this.state = 'slide';
            this.h = 40;
            this.y = CFG.GROUND_Y - this.h;
        } else if (this.state === 'slide' && !slideDown) {
            this.state = 'run';
            this.h = 80;
            this.y = CFG.GROUND_Y - this.h;
        }

        if (shootPressed && this.shootTimer <= 0) {
            game.spawnProjectile(this.x + this.w, this.y + 20, 15, true);
            this.shootTimer = 15; // Fire rate
        }

        // Physics
        this.vy += CFG.GRAVITY * dt;
        if (this.vy > CFG.MAX_FALL) this.vy = CFG.MAX_FALL;
        
        this.y += this.vy * dt;

        // Ground Collision
        if (this.y + this.h >= CFG.GROUND_Y && this.vy >= 0) {
            // Check if falling in a gap
            let overGap = false;
            for (let gap of game.gaps) {
                if (this.x + this.w > gap.x && this.x < gap.x + gap.w) {
                    overGap = true; break;
                }
            }

            if (!overGap) {
                this.y = CFG.GROUND_Y - this.h;
                this.vy = 0;
                this.jumps = 0;
                if (this.state === 'jump' || this.state === 'fall') {
                    this.state = slideDown ? 'slide' : 'run';
                }
            } else {
                this.state = 'fall';
            }
        } else if (this.y + this.h < CFG.GROUND_Y) {
            if (this.vy > 0) this.state = 'fall';
        }

        // Death by falling
        if (this.y > CFG.GROUND_Y + 500) {
            this.health = 0;
            this.state = 'dead';
        }

        // Animation
        this.animTimer += dt;
    }

    damage(amount) {
        if (this.invulnerableTimer > 0 || this.state === 'dead') return;
        this.health -= amount;
        this.invulnerableTimer = 60; // 1 second i-frames
        if (this.health <= 0) {
            this.health = 0;
            this.state = 'dead';
            this.vy = -10;
        }
    }

    draw(ctx) {
        if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 5) % 2 === 0) return;

        ctx.save();
        ctx.translate(this.x + this.w/2, this.y + this.h/2);
        
        if (this.state === 'dead') {
            ctx.rotate(this.animTimer * 0.1);
        }

        // Draw character (Thief)
        ctx.fillStyle = '#ff3366'; // Action Pink

        if (this.state === 'run') {
            const bob = Math.sin(this.animTimer * 0.4) * 5;
            ctx.fillRect(-this.w/2, -this.h/2 + bob, this.w, this.h - bob);
            // Eye slot
            ctx.fillStyle = '#0a0b10';
            ctx.fillRect(-this.w/2 + 25, -this.h/2 + bob + 15, 10, 8);
        } else if (this.state === 'jump' || this.state === 'fall') {
            ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
            ctx.fillStyle = '#0a0b10';
            ctx.fillRect(-this.w/2 + 25, -this.h/2 + 15, 10, 8);
        } else if (this.state === 'slide') {
            ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
            // Sliding dust
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(-this.w/2 - 20, this.h/2 - 5, 20, 5);
        } else if (this.state === 'dead') {
            ctx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
        }

        ctx.restore();
    }
}

// ============ ENTITIES ============

class Obstacle {
    constructor(x, type) {
        this.x = x;
        this.type = type; // box, laserHigh, laserLow
        this.w = type === 'box' ? 50 : 30;
        this.h = type === 'laserHigh' ? 120 : (type === 'laserLow' ? 40 : 60);
        this.y = CFG.GROUND_Y - this.h;
        if (type === 'laserHigh') this.y -= 70; // Float high, must slide under
        if (type === 'laserLow') this.y = CFG.GROUND_Y - 40; // Low, must jump
        this.active = true;
    }
    update(speed, dt) { this.x -= speed * dt; return this.x + this.w > 0; }
    draw(ctx) {
        if (this.type === 'box') {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.strokeStyle = '#555';
            ctx.strokeRect(this.x, this.y, this.w, this.h);
        } else {
            // Laser
            ctx.fillStyle = '#222';
            ctx.fillRect(this.x + 10, this.y - 10, 10, this.h + 20); // pole
            ctx.fillStyle = '#00e5ff'; // Cyan laser
            ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.globalAlpha = 1;
        }
    }
}

class Enemy {
    constructor(x) {
        this.x = x;
        this.w = 40;
        this.h = 80;
        this.y = CFG.GROUND_Y - this.h;
        this.hp = 1;
        this.shootTimer = Math.random() * 60 + 30;
    }
    update(speed, dt, game) {
        this.x -= speed * dt;
        
        // AI Shooting
        if (this.x < game.canvas.width && this.x > game.player.x) {
            this.shootTimer -= dt;
            if (this.shootTimer <= 0) {
                game.spawnProjectile(this.x, this.y + 20, -10, false);
                this.shootTimer = 90;
            }
        }
        return this.x + this.w > 0 && this.hp > 0;
    }
    draw(ctx) {
        ctx.fillStyle = '#ffc107'; // Guard color
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x + 5, this.y + 15, 10, 8); // Eye facing left
    }
}

class Coin {
    constructor(x, y) {
        this.x = x; this.y = y; this.w = 20; this.h = 20;
        this.collected = false;
        this.anim = Math.random() * Math.PI;
    }
    update(speed, dt) { this.x -= speed * dt; this.anim += 0.1 * dt; return this.x + this.w > 0 && !this.collected; }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.w/2, this.y + this.h/2);
        ctx.scale(Math.sin(this.anim), 1);
        ctx.fillStyle = '#ffc107';
        ctx.beginPath();
        ctx.arc(0, 0, this.w/2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }
}

class Projectile {
    constructor(x, y, vx, isPlayer) {
        this.x = x; this.y = y; this.w = 15; this.h = 6;
        this.vx = vx;
        this.isPlayer = isPlayer;
        this.active = true;
    }
    update(speed, dt) {
        this.x += (this.vx - speed) * dt; // subtract background speed
        return this.active && this.x > 0 && this.x < window.innerWidth + 200;
    }
    draw(ctx) {
        ctx.fillStyle = this.isPlayer ? '#ff3366' : '#ffc107';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.shadowBlur = 0;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10 - 2;
        this.life = 1;
        this.color = color;
        this.size = Math.random() * 6 + 2;
    }
    update(speed, dt) {
        this.x += (this.vx - speed) * dt;
        this.y += this.vy * dt;
        this.life -= 0.05 * dt;
        return this.life > 0;
    }
    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

// ============ MAIN GAME ENGINE ============

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputManager();
        
        this.state = 'intro'; // intro, title, levelSelect, upgrades, playing, paused, gameover, complete
        
        this.currentLevel = 0;
        this.maxUnlocked = 0;
        this.totalCoins = 0;
        this.upgrades = { health: 0, magnet: 0, ammo: 0 }; // levels 0-5
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.loadSave();
        this.playIntro();
        
        this.lastTime = performance.now();
        requestAnimationFrame(t => this.loop(t));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        CFG.GROUND_Y = this.canvas.height - 100;
    }

    loadSave() {
        try {
            const save = JSON.parse(localStorage.getItem('mmThiefRunner'));
            if (save) {
                this.maxUnlocked = save.maxUnlocked || 0;
                this.totalCoins = save.totalCoins || 0;
                this.upgrades = save.upgrades || { health: 0, magnet: 0, ammo: 0 };
            }
        } catch(e) {}
    }
    saveData() {
        localStorage.setItem('mmThiefRunner', JSON.stringify({
            maxUnlocked: this.maxUnlocked, totalCoins: this.totalCoins, upgrades: this.upgrades
        }));
    }

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    playIntro() {
        const ctx = document.getElementById('logo-canvas').getContext('2d');
        let frame = 0;
        const anim = () => {
            frame++;
            ctx.clearRect(0,0,600,400);
            
            ctx.fillStyle = '#ff3366';
            ctx.font = 'bold 50px "Black Ops One"';
            ctx.textAlign = 'center';
            ctx.fillText("THARUN", 300, 200);
            
            ctx.fillStyle = '#fff';
            ctx.font = '20px "Orbitron"';
            ctx.fillText("& TEAM", 300, 240);
            
            if(frame < 120) requestAnimationFrame(anim);
            else this.showTitle();
        };
        anim();
    }

    showTitle() { this.state = 'title'; this.showScreen('title-screen'); }
    
    showLevelSelect() { 
        this.state = 'levelSelect'; this.showScreen('level-select-screen'); 
        document.getElementById('total-coins').innerText = this.totalCoins;
        
        const container = document.getElementById('level-cards');
        container.innerHTML = '';
        LEVELS.forEach((lvl, i) => {
            const card = document.createElement('div');
            card.className = 'lvl-card' + (i > this.maxUnlocked ? ' locked' : '');
            card.innerHTML = `<div class="lvl-num">MISSION ${i+1}</div><div class="lvl-name">${lvl.name}</div><div class="lvl-dist">TARGET: ${lvl.targetDist}m</div>`;
            if (i <= this.maxUnlocked) card.onclick = () => this.startLevel(i);
            container.appendChild(card);
        });
    }

    showUpgrades() {
        this.state = 'upgrades'; this.showScreen('upgrades-screen');
        document.getElementById('upgrade-coins').innerText = this.totalCoins;
        
        const container = document.getElementById('upgrades-grid');
        container.innerHTML = '';
        
        const shop = [
            { id: 'health', name: 'ARMOR', desc: 'Increases starting health', cost: 100 },
            { id: 'magnet', name: 'MAGNET', desc: 'Attracts nearby coins', cost: 150 },
            { id: 'ammo', name: 'RAPID FIRE', desc: 'Shoot faster', cost: 200 }
        ];
        
        shop.forEach(item => {
            const lvl = this.upgrades[item.id];
            const cost = item.cost * (lvl + 1);
            const maxed = lvl >= 5;
            const canAfford = this.totalCoins >= cost && !maxed;
            
            const card = document.createElement('div');
            card.className = 'upg-card';
            card.innerHTML = `
                <h3>${item.name}</h3>
                <div class="upg-desc">${item.desc}</div>
                <div class="upg-pips">${[0,1,2,3,4].map(p => `<div class="pip ${p<lvl?'filled':''}"></div>`).join('')}</div>
                <button class="upg-btn" ${!canAfford ? 'disabled' : ''}>
                    ${maxed ? 'MAXED' : 'UPGRADE - 💰' + cost}
                </button>
            `;
            if (canAfford) {
                card.querySelector('button').onclick = () => {
                    this.totalCoins -= cost;
                    this.upgrades[item.id]++;
                    this.saveData();
                    this.showUpgrades();
                };
            }
            container.appendChild(card);
        });
    }

    startNewGame() { this.startLevel(0); }

    startLevel(idx) {
        this.currentLevel = idx;
        const lvlDef = LEVELS[idx];
        
        this.player = new Player(100, CFG.GROUND_Y - 80);
        this.player.maxHealth = 3 + this.upgrades.health;
        this.player.health = this.player.maxHealth;
        
        this.speed = CFG.BASE_SPEED + (idx * CFG.SPEED_INC);
        this.distance = 0;
        this.sessionCoins = 0;
        this.sessionKills = 0;
        
        this.obstacles = [];
        this.enemies = [];
        this.coins = [];
        this.projectiles = [];
        this.particles = [];
        this.gaps = [];
        
        this.nextSpawnDist = 500;
        this.bgOffset = 0;
        
        this.state = 'playing';
        this.showScreen('game-screen');
        document.getElementById('pause-overlay').style.display = 'none';
        
        this.showMessage(`MISSION ${idx+1}: ${lvlDef.name}`);
        this.updateHUD();
    }

    spawnProjectile(x, y, vx, isPlayer) {
        this.projectiles.push(new Projectile(x, y, vx, isPlayer));
    }

    spawnParticles(x, y, color, count) {
        for(let i=0; i<count; i++) this.particles.push(new Particle(x, y, color));
    }

    showMessage(text) {
        const msg = document.getElementById('msg-text');
        msg.textContent = text;
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 2000);
    }

    loop(now) {
        const dt = Math.min((now - this.lastTime) / (1000 / CFG.FPS), 3);
        this.lastTime = now;

        if (this.state === 'playing') {
            this.update(dt);
            this.render();
        }

        this.input.resetFrame();
        requestAnimationFrame(t => this.loop(t));
    }

    update(dt) {
        if (this.input.wasPressed('Escape')) {
            this.state = 'paused';
            document.getElementById('pause-overlay').style.display = 'flex';
            return;
        }

        const lvlDef = LEVELS[this.currentLevel];
        
        if (this.player.state !== 'dead') {
            this.distance += this.speed * dt;
            this.speed += 0.001 * dt; // Gradually increase speed
        }

        // Level generation
        if (this.distance > this.nextSpawnDist && this.player.state !== 'dead') {
            this.generateChunk();
            this.nextSpawnDist += Math.random() * 300 + 400;
        }

        this.player.update(this.input, dt, this.speed, this);

        // Update arrays
        this.obstacles = this.obstacles.filter(o => o.update(this.speed, dt));
        this.enemies = this.enemies.filter(e => e.update(this.speed, dt, this));
        this.coins = this.coins.filter(c => {
            // Magnet logic
            if (this.upgrades.magnet > 0) {
                const dx = (this.player.x + this.player.w/2) - (c.x + c.w/2);
                const dy = (this.player.y + this.player.h/2) - (c.y + c.h/2);
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150 + this.upgrades.magnet * 50) {
                    c.x += (dx / dist) * 15 * dt;
                    c.y += (dy / dist) * 15 * dt;
                }
            }
            return c.update(this.speed, dt);
        });
        this.projectiles = this.projectiles.filter(p => p.update(this.speed, dt));
        this.particles = this.particles.filter(p => p.update(this.speed, dt));
        this.gaps = this.gaps.filter(g => { g.x -= this.speed * dt; return g.x + g.w > 0; });

        this.checkCollisions();

        this.bgOffset -= (this.speed * 0.2) * dt;
        if (this.bgOffset <= -this.canvas.width) this.bgOffset = 0;

        this.updateHUD();

        // Win condition
        if (this.distance >= lvlDef.targetDist && this.player.state !== 'dead') {
            this.levelComplete();
        }

        // Lose condition
        if (this.player.state === 'dead' && this.player.y > this.canvas.height) {
            this.gameOver();
        }
    }

    generateChunk() {
        const spawnX = this.canvas.width + 100;
        const rand = Math.random();
        
        if (rand < 0.2) {
            // Gap
            this.gaps.push({ x: spawnX, w: 200 });
            // Coins over gap
            for(let i=0; i<3; i++) this.coins.push(new Coin(spawnX + 50 + i*40, CFG.GROUND_Y - 120));
        } else if (rand < 0.5) {
            // Obstacle
            const types = ['box', 'laserHigh', 'laserLow'];
            this.obstacles.push(new Obstacle(spawnX, types[Math.floor(Math.random()*types.length)]));
        } else if (rand < 0.8) {
            // Enemy
            this.enemies.push(new Enemy(spawnX));
        } else {
            // Coin block
            for(let i=0; i<5; i++) {
                this.coins.push(new Coin(spawnX + i*40, CFG.GROUND_Y - 40));
                this.coins.push(new Coin(spawnX + i*40, CFG.GROUND_Y - 80));
            }
        }
    }

    checkCollisions() {
        if (this.player.state === 'dead') return;

        const p = this.player;
        const rect1 = { x: p.x, y: p.y, w: p.w, h: p.h };

        const AABB = (r1, r2) => {
            return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x &&
                   r1.y < r2.y + r2.h && r1.y + r1.h > r2.y;
        };

        // Player hits obstacle
        for (let obs of this.obstacles) {
            if (obs.active && AABB(rect1, obs)) {
                p.damage(1);
                obs.active = false;
                this.spawnParticles(p.x+p.w, p.y+p.h/2, '#fff', 10);
            }
        }

        // Player hits enemy
        for (let e of this.enemies) {
            if (AABB(rect1, e)) {
                p.damage(1);
                e.hp = 0;
                this.spawnParticles(e.x, e.y, '#ff0', 10);
            }
        }

        // Projectiles
        for (let proj of this.projectiles) {
            if (!proj.active) continue;
            
            if (proj.isPlayer) {
                for (let e of this.enemies) {
                    if (AABB(proj, e)) {
                        e.hp = 0;
                        proj.active = false;
                        this.sessionKills++;
                        this.spawnParticles(e.x, e.y, '#ffc107', 15);
                    }
                }
                for (let obs of this.obstacles) {
                    if (obs.type === 'box' && AABB(proj, obs)) {
                        obs.active = false;
                        proj.active = false;
                        this.spawnParticles(obs.x, obs.y, '#555', 15);
                    }
                }
            } else {
                if (AABB(proj, rect1)) {
                    p.damage(1);
                    proj.active = false;
                    this.spawnParticles(p.x, p.y, '#ff3366', 10);
                }
            }
        }

        // Coins
        for (let c of this.coins) {
            if (!c.collected && AABB(rect1, c)) {
                c.collected = true;
                this.sessionCoins += 10;
                this.spawnParticles(c.x, c.y, '#ffc107', 5);
            }
        }
    }

    render() {
        const lvlDef = LEVELS[this.currentLevel];
        
        // Background
        this.ctx.fillStyle = lvlDef.color1;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid pattern
        this.ctx.strokeStyle = lvlDef.color2;
        this.ctx.lineWidth = 2;
        const size = 100;
        for(let x = this.bgOffset % size; x < this.canvas.width; x += size) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, CFG.GROUND_Y); this.ctx.stroke();
        }

        // Ground
        this.ctx.fillStyle = '#0a0b10';
        this.ctx.fillRect(0, CFG.GROUND_Y, this.canvas.width, this.canvas.height - CFG.GROUND_Y);
        this.ctx.strokeStyle = '#00e5ff'; // Neon line
        this.ctx.lineWidth = 4;
        this.ctx.beginPath(); this.ctx.moveTo(0, CFG.GROUND_Y); this.ctx.lineTo(this.canvas.width, CFG.GROUND_Y); this.ctx.stroke();

        // Gaps
        for(let g of this.gaps) {
            this.ctx.fillStyle = lvlDef.color1; // Draw bg color over ground
            this.ctx.fillRect(g.x, CFG.GROUND_Y - 2, g.w, this.canvas.height - CFG.GROUND_Y + 2);
            // Draw neon edge
            this.ctx.beginPath(); this.ctx.moveTo(g.x, CFG.GROUND_Y); this.ctx.lineTo(g.x, this.canvas.height); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(g.x + g.w, CFG.GROUND_Y); this.ctx.lineTo(g.x + g.w, this.canvas.height); this.ctx.stroke();
        }

        // Entities
        this.obstacles.forEach(o => { if(o.active) o.draw(this.ctx); });
        this.enemies.forEach(e => { if(e.hp>0) e.draw(this.ctx); });
        this.coins.forEach(c => { if(!c.collected) c.draw(this.ctx); });
        this.projectiles.forEach(p => { if(p.active) p.draw(this.ctx); });
        this.particles.forEach(p => p.draw(this.ctx));
        
        this.player.draw(this.ctx);
    }

    updateHUD() {
        document.getElementById('distance-value').textContent = Math.floor(this.distance) + 'm';
        document.getElementById('hud-coins').textContent = this.sessionCoins;
        
        const hpPct = (this.player.health / this.player.maxHealth) * 100;
        document.getElementById('health-bar-fill').style.width = hpPct + '%';
    }

    resumeGame() {
        this.state = 'playing';
        document.getElementById('pause-overlay').style.display = 'none';
    }

    restartLevel() { this.startLevel(this.currentLevel); }

    quitToMenu() {
        this.totalCoins += this.sessionCoins;
        this.saveData();
        this.showTitle();
    }

    levelComplete() {
        this.state = 'complete';
        this.totalCoins += this.sessionCoins;
        if (this.currentLevel + 1 > this.maxUnlocked && this.currentLevel < LEVELS.length - 1) {
            this.maxUnlocked = this.currentLevel + 1;
        }
        this.saveData();
        
        document.getElementById('stat-coins').textContent = this.sessionCoins;
        document.getElementById('stat-kills').textContent = this.sessionKills;
        this.showScreen('complete-screen');
    }

    gameOver() {
        this.state = 'gameover';
        document.getElementById('fail-dist').textContent = Math.floor(this.distance) + 'm';
        this.showScreen('gameover-screen');
    }

    nextLevel() {
        if (this.currentLevel < LEVELS.length - 1) {
            this.startLevel(this.currentLevel + 1);
        } else {
            this.showTitle();
            alert("YOU BEAT THE GAME!");
        }
    }
}

// Start
let game;
window.addEventListener('load', () => { game = new Game(); });
