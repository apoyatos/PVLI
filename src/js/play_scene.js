'use strict';

var Mario = require('./Mario.js');
var Goomba = require('./Goomba.js');
var Spiny = require('./Spiny.js');
var Planta = require('./PlantaPiraña.js');
var Monedas = require('./Monedas.js');
var Lunas = require('./Lunas.js');
var Corazones=require('./Corazones.js');
var Banderas= require('./Checkpoints.js');

var PlayScene = {
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Teclas para input
    this.teclas = this.game.input.keyboard.createCursorKeys();
    this.saltar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.correr = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.lanzar = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    //Mapa
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    this.map.scale = { x: 2.5, y: 2.5 };
    this.layer = this.map.createLayer('World1');
    this.layer.resizeWorld();

    this.collectibles = this.game.add.group();
    this.map.createFromObjects('Monedas', 11, 'coins', 0, true, false, this.collectibles, Monedas);
    this.map.createFromObjects('Lunas', 19, 'moon', 0, true, false, this.collectibles, Lunas);

    //Colisiones
    this.collisions = this.map.createLayer('Colisiones');
    this.map.setCollisionByExclusion([], true, 'Colisiones');
    this.floor = this.map.createLayer('Suelo');
    this.map.setCollisionByExclusion([], true, 'Suelo');
    this.deathZone = this.map.createLayer('Muerte');
    this.map.setCollisionByExclusion([], true, 'Muerte');
    this.eBlocks = this.map.createLayer('BloquesENormales');
    this.map.setCollisionByExclusion([], true, 'BloquesENormales');
    this.blocks = this.map.createLayer('Bloques');
    this.map.setCollisionByExclusion([], true, 'Bloques');
    //Arrays
    this.enemies = [];
    this.capturables = [];
    this.shots = [];
    //Objetos: jugador y enemigos
    this.player = new Mario(this.game, 0, 0, 'mario', 5);
    this.game.camera.follow(this.player);

    this.goomba = new Goomba(this.game, 1200, 0, 'goomba', 0, 100, 2, this.player);
    this.goomba1 = new Goomba(this.game, 1500, 0, 'goomba', 0, -100, 2, this.player);
    this.goomba2 = new Goomba(this.game, 1300, 0, 'goomba', 0, -100, 2, this.player);
    this.goomba3 = new Goomba(this.game, 1600, 0, 'goomba', 0, 100, 2, this.player);
    this.goomba4 = new Goomba(this.game, 7000, 0, 'goomba', 0, -100, 2, this.player);
    this.spiny = new Spiny(this.game, 1900, 0, 'spiny', 0, 100, 2);
    this.planta = new Planta(this.game, 500, 0, 'planta', 5, 300, 5);

    this.vidas = this.game.add.sprite(this.game.width - 110, 27, 'vidas', 0);
    this.vidas.scale.setTo(1.5, 1.5);
    this.vidas.fixedToCamera = true;
    //Array enemigo
    this.enemies.push(this.goomba);
    this.enemies.push(this.goomba1);
    this.enemies.push(this.goomba2);
    this.enemies.push(this.goomba3);
    this.enemies.push(this.goomba4);
    this.enemies.push(this.spiny);
    this.enemies.push(this.planta);
    //Array capturables
    this.capturables.push(this.goomba);
    this.capturables.push(this.goomba1);
    this.capturables.push(this.goomba2);
    this.capturables.push(this.goomba3);
    this.capturables.push(this.goomba4);
  },
  update: function () {
    this.vidas.frame = this.player.life - 1

    //Colisiones del mapa respectos a los objetos del juego
    this.game.physics.arcade.collide(this.player, this.floor);
    this.game.physics.arcade.collide(this.player, this.collisions);
    this.game.physics.arcade.collide(this.player, this.deathZone, function (player) { player.Die(); });
    
    this.game.physics.arcade.collide(this.player, this.blocks, function (player, tile) { HitBlock(player, tile); });
    this.game.physics.arcade.collide(this.player, this.eBlocks,function (player, tile) { HitBlockCoins(player, tile);});
    
    this.enemies.forEach(
      function (item) {
        this.game.physics.arcade.collide(item, this.floor);
        this.game.physics.arcade.collide(item, this.collisions, function (enemy) { enemy.ChangeDir(); });
        this.game.physics.arcade.collide(item, this.floor);
      }, this);
    
      this.game.physics.arcade.collide(this.player.cappy, this.collisions);

    //Correr
    if (this.correr.isDown)
      this.player.running = true;
    else
      this.player.running = false;
    //Movimiento
    if (this.teclas.right.isDown)
      this.player.Move(1);
    else if (this.teclas.left.isDown)
      this.player.Move(-1);
    else
      this.player.NotMoving();
    //Salto
    if (this.saltar.isDown)
      this.player.Jump();
    if (this.teclas.up.isDown)
      this.player.Tackle();
    //Agacharse
    if (this.teclas.down.isDown)
      this.player.Crouch();
    if (this.teclas.down.isUp)
      this.player.NotCrouching();
    //Lanzar a Cappy
    if (this.lanzar.isDown)
      this.player.ThrowCappy();
    else if (this.player.cappy != null)
      this.player.cappy.cappyHold = false;
    //Manejo de eventos
    this.player.CheckOnFloor();
    this.player.handleAnimations();

    if (this.player.cappy != null) {
      this.player.cappy.Check();
      this.player.cappy.Collision();
    }
    //Goomba
    if (this.goomba.alive) {
      this.goomba.Move();
      this.goomba.Die();
    }
    if (this.goomba1.alive) {
      this.goomba1.Move();
      this.goomba1.Die();
    }
    if (this.goomba2.alive) {
      this.goomba2.Move();
      this.goomba2.Die();
    }
    if (this.goomba3.alive) {
      this.goomba3.Move();
      this.goomba3.Die();
    }
    if (this.goomba4.alive) {
      this.goomba4.Move();
      this.goomba4.Die();
    }
    //Spiny
    this.spiny.Move();
    //Planta
    if (this.planta.alive) {
      var shot = this.planta.Shoot(this.player);
      if (shot != undefined)
        this.shots.push(shot);
    }
    //colisiones con Objetos
    this.collectibles.forEach(
      function (item) {
        this.player.CollectibleCollision(item);
      }, this);
    //Colisiones con enemigos
    this.enemies.forEach(
      function (item) {
        this.player.EnemyCollision(item);
        if (this.player.cappy != null)
          this.player.cappy.Stunn(item);
      }, this);
    //Colisiones con disparos
    this.shots.forEach(
      function (item) {
        if (this.player.EnemyCollision(item)) {
          item.destroy();
        }
        //item.RemoveShot();
      }, this);
    //Enemigos capturados/no capturados
    this.capturables.forEach(
      function (item) {
        if (this.player.cappy != null)
          this.player.cappy.Capture(item);
      }, this);
  }
};

function HitBlock(player, tile) {
  if (player.body.blocked.up || (player.prevY < player.y && player.crouching)) {
    tile.index = 1;
    tile.setCollision(false, false, false, false);
    tile.layer.dirty = true;
  }
}

function HitBlockCoins(player, tile) {
  if (tile.index == 14 && (player.body.blocked.up || (player.prevY < player.y && player.crouching))) {
    tile.index = 16;
    tile.layer.dirty = true;
  }
}

module.exports = PlayScene;
