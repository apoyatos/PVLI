'use strict';

var Mario = require('./Mario.js');
var Goomba = require('./Goomba.js');
var Spiny = require('./Spiny.js');
var Planta = require('./PlantaPiraña.js');

var PlayScene = {
  create: function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Teclas para input
    this.teclas = this.game.input.keyboard.createCursorKeys();
    this.saltar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.lanzar = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    //Mapa
    this.game.stage.backgroundColor = '#787878';
    this.map = this.game.add.tilemap('map');
    this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
    this.layer = this.map.createLayer('World1');
    this.layer.setScale(2.5, 2.5)
    this.layer.resizeWorld();
    //Colisiones
    this.collisions = this.map.createLayer('Colisiones');
    this.collisions.setScale(2.5, 2.5);
    this.map.setCollisionByExclusion([], true, 'Colisiones');
    this.floor = this.map.createLayer('Suelo');
    this.floor.setScale(2.5, 2.5);
    this.map.setCollisionByExclusion([], true, 'Suelo');
    this.deathZone = this.map.createLayer('Muerte');
    this.deathZone.setScale(2.5, 2.5);
    this.map.setCollisionByExclusion([], true, 'Muerte');
    //Arrays
    this.enemies = [];
    this.capturables = [];
    this.shots = [];
    //Objetos: jugador y enemigos
    this.player = new Mario(this.game, 0, 450, 'mario', 5);
    this.goomba = new Goomba(this.game, 1200, 200, 'goomba', 0, 100, 2, this.player);
    this.goomba1 = new Goomba(this.game, 1500, 200, 'goomba', 0, -100, 2, this.player);
    this.goomba2 = new Goomba(this.game, 1300, 200, 'goomba', 0, -100, 2, this.player);
    this.goomba3 = new Goomba(this.game, 1400, 200, 'goomba', 0, 100, 2, this.player);
    this.spiny = new Spiny(this.game, 1900, 200, 'spiny', 0, 100, 2);
    this.planta = new Planta(this.game, 470, 400, 'planta', 5, 300, 5);
    this.game.camera.follow(this.player);
    this.vidas=this.game.add.sprite(this.game.width-110,0,'vidas',0);
    this.vidas.scale.setTo(1.5,1.5);
    this.vidas.fixedToCamera=true;

    //Array enemigo
    this.enemies.push(this.goomba);
    this.enemies.push(this.goomba1);
    this.enemies.push(this.goomba2);
    this.enemies.push(this.goomba3);
    this.enemies.push(this.spiny);
    this.enemies.push(this.planta);
    //Array capturables
    this.capturables.push(this.goomba);
    this.capturables.push(this.goomba1);
    this.capturables.push(this.goomba2);
    this.capturables.push(this.goomba3);

    console.log(this.player.life);
  },
  update: function () {
    this.vidas.frame=this.player.life-1
    //Colisiones del mapa respectos a los objetos del juego
    this.game.physics.arcade.collide(this.player, this.floor);
    this.game.physics.arcade.collide(this.player, this.collisions);
    this.game.physics.arcade.collide(this.player, this.deathZone,function(player){ player.Die();});
    this.game.physics.arcade.collide(this.goomba, this.floor);
    this.game.physics.arcade.collide(this.goomba, this.collisions, function(enemy){ enemy.ChangeDir();});
    this.game.physics.arcade.collide(this.goomba1, this.floor);
    this.game.physics.arcade.collide(this.goomba1, this.collisions, function(enemy){ enemy.ChangeDir();});
    this.game.physics.arcade.collide(this.goomba2, this.floor);
    this.game.physics.arcade.collide(this.goomba2, this.collisions, function(enemy){ enemy.ChangeDir();});
    this.game.physics.arcade.collide(this.goomba3, this.floor);
    this.game.physics.arcade.collide(this.goomba3, this.collisions, function(enemy){ enemy.ChangeDir();});
    this.game.physics.arcade.collide(this.spiny, this.floor);
    this.game.physics.arcade.collide(this.spiny, this.collisions, function(enemy){ enemy.ChangeDir();});
    this.game.physics.arcade.collide(this.planta, this.floor);
    this.game.physics.arcade.collide(this.player.cappy, this.collisions);
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
    //Jugador y Cappy
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
    //Spiny
    this.spiny.Move();
    //Planta
    
    var shot = this.planta.Shoot(this.player);
    if (shot != undefined)
      this.shots.push(shot);
    //Colisiones con enemigos
    this.enemies.forEach(
      function (item) {
        this.player.EnemyCollision(this.player, item);
      }, this);
    //Colisiones con disparos
    this.shots.forEach(
      function (item) {
        if (this.player.EnemyCollision(this.player, item)) {
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

module.exports = PlayScene;
