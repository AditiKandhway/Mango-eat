//const phaserMin = require("./phaser.min");

let config = {
    type:Phaser.AUTO,
    
    scale:{
        mode:Phaser.Scale.FIT,
        width : 1280,
        height :600,
    },
    
    backgroundColor : 0x87cefa,

    physics:{
        default:'arcade',
        arcade:{
            gravity:{
               y:1000,
            }
        }
    },
    scene : {
        preload:preload,
        create : create,
        update : update,
       }
   };

   let game = new Phaser.Game(config);

   let player_config={
       player_speed:150,
       player_jumpspeed:-700,
   }

   function preload()
   {
        this.load.image('ground','../images/Tileset_ground_0.png');
        this.load.image('background','../images/GameBackground_1.png');
        this.load.image('mango','../images/mango.png');
        this.load.spritesheet('dude','../images/dude.png',{frameWidth:32,frameHeight:48});
        this.load.image('ray','../images/ray.png');
   }
   
   function create()
   {
       let w=game.config.width;
       let h=game.config.height;
         let topground=this.add.tileSprite(0,h-128,w,128,'ground');
         topground.setOrigin(0,0);
         let background=this.add.sprite(w/2,h/2,'background');
         background.setScale(5);
//background.displayWidth=w;
         background.depth=-2;
         

         let rays = [];

         for(let i=-10;i<=10;i++)
         {
             let ray=this.add.sprite(w/2,h-100,'ray');
             ray.displayHeight=1.2*h;
             ray.setOrigin(0.5,1);
             ray.alpha=0.5;
             ray.angle=i*20;
             ray.depth=-1;
             rays.push(ray);
         }
           

         this.tweens.add({
             targets:rays,
             props:{
                 angle:{
                     value:"+=20",
                 },
             },
             duration:8000,
             repeat:-1
         });

         this.player=this.physics.add.sprite(100,100,'dude',4);
         this.player.setBounce(0.5);

         this.player.setCollideWorldBounds(true);

      this.anims.create({
          key:'left',
          frames:this.anims.generateFrameNumbers('dude',{start:0,end:3}),
          frameRate:10,
          repeat:-1
      });

      this.anims.create({
        key:'center',
        frames:[{key:'dude',frame:4}],
        frameRate:10,
    });

      this.anims.create({
        key:'right',
        frames:this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate:10,
        repeat:-1
    });


           this.cursors=this.input.keyboard.createCursorKeys();

         let fruits= this.physics.add.group({
             key:"mango",
             repeat:12,
             setScale:{x:0.02,y:0.02},
             setXY:{x:10,y:0,stepX:100},
         });

         fruits.children.iterate(function(f)
         {
             f.setBounce(Phaser.Math.FloatBetween(0.4,0.7));
         })

       //  this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' },this);

         
         let platform=this.physics.add.staticGroup();
         platform.create(550,350,'ground').setScale(1.5,0.5).refreshBody();
         platform.create(700,150,'ground').setScale(1.5,0.5).refreshBody();
         platform.create(200,200,'ground').setScale(1.5,0.5).refreshBody();
         platform.create(1150,350,'ground').setScale(1.5,0.5).refreshBody();
         platform.add(topground);
         this.physics.add.existing(topground,true);
        // topground.body.allowGravity=false;
       //  topground.body.immovable=true;

         this.physics.add.collider(platform,this.player);
       //  this.physics.add.collider(topground,fruits);

         this.physics.add.collider(platform,fruits);

         this.physics.add.overlap(this.player,fruits,eatFruit,null,this);

         this.cameras.main.setBounds(0,0,w,h);
         this.physics.world.setBounds(0,0,w,h);

         this.cameras.main.startFollow(this.player,true,true);
         this.cameras.main.setZoom(1.2);


   }
   
   function update()
   {
        if(this.cursors.left.isDown)
        {
            this.player.setVelocityX(-player_config.player_speed);
            this.player.anims.play('left',true);
        }
        else if(this.cursors.right.isDown)
        {
            this.player.setVelocityX(player_config.player_speed);
            this.player.anims.play('right',true);
        }
        else{
            this.player.setVelocityX(0);
            this.player.anims.play('center');
        }

        if(this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(player_config.player_jumpspeed);
        }
   }

   function eatFruit(player,fruit)
   {
        fruit.disableBody(true,true);
       
   }