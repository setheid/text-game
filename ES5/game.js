'use strict';

var angular = require('angular');

let game = angular.module('game', []);

let hero, frog, counter = 0, progress = 0;
game.controller('gameCtrl', function() {
  let textBeginning = 'You stumble out of the woods onto the bank of a pond. LEFT, along the water you see a bottle; to the RIGHT there is a stick and a fog bank slowly rolling in; BACK behind you is the forest. Where will you go?';
  this.text = 'What is your name?';
  this.action = '';

  this.init = function() {
    this.text = textBeginning;
    this.hero = new Hero(this.action);
    console.log(this.hero);
    this.action = '';
  }

  this.frogEncounter = function() {
    counter += 1;
    this.frog = new GiantFrog();
    console.log(this.frog.type, this.frog);
    if (this.hero.item !== 'None') {
      this.text = `A giant frog emerges from the pond. You have a ${this.hero.item}. You can USE the ${this.hero.item} against the giant frog or try to RUN away. What will you do?`;
      return this.action = '';
    } else {
      this.text = `A giant frog emerges from the pond. You have nothing but your bare hands. You can try to FIGHT the giant frog or RUN away. What will you do?`;
      return this.action = '';
    }
  }

  this.execute = () => {
    let action = this.action.toUpperCase();
    if (action === 'BACK') {
      this.hero.hp = 0;
      this.text = 'You have been attacked and eaten by wolves. You had no chance of survival.';
      return this.action = '';
    }
    if (!this.frog && counter === 2) {
      return this.frogEncounter();
    }
    if (action === 'LEFT') {
      counter += 1;
      progress += 1;
      if (progress === 0) {
        this.text = 'You are back where you started. You can go LEFT, RIGHT, or BACK. Where will you go?';
      } else if (progress === 1) {
        this.text = 'There is a BOTTLE at your feet. You can TAKE the BOTTLE if you wish or keep walking. The woods are still BACK behind you; there is a path further LEFT along the water; and the stick is still laying by the pond to the RIGHT. What will you do?';
      } else if (progress === 2) {
        this.text = 'The path is just ahead of you now. The air feels warmer here and you catch the scent of grass and flowers. Will you go FORWARD or BACK?';
      }
    }
    if (action === 'RIGHT') {
      counter += 1;
      progress -= 1;
      if (progress === 0) {
        this.text = 'You are back where you started. You can go LEFT, RIGHT, or BACK. Where will you go?';
      } else if (progress === -1) {
        this.text = 'The STICK is laying at your feet. You can TAKE the STICK, go RIGHT into the fog, LEFT to return to where you were, or BACK into the woods. Where will you go?';
      } else if (progress === -2) {
        this.frogEncounter();
      }
    }
    if (action === 'TAKE STICK') {
      counter += 1;
      this.hero.item = 'STICK';
      this.hero.damage += 50;
      this.text = 'You grasp the stick in your hands and feel a little more confident. You can go BACK, LEFT, or RIGHT. What will you do now?';
    }
    if (action === 'TAKE BOTTLE') {
      counter += 1;
      this.hero.item = 'POTION';
      this.text = 'You pick up the bottle and find that it has strange writting on it. It must be some kind of magic potion. You can go BACK, LEFT, or RIGHT. Where will you go?';
    }
    if (action === 'FIGHT') {
      fight(this.hero, this.frog);
      console.log(this.hero);
      this.text = `You hit ${this.frog.name} for ${this.hero.damage} damage. ${this.frog.name} hits you for ${this.frog.damage} damage. ${this.hero.hp <= 0 ? 'You have been slain.' : 'You have killed ' + this.frog.name + '!'}`;
    }
    if (action === 'USE STICK' || action === 'USE POTION') {
      counter += 1;
      if (this.hero.item === 'STICK') {
        fight(this.hero, this.frog);
        console.log(this.frog);
        this.text = `You hit ${this.frog.name} for ${this.hero.damage} damage. ${this.frog.name} hits you for ${this.frog.damage} damage. You have been slain.`;
      } else if (this.hero.item === 'POTION') {
        this.hero.item = 'None';
        this.frog = new Frog();
        fight(this.hero, this.frog);
        console.log(this.frog);
        this.text = `When the puff of smoke clears all you see is ${this.frog.name}. It hits you for ${this.frog.damage} damage. You kick it for ${this.hero.damage} damage. The frog is dead. Will you walk on the PATH or go BACK?`;
      }
    }
    if (action === 'PATH') {
      this.text = 'You start down a path that leads into a meadow. There are lights in the distance. You are now safe.'
    }
    if (action === 'RUN') {
      this.hero.hp = 0;
      this.text = `You start to run, but ${this.frog.name} shoots out its tongue. It hits you and pulls you back. You fall to the ground in front of the ${this.frog.type}. He jumps on you and you die.`
    }

    return this.action = '';
  }

  this.restart = function() {
    delete this.frog;
    this.hero = new Hero(this.hero.name);
    this.text = textBeginning;
    this.action = '';
    counter = 0;
    progress = 0;
  }
});

function fight(h, e) {
  h.attack(e);
  e.attack(h);
}

function Character(name, damage, hp) {
  this.name = name;
  this.damage = damage;
  this.hp = hp;
  this.checkLife = () => {
    this.isAlive = (this.hp >= 1);
  }
}

function Hero(name) {
  Character.call(this, name, 50, 100);
  this.item = 'None';
  this.checkLife();
}

function GiantFrog() {
  Character.call(this, 'Grog the Frog', 100, 300);
  this.checkLife();
}

function Frog() {
  Character.call(this, 'a small ugly frog', 2, 10);
  this.type = 'frog';
}

Hero.prototype = new Character();
Frog.prototype = new Character();
GiantFrog.prototype = new Frog();

Character.prototype.attack = function(character) {
  character.takeDamage(this.damage);
}

Character.prototype.takeDamage = function(damage) {
  this.hp -= damage;
  this.checkLife();
}
