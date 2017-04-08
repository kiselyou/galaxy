    /**
     *
     * @constructor
     */
    THREE.ExplosionControls = function () {

        var gui = new dat.GUI();

        var group = null;
        var group2 = null;
        var shockwaveGroup = null;
        var fireball = null;






        group = new SPE.Group( {
            texture: {
                value: THREE.ImageUtils.loadTexture( '/web/images/effects/sprite-explosion2.png' ),
                frames: new THREE.Vector2( 5, 5 ),
                loop: 1
            },
            depthTest: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            scale: 600
        } );

        shockwaveGroup = new SPE.Group( {
            texture: {
                value: THREE.ImageUtils.loadTexture( '/web/images/effects/smokeparticle.png' )
            },
            depthTest: false,
            depthWrite: true,
            blending: THREE.NormalBlending
        } );

        var shockwave = new SPE.Emitter( {
            particleCount: 200,
            type: SPE.distributions.DISC,
            position: {
                radius: 5,
                spread: new THREE.Vector3( 5 )
            },
            maxAge: {
                value: 2,
                spread: 0
            },
            // duration: 1,
            activeMultiplier: 2000,
            velocity: {
                value: new THREE.Vector3( 40 )
            },
            rotation: {
                axis: new THREE.Vector3( 1, 0, 0 ),
                angle: Math.PI * 0.5,
                static: true
            },
            size: { value: 2 },
            color: {
                value: [
                    new THREE.Color( 0.4, 0.2, 0.1 ),
                    new THREE.Color( 0.2, 0.2, 0.2 )
                ]
            },
            opacity: { value: [0.5, 0.2, 0] }
        });

        var debris = new SPE.Emitter( {
            particleCount: 100,
            type: SPE.distributions.SPHERE,
            position: {
                radius: 0.1
            },
            maxAge: {
                value: 2
            },
            // duration: 2,
            activeMultiplier: 40,
            velocity: {
                value: new THREE.Vector3( 100 )
            },
            acceleration: {
                value: new THREE.Vector3( 0, -20, 0 ),
                distribution: SPE.distributions.BOX
            },
            size: { value: 2 },
            drag: {
                value: 1
            },
            color: {
                value: [
                    new THREE.Color( 1, 1, 1 ),
                    new THREE.Color( 1, 1, 0 ),
                    new THREE.Color( 1, 0, 0 ),
                    new THREE.Color( 0.4, 0.2, 0.1 )
                ]
            },
            opacity: { value: [0.4, 0] }
        });

        fireball = new SPE.Emitter( {
            particleCount: 20,
            type: SPE.distributions.DISC,
            position: {
                radius: 1
            },
            maxAge: { value: 2 },
            // duration: 1,
            activeMultiplier: 20,
            velocity: {
                value: new THREE.Vector3( 10 )
            },
            size: { value: [50, 200] },
            color: {
                value: [
                    new THREE.Color( 0.5, 0.1, 0.05 ),
                    new THREE.Color( 0.2, 0.2, 0.2 )
                ]
            },
            opacity: { value: [0.5, 0.35, 0.1, 0] }
        });

        var mist = new SPE.Emitter( {
            particleCount: 50,
            position: {
                spread: new THREE.Vector3( 10, 10, 10 ),
                distribution: SPE.distributions.SPHERE
            },
            maxAge: { value: 2 },
            // duration: 1,
            activeMultiplier: 2000,
            velocity: {
                value: new THREE.Vector3( 8, 3, 10 ),
                distribution: SPE.distributions.SPHERE
            },
            size: { value: 40 },
            color: {
                value: new THREE.Color( 0.2, 0.2, 0.2 )
            },
            opacity: { value: [0, 0, 0.2, 0] }
        });

        var flash = new SPE.Emitter( {
            particleCount: 50,
            position: { spread: new THREE.Vector3( 5, 5, 5 ) },
            velocity: {
                spread: new THREE.Vector3( 30 ),
                distribution: SPE.distributions.SPHERE
            },
            size: { value: [2, 20, 20, 20] },
            maxAge: { value: 2 },
            activeMultiplier: 2000,
            opacity: { value: [0.5, 0.25, 0, 0] }
        } );

        group.addEmitter( fireball ).addEmitter( flash );
        shockwaveGroup.addEmitter( debris ).addEmitter( mist );


        shockwaveGroup.mesh.position.setX( 75 );
        shockwaveGroup.mesh.position.setY( 70 );
        shockwaveGroup.mesh.position.setZ( -250 );


        group.mesh.position.setX( 75 );
        group.mesh.position.setY( 70 );
        group.mesh.position.setZ(-250);

        group2 = group.mesh.clone();
        group2.position.setX( -75 );
        group2.position.setY( 70 );
        group2.position.setZ(-250);

        // model.children[0].add( shockwaveGroup.mesh );
        // model.children[0].add( group.mesh );
        // model.children[0].add( group2 );



        var m = gui.addFolder( 'Fire Ball' );

        m.add( fireball, 'particleCount', 1.0, 80.0, 1.0 ).name( 'Particle Count' ).onChange( changeGui );
        m.add( fireball, 'type', [ 'SPHERE', 'BOX', 'DISC' ]).name( 'Type' ).onChange( changeGui );

        var r = gui.addFolder( 'Position' );
        r.add( fireball.position, 'radius', 0, 1, 0.01).name( 'Radius' ).onChange( changeGui );

        var a = gui.addFolder( 'Age' );
        a.add( fireball.maxAge, 'value', 1, 10, 0.5).name( 'Value' ).onChange( changeGui );

        var mp = gui.addFolder( 'Multiplier' );
        mp.add( fireball, 'activeMultiplier', 1, 100, 1).name( 'Active Multiplier' ).onChange( changeGui );

        var v = gui.addFolder( 'Velocity' );
        v.add( fireball.velocity.value, 'x', 1, 100, 1).name( 'value_X' ).onChange( changeGui );
        // v.add( fireball.velocity.value, 'y', 1, 100, 1).name( 'value-Y' ).onChange( changeGui );
        // v.add( fireball.velocity.value, 'z', 1, 100, 1).name( 'value-Z' ).onChange( changeGui );

        // var s = gui.addFolder( 'Size' );
        // s.add( fireball.size.value, 0, 1, 100, 1).name( 'size - X' ).onChange( changeGui );
        // s.add( fireball.size.value, 1, 1, 100, 1).name( 'size - Y' ).onChange( changeGui );

        function changeGui(e) {
            switch (e) {
                case 'SPHERE':
                    fireball.type = SPE.distributions.SPHERE;
                    break;
                case 'BOX':
                    fireball.type = SPE.distributions.BOX;
                    break;
                case 'DISC':
                    fireball.type = SPE.distributions.DISC;
                    break;
            }
        }
    };