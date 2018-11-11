'use strict';
var Cappy = require('./Cappy.js');

function Mario(game,x,y,name,cappyName)
{
    this.cappy=null;
    this.cappyName=cappyName;
    this._cappyTime=0.5;
    this._cappyTimer=0;
    this._cappyHoldTime=3;
    this._cappyStopTime=1;
    this._cappyStopTimer=0;
    this._cappyHoldTimer=0;
    this._cappyCooldown=1;
    this._cappyCooldownTimer=0;
    this.cappyCapture=false

    this._life=3;

    this._velocity=200;
    this._facing=1; //1 derecha, -1 izquierda

    this._jumpVelocity=400;
    this._tackles=0;

    this.hurtTime=1;
    this.hurtTimer=0;
    this._hurt=false
    
    this._bombJump=false;
    this._tackling=false;
    this._swimming=false;
    this._crouching=false;
    this._moving=false;

    this._thrown=false;
    this._cappyStopped=false;
    this._cappyReturning=false;
    this._cappyHold=false;

    this._spawnX=x;
    this._spawnY=y;

    this.enemyType;

    Phaser.Sprite.call(this,game,x,y,name);
    this.scale.setTo(2,2);
    this.game.world.addChild(this);

    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = 400;

    this.frame=5;
    this.animations.add('runLeft',[4,3,2],8,true);
    this.animations.add('runRight',[5,6,7],8,true);
    this.animations.add('jumpLeft',[1],10,false);
    this.animations.add('jumpRight',[8],10,false);
    this.animations.add('idleLeft',[4],10,false);
    this.animations.add('idleRight',[5],10,false);
    this.animations.add('crouchLeft',[0],10,false);
    this.animations.add('crouchRight',[9],10,false);
    this.animations.add('tackleLeft',[23],10,false);
    this.animations.add('tackleRight',[26],10,false);
    this.animations.add('swimLeft',[24,23,22],8,true);
    this.animations.add('swimRight',[35,36,37],8,true);
    this.animations.add('bombLeft',[12],10,false);
    this.animations.add('bombRight',[17],10,false);
    this.animations.add('hurtingLeft',[16,4],8,true);
    this.animations.add('hurtingRight',[16,5],8,true);
}
Mario.prototype=Object.create(Phaser.Sprite.prototype);
Mario.constructor=Mario;

Mario.prototype.checkOnFloor=function()
{
    if(this.body.onFloor())
    {
        this._tackling=false;
        this._bombJump=false;
    }
}
Mario.prototype.Move=function(dir)
{
    this._facing=dir;
    if(!this.cappyCapture)
    {
        if(!this._bombJump) //en el salto bomba no hay movimiento
        {
            this._moving=true;
            if(!this._crouching) //si no esta agachado se mueve normal
                this.body.velocity.x=this._facing*this._velocity;
            else //si esta agachado la velocidd es n tercios de la original
                this.body.velocity.x=this._facing*(this._velocity/3);
        }
    }
    else
    {
        switch(this.enemyType)
        {
            case(0):
                this.body.velocity.x=this._facing*this._velocity;
            break;
       }
    }
    this.handleAnimations();
}
Mario.prototype.NotMoving=function()
{
    if(!this.cappyCapture)
    {
        this.body.velocity.x=0;    
        this._moving=false;
        this.handleAnimations();
    }
    else
    {
        switch(this.type)
        {
            case(0):
                this.body.velocity.x=0;
            break;
        } 
    }
}
Mario.prototype.Jump=function()
{
    if(!this.cappyCapture)
    {
        if(this.body.onFloor()&&!this._crouching) //si esta en el suelo y no esta agachado puede saltar
        {   
            this._swimming=false;
            this.game.physics.arcade.gravity.y=400;

            this._tackles=1;
            this.body.velocity.y=-this._jumpVelocity;

            this.handleAnimations();            
        }
    }
    else 
    {
        switch(this.type)
        {
            case(0):
            if(this.body.onFloor())
                this.body.velocity.y=-this._jumpVelocity/2;
            break;
        } 
    }
}
Mario.prototype.Tackle=function()
{
    if(!this.cappyCapture)
    {
        if(!this.body.onFloor()&&this._tackles>0)
        {    
            this.body.velocity.y=-this._jumpVelocity/2;
            this.body.velocity.x=this._facing*(this._velocity/2);

            this._tackles--;
            this._tackling=true;

            this.handleAnimations();
        }
    }
    else 
    {
        switch(this.type)
        {
            case(0):
            break;
        }
    }
}
Mario.prototype.Crouch=function()
{
    if(!this.cappyCapture)
    {
        if(!this._swimming) //solo puede agacharse o hacer salto bomba si no esta nadando
        {
            if(this.body.onFloor())
            {
                this._crouching=true;
            }
            else
            {
                this.body.velocity.y=600;
                this.body.velocity.x=0;
                this._tackles=0;
                this._bombJump=true;  
            }
            this.handleAnimations();
        }
    }
    else 
    {
        switch(this.type)
        {
            case(0):
            break;
        }
    }
}
Mario.prototype.NotCrouching=function()
{
    this._crouching=false;
}
Mario.prototype.Swim=function()
{
    if(!this.cappyCapture)
    {
        this._swimming=true;
        this.game.physics.arcade.gravity.y=600;

        if(this.body.velocity.y>= 0)
        {     
            this.body.velocity.y=-200;
        }
    }
    else 
    {
        switch(this.type)
        {
            case(0):
            break;
        }
    }
    this.handleAnimations();
}
Mario.prototype.CappyReset=function()
{
    this._cappyStopped=false;
    this._thrown=false;
    this._cappyReturning=false;
    this.cappy.destroy();
}
Mario.prototype.ThrowCappy=function()
{
    if(!this.cappyCapture)
    {
        if(!this._thrown && this.game.time.totalElapsedSeconds()>this._cappyCooldownTimer && !this._crouching && !this._tackling && !this._bombJump)
        {     
            this.cappy=new Cappy(this.game,this.body.x,this.body.y,this.cappyName,this._facing);
            this.cappy.Throw();
            this._thrown=true;
            this._cappyHold=true;
            this._cappyTimer=this.game.time.totalElapsedSeconds()+this._cappyTime;
        }
    }
    else
    {
        this.cappyCapture=false;
    }
}
Mario.prototype.CheckCappy=function()
{
    if(this._thrown && !this._cappyStopped)
    {
        if(this.game.time.totalElapsedSeconds()>this._cappyTimer)
        {
            this.cappy.Stop();
            this._cappyStopped=true;  
            this._cappyHoldTimer=this.game.time.totalElapsedSeconds()+this._cappyHoldTime;          
            this._cappyStopTimer=this.game.time.totalElapsedSeconds()+this._cappyStopTime;
        }
    }
    else if(this._cappyStopped)
    {
        if((this._cappyHold && this.game.time.totalElapsedSeconds()>this._cappyHoldTimer) ||(!this._cappyHold && this.game.time.totalElapsedSeconds()>this._cappyStopTimer))
        {
            this.game.physics.arcade.moveToObject(this.cappy,this,500);
            this._cappyReturning=true;
        }
    }
}
Mario.prototype.CappyCollision=function()
{
    if(this.game.physics.arcade.overlap(this.cappy,this) && this._cappyReturning)
    {        
        this.CappyReset();

        this._cappyCooldownTimer=this.game.time.totalElapsedSeconds()+this._cappyCooldown;
    }
    else if(this.game.physics.arcade.overlap(this.cappy,this) && this._cappyStopped)
       { 
           this.body.velocity.y=-this._jumpVelocity;
           this._tackling=false;
           this._tackles=1; 
       }

    }

Mario.prototype.CappyReleased=function()
{
    this._cappyHold=false;
}

Mario.prototype.CappyCapture=function(enemy)
{
    if(this.game.physics.arcade.overlap(enemy,this.cappy))
    {
        this.CappyReset()
        this.cappyCapture=true;
        this.enemyType=enemy.type;
        this.reset(enemy.body.position.x,enemy.body.position.y);
        enemy.kill();
    }
}

Mario.prototype.EnemyCollision=function(enemy)
{
    if(this.game.physics.arcade.overlap(enemy,this)&&!this._hurt)
        this.Hurt();
    if(this.game.time.totalElapsedSeconds()>this.hurtTimer)
        this._hurt=false;
}

Mario.prototype.Die=function()
{
    this.reset(this._spawnX,this._spawnY);
    this._life=3;
    
}

Mario.prototype.Hurt=function()
{
    if(this._life>1)
    {
        this._life--;
        this._hurt=true;
        this.hurtTimer=this.game.time.totalElapsedSeconds()+this.hurtTime;
    }
    else
        this.Die();
}
Mario.prototype.handleAnimations=function()
{
    if(this._facing==1) //animaciones Derecha
    {
        if(this._swimming) //animaciones cuando esta nadando
            this.animations.play('swimRight');
        else if(this._hurt)
            this.animations.play('hurtingRight');
        else if(this.body.onFloor()) //animaciones cuando esta en el suelo
        {
            this._bombJump=false;
            if(this._crouching)
                this.animations.play('crouchRight');
            else if(this._moving)
                this.animations.play('runRight');
            else
                this.animations.play('idleRight');
        }
        else //animaciones cuando esta en el aire
        {
            if(this._bombJump)
                this.animations.play('bombRight');
            else if(this._tackling)
                this.animations.play('tackleRight');
            else
                this.animations.play('jumpRight');
        }
    }
    else //animaciones Izquierda
    {
        if(this._swimming)
            this.animations.play('swimLeft');
        else if(this._hurt)
            this.animations.play('hurtingLeft');
        else if(this.body.onFloor())
        {
            this._bombJump=false;
            if(this._crouching)
                this.animations.play('crouchLeft');
            else if(this._moving)
                this.animations.play('runLeft');
            else
                this.animations.play('idleLeft');
        }
        else
        {
            if(this._bombJump)
                this.animations.play('bombLeft');  
            else if(this._tackling)
                this.animations.play('tackleLeft');
            else
                this.animations.play('jumpLeft');
                
        }
    }
}

module.exports=Mario;
