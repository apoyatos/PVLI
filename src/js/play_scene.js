'use strict';

var Mario = require('./Mario.js');
var Goomba = require('./Goomba.js');
var Spiny = require('./Spiny.js');
var Planta = require('./PlantaPiraña.js');
var Chomp = require('./Chomp.js');
var Boss = require('./Boss.js');
var TRex = require('./T-Rex.js');

var Bandera = require('./Bandera.js');
var Moneda = require('./Moneda.js');
var Luna = require('./Luna.js');
var Bloque = require('./BlockHandler.js');
var HeartS = require('./HeartSpawner.js');
var CoinS = require('./CoinSpawner.js');

var PlayScene = {
  create: function () {
    //Físicas
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    //Sonido nivel 1
    this.level1Sound = this.game.add.audio('level1');
    this.level1Sound.play();
    this.level1Sound.loop = true;
    //Teclas para input
    this.teclas = this.game.input.keyboard.createCursorKeys();
    this.saltar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.correr = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
    this.lanzar = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.pausar = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
    //Mapa
    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('Tiles1', 'tiles1');
    this.map.addTilesetImage('Tiles2', 'tiles2');
    this.layer = this.map.createLayer(1);
    this.layer.resizeWorld();
    //Objetos del mapa
    this.objects = this.game.add.group();
    this.map.createFromObjects('Banderas', 481, 'checkpoint', 0, true, false, this.objects, Bandera);
    this.map.createFromObjects('Monedas', 481, 'coin', 0, true, false, this.objects, Moneda);
    this.map.createFromObjects('SuperMonedas', 481, 'superCoin', 0, true, false, this.objects, Moneda);
    this.map.createFromObjects('Lunas', 481, 'moon', 0, true, false, this.objects, Luna);
    //Colisiones del mapa
    this.collisions = this.map.createLayer('Colisiones');
    this.map.setCollisionByExclusion([], true, 'Colisiones');
    this.floor = this.map.createLayer('Suelo');
    this.map.setCollisionByExclusion([], true, 'Suelo');
    this.deathZone = this.map.createLayer('Muerte');
    this.map.setCollisionByExclusion([], true, 'Muerte');
    this.blocks = this.map.createLayer('Bloques');
    this.map.setCollisionByExclusion([], true, 'Bloques');
    this.coinBlocks = this.map.createLayer('BloquesMonedas');
    this.map.setCollisionByExclusion([], true, 'BloquesMonedas');
    this.heartBlocks = this.map.createLayer('BloquesCorazones');
    this.map.setCollisionByExclusion([], true, 'BloquesCorazones');
    this.superheartBlocks = this.map.createLayer('BloquesSuperCorazones');
    this.map.setCollisionByExclusion([], true, 'BloquesSuperCorazones');
    //Grupos
    this.enemies = this.game.add.group();
    this.shots = this.game.add.group();
    //Mario
    this.numMoons = 10;
    this.minMoons = 5;
    this.player = new Mario(this.game, 32, 2720, 'mario', 5, this);
    this.game.camera.follow(this.player);
    //Boss
    this.boss = new Boss(this.game, 5470, 446, 'plant', 0, 'chomp', 30, 3, this.player);
    //Enemigos:
    this.enemies.add(this.boss);
    //T-Rex
    this.enemies.add(new TRex(this.game, 1408, 2080, 't-rex', 0, this.player));
    //Goombas
    this.enemies.add(new Goomba(this.game, 960, 2816, 'goomba', 0, 100, this.player));
    this.enemies.add(new Goomba(this.game, 1890, 2688, 'goomba', 0, -100, this.player));
    this.enemies.add(new Goomba(this.game, 2018, 2688, 'goomba', 0, -100, this.player));
    this.enemies.add(new Goomba(this.game, 2146, 2688, 'goomba', 0, 100, this.player));
    this.enemies.add(new Goomba(this.game, 2274, 2688, 'goomba', 0, 100, this.player));
    this.enemies.add(new Goomba(this.game, 4864, 2880, 'goomba', 0, -100, this.player));
    this.enemies.add(new Goomba(this.game, 5088, 2880, 'goomba', 0, 100, this.player));
    this.enemies.add(new Goomba(this.game, 4706, 2112, 'goomba', 0, -100, this.player));
    this.enemies.add(new Goomba(this.game, 4992, 2112, 'goomba', 0, 100, this.player));
    //Spinys
    this.enemies.add(new Spiny(this.game, 4576, 2432, 'spiny', 0, -100));
    this.enemies.add(new Spiny(this.game, 4704, 2432, 'spiny', 0, -100));
    this.enemies.add(new Spiny(this.game, 4832, 2432, 'spiny', 0, -100));
    this.enemies.add(new Spiny(this.game, 4960, 2432, 'spiny', 0, -100));
    this.enemies.add(new Spiny(this.game, 5088, 2432, 'spiny', 0, -100));
    //Plantas
    this.enemies.add(new Planta(this.game, 2434, 1568, 'plant', 5, 100, 5));
    this.enemies.add(new Planta(this.game, 3936, 1216, 'plant', 5, 100, 5));
    this.enemies.add(new Planta(this.game, 4736, 2688, 'plant', 5, 100, 5));
    this.enemies.add(new Planta(this.game, 5184, 1120, 'plant', 5, 100, 5));
    //Chomps
    this.enemies.add(new Chomp(this.game, 2912, 2848, 'chomp', 0, 50, 120, 300, 1, this.player, 150));
    this.enemies.add(new Chomp(this.game, 3968, 2382, 'chomp', 0, 50, 120, 300, 1, this.player, 150));
    this.enemies.add(new Chomp(this.game, 4960, 1312, 'chomp', 0, 50, 100, 300, 1, this.player, 150));
    this.enemies.add(this.boss.chomp);
    //Bloques
    this.blocksHandler = new Bloque(this.game);
    this.coinSpawner = new CoinS(this.game, 'coin');
    this.heartSpawner = new HeartS(this.game, 'heart', 3);
    this.superHeartSpawner = new HeartS(this.game, 'superHeart', 6);
    //Vidas
    this.vidas = this.game.add.sprite(this.game.width, 0, 'life', 0);
    this.vidas.anchor.setTo(1.5, -0.2);
    this.vidas.fixedToCamera = true;
    //Monedas
    this.coins = this.game.add.sprite(0, 0, 'coin', 0);
    this.coins.anchor.setTo(-0.5, -0.5);
    this.coins.fixedToCamera = true;
    this.textCoins = this.game.add.text(0, 0, this.player.coins, { font: "16px Arial", fill: "#ffffff", align: "center" });
    this.textCoins.anchor.setTo(-3.5, -0.3);
    this.textCoins.fixedToCamera = true;
    //Super monedas
    this.superCoins = this.game.add.sprite(0, 0, 'superCoin', 0);
    this.superCoins.anchor.setTo(-4, -0.5);
    this.superCoins.fixedToCamera = true;
    this.textSuperCoins = this.game.add.text(0, 0, this.player.superCoins, { font: "16px Arial", fill: "#ffffff", align: "center" });
    this.textSuperCoins.anchor.setTo(-9, -0.3);
    this.textSuperCoins.fixedToCamera = true;
    //Lunas
    this.ui = [];
    for (var i = 0; i < this.numMoons; i++) {
      this.ui[i] = this.game.add.sprite(21 * i, 21, 'UIMoons', 1);
      if (i >= this.minMoons)
        this.ui[i].frame = 2;
      this.ui[i].anchor.setTo(0, -0.5);
      this.ui[i].fixedToCamera = true;
    }
    //Pausa
    this.pause = false;
    this.pauseButton = false;
    this.pauseMenuOpen = false;
    //Fondo del menu
    this.pauseBackground = this.game.add.sprite(0, 0, 'pause');
    this.pauseBackground.visible = false;
    this.pauseBackground.fixedToCamera = true;
    //Botón Continue
    this.buttonContinue = this.game.add.button(0, 0, 'continue', Continue, this, 0, 2, 1);
    this.buttonContinue.scale.setTo(2, 2);
    this.buttonContinue.anchor.setTo(-0.6, -4);
    this.buttonContinue.visible = false;
    this.buttonContinue.fixedToCamera = true;

    function Continue() {
      this.pauseButton = false;
      this.pauseMenuOpen = false;
      this.level1Sound.resume();
    }
    //Botón Exit
    this.buttonExit = this.game.add.button(0, 0, 'exit', Exit, this, 0, 2, 1);
    this.buttonExit.scale.setTo(2, 2);
    this.buttonExit.anchor.setTo(-0.6, -5.2);
    this.buttonExit.visible = false;
    this.buttonExit.fixedToCamera = true;

    function Exit() {
      this.game.sound.stopAll();
      this.game.state.start('menu');
    }


  },
  update: function () {
    //Comprueba si se ha ganado
    if (!this.boss.alive && this.player.moons >= this.minMoons) {
      this.game.sound.stopAll();
      this.game.state.start('win');

    }
    else {
      //Menu pausa
      this.pausar.onDown.add(PauseMenu, this);
      function PauseMenu() {
        if (!this.pause && !this.pauseButton) {
          this.pauseButton = true;
          this.pauseMenuOpen = true;
        }
      }
      if (this.pauseMenuOpen) //Visible, sin sonido del nivel
      {
        this.pauseBackground.visible = true;
        this.buttonContinue.visible = true;
        this.buttonExit.visible = true;
        this.level1Sound.pause();
      }
      else //Desaparece y continua la canción
      {
        this.pauseBackground.visible = false;
        this.buttonContinue.visible = false;
        this.buttonExit.visible = false;
      }
      //Interfaz
      this.vidas.frame = this.player.life - 1;
      this.textCoins.setText(this.player.coins);
      this.textSuperCoins.setText(this.player.superCoins);
      //Colisiones de Mario con el mapa
      this.game.physics.arcade.collide(this.player, this.floor);
      this.game.physics.arcade.collide(this.player, this.collisions);
      this.game.physics.arcade.collide(this.player, this.deathZone, function (player) { player.Die(); });
      //Colisiones de Mario con los bloques
      this.game.physics.arcade.collide(this.player, this.blocks, function (player, tile) { player.scene.blocksHandler.HitBlock(player, tile); });
      this.game.physics.arcade.collide(this.player, this.coinBlocks, function (player, tile) { player.scene.blocksHandler.HitEspecialBlock(player, tile, player.scene.coinSpawner); });
      this.game.physics.arcade.collide(this.player, this.heartBlocks, function (player, tile) { player.scene.blocksHandler.HitEspecialBlock(player, tile, player.scene.heartSpawner); });
      this.game.physics.arcade.collide(this.player, this.superheartBlocks, function (player, tile) { player.scene.blocksHandler.HitEspecialBlock(player, tile, player.scene.superHeartSpawner); });
      //Colisiones de Cappy con el mapa
      this.game.physics.arcade.collide(this.player.cappy, this.floor);
      this.game.physics.arcade.collide(this.player.cappy, this.collisions);
      //Colisiones de objetos
      this.objects.forEach(
        function (item) {
          //Colisiones de Mario con objetos
          this.player.ObjectCollision(item);
          //Colisiones con el mapa
          this.game.physics.arcade.collide(item, this.floor);
          this.game.physics.arcade.collide(item, this.collisions);
          this.game.physics.arcade.collide(item, this.heartBlocks);
          this.game.physics.arcade.collide(item, this.superheartBlocks);
        }, this);
      //Colisiones de enemigos 
      this.enemies.forEach(
        function (item) {
          //Collisiones
          this.game.physics.arcade.collide(item, this.floor);
          this.game.physics.arcade.collide(item, this.collisions, function (enemy) { enemy.ChangeDir(); });
          this.game.physics.arcade.collide(item, this.deathZone, function (enemy) { enemy.Die(); });
          this.game.physics.arcade.collide(item, this.blocks, function (enemy, tile) { enemy.BlockCollision(enemy.player, tile); });
          this.game.physics.arcade.collide(item, this.coinBlocks, function (enemy, tile) { enemy.EspecialBlockCollision(tile, enemy.player.scene.coinSpawner); });
          this.game.physics.arcade.collide(item, this.heartBlocks, function (enemy, tile) { enemy.EspecialBlockCollision(tile, enemy.player.scene.heartSpawner); });
          this.game.physics.arcade.collide(item, this.superheartBlocks, function (enemy, tile) { enemy.EspecialBlockCollision(tile, enemy.player.scene.superHeartSpawner); });
          //Comportamiento de los enemigos
          if (item.alive) {
            item.Move();
            item.Attack(this.player);
            item.Hurt();
            if (item.inCamera) {
              var shot = item.Shoot(this.player);
              if (shot != undefined)
                this.shots.add(shot);
            }
          }
          //Colisiones con mario
          this.player.EnemyCollision(item);
          if (this.player.cappy != null) {
            this.player.cappy.Stunn(item);
            //Colisiones con cappy
            this.player.cappy.Capture(item, this);
          }
        }, this);

      //Bucle del juego
      if (!this.pause && !this.pauseButton) //Condiciones de pausa. Juego activo
      {
        //Andar
        if (this.teclas.right.isDown)
          this.player.Move(1);
        else if (this.teclas.left.isDown)
          this.player.Move(-1);
        else
          this.player.NotMoving();
        //Correr y rodar
        if (this.correr.isDown)
          this.player.running = true;
        else
          this.player.running = false;
        //Salto e impulso aereo
        if (this.saltar.isDown)
          this.player.Jump();
        if (this.teclas.up.isDown)
          this.player.Tackle();
        //Agacharse y salto bomba
        if (this.teclas.down.isDown) {
          this.player.Crouch();
          this.player.JumpBomb();
        }
        if (this.teclas.down.isUp)
          this.player.NotCrouching();
        //Lanzar a Cappy
        if (this.lanzar.isDown)
          this.player.ThrowCappy();
        else if (this.player.cappy != null)
          this.player.cappy.cappyHold = false;
        //Control de eventos de Mario
        this.player.body.gravity.y = 500; //Devuelve su gravedad
        this.player.CheckOnFloor();
        this.player.handleAnimations();
        //Control de eventos de Cappy
        if (this.player.cappy != null) {
          this.player.cappy.Check();
          this.player.cappy.Collision();
        }
        //Colisiones de Mario con disparos
        this.shots.forEach(
          function (item) {
            //Devuelve su movimiento
            if (item.body.velocity.x == 0 && item.body.velocity.y == 0) {
              item.body.velocity.x = item.VelX;
              item.body.velocity.y = item.VelY;
              item.animations.play(item.animName);
            }
            this.player.EnemyCollision(item);
            if (item.alive)
              item.RemoveShot();
          }, this);
      }
      //Pausa
      else {
        //Mario
        this.player.body.gravity.y = 0;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        this.player.animations.stop();
        //Cappy
        if (this.player.cappy != null) {
          this.player.cappy.body.velocity.x = 0;
          this.player.cappy.animations.stop();
        }
        //Goombas
        this.enemies.forEach(
          function (item) {
            if (item.alive) {
              item.body.velocity.x = 0;
              item.body.velocity.y = 0;
              item.animations.stop();
            }
          }, this);
        //Disparos
        this.shots.forEach(
          function (item) {
            //Guarda su dirección
            if (item.body.velocity.x != 0 || item.body.velocity.y != 0) {
              item.VelX = item.body.velocity.x;
              item.VelY = item.body.velocity.y;
            }
            item.body.velocity.x = 0;
            item.body.velocity.y = 0;
            item.animations.stop();
          }, this);

      }
    }
  }
}
module.exports = PlayScene;
