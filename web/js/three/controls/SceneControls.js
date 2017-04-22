    var IW = IW || {};
    /**
     *
     * @param {IW.MultiLoader} multiLoader
     * @param {string} idElement
     * @param {boolean} [lock]
     * @constructor
     */
    IW.SceneControls = function ( multiLoader, idElement, lock ) {
        /**
         *
         * @type {IW.MultiLoader}
         */
        this.multiLoader = multiLoader;
        this.mapSize = {
            width: 100000,
            height: 100000,
            depth: 100000
        };

        /**
         *
         * @type {boolean}
         * @private
         */
        this._lock = lock;

        /**
         *
         * @type {Scene}
         */
        this.scene = new THREE.Scene();

        /**
         *
         * @type {Element}
         */
        this.container = document.getElementById( idElement );

        /**
         *
         * @type {WebGLRenderer}
         */
        this.renderer = new THREE.WebGLRenderer();

        /**
         *
         * @type {PerspectiveCamera}
         */
        this.camera = new THREE.PerspectiveCamera();

        /**
         *
         * @type {IW.SceneControls}
         */
        var scope = this;

        var flyControls = null;

        window.addEventListener( 'resize', windowResize, false );
        document.addEventListener( 'contextmenu', contextMenu, false );
        document.addEventListener( 'keydown', keyDown, false );

        /**
         *
         * @param {IW.MultiLoader} multiLoader
         * @returns {IW.SceneControls}
         */
        this.initFlyControl = function ( multiLoader ) {

            // flyControls = new IW.FlyControls( scope.scene, multiLoader, scope.camera, scope.renderer.domElement );
            // flyControls.initOrbitControl();
            // flyControls.initPanel();
            return this;
        };

        /**
         *
         * @returns {Number}
         */
        this.getWidth = function() {
            return window.innerWidth;
        };

        /**
         *
         * @returns {Number}
         */
        this.getHeight = function() {
            return window.innerHeight;
        };

        /**
         *
         * @returns {number}
         */
        this.getAspect = function() {
            return  this.getWidth() / this.getHeight();
        };

        /**
         *
         * @type {?Mesh}
         * @private
         */
        var _map = null;

        /**
         *
         * @param {{path: string, names: Array, extension}} map
         * @returns {IW.SceneControls}
         */
        this.map = function ( map ) {

            var materials = [];

            for ( var i = 0; i < map.names.length; i++ ) {

                var texture = scope.multiLoader.getTexture( map.names[ i ] );
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(5, 5);

                var material = new THREE.MeshBasicMaterial();
                material.map = texture;
                material.side = THREE.BackSide;
                materials.push( material );
            }

            _map = new THREE.Mesh( new THREE.BoxGeometry( scope.mapSize.width, scope.mapSize.height, scope.mapSize.depth, 0.1, 0.1, 0.1 ), new THREE.MultiMaterial( materials ) );
            scope.scene.add( _map );

            return this;
        };

        this.model = null;

        var socket = null;

        /**
         *
         * @returns {void}
         */
        this.initScene = function () {

            socket = new IW.SocketControls( _WS_URI );
console.log(socket);
            socket.connect( function ( url, session ) {

                console.log(session);

                socket.findData( function ( data ) {
console.log(data);
                    if ( data.hasOwnProperty( 'model' ) ) {

                        scope.model = scope.multiLoader.getObject( data.model.name );
                        scope.scene.add( scope.model );

                        var shot = new IW.ShotControls( scope.model, scope.multiLoader, scope.scene );
                        flyControls = new IW.FlyControls( scope.model, shot, scope.camera, scope.renderer.domElement );
                        flyControls.initPanel();
                        scope.initOrbitControl();

                        scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
                        scope.container.appendChild( scope.renderer.domElement );

                        initCamera();
                        initLight();
                        render();
                    }
                    return null;
                }, 'init');
            } );


            // scope.model = scope.multiLoader.getObject( 'S1_A' );
            // scope.scene.add( scope.model );
            //
            // var shot = new IW.ShotControls( scope.model, scope.multiLoader, scope.scene );
            // flyControls = new IW.FlyControls( scope.model, shot, scope.camera, scope.renderer.domElement );
            // flyControls.initPanel();
            // scope.initOrbitControl();
            //
            // scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
            // scope.container.appendChild( scope.renderer.domElement );
            //
            // initCamera();
            // initLight();
            // render();

            socket.disconnected( function ( error ) {
                console.log( error );
            } );
        };

        /**
         *
         * @type {?(THREE.OrbitControls)}
         */
        var orbitControl = null;

        /**
         *
         * @returns {IW.SceneControls}
         */
        this.initOrbitControl = function () {

            orbitControl = new THREE.OrbitControls( scope.camera, scope.renderer.domElement );
            orbitControl.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
            orbitControl.enablePan = false;
            orbitControl.enableKeys = false;
            orbitControl.rotateSpeed = 2.0;
            orbitControl.minDistance = 50;
            orbitControl.maxDistance = 250;
            orbitControl.maxPolarAngle = 75 * Math.PI / 180;
            orbitControl.minPolarAngle = 45 * Math.PI / 180;
            return this;
        };

        this.showGridHelper = function (flag) {
            if (flag !== false) {
                var color = new THREE.Color( 0xCCCCCC );
                var grid = new THREE.GridHelper( 6500, 50, color, 0x666666 );
                scope.scene.add( grid );
            }
        };

        var clock = new THREE.Clock();

        /**
         *
         * @returns {void}
         */
        function render() {
            requestAnimationFrame( render );

            var delta = clock.getDelta();

            if ( flyControls ) {
                flyControls.update( delta );
            }

            if ( _map ) {
                _map.position.copy( scope.model.position );
            }

            if (orbitControl) {
                orbitControl.stopMoveCamera();
                orbitControl.target.copy( scope.model.position );
                orbitControl.update();
            }

            scope.renderer.render( scope.scene, scope.camera );
        }

        /**
         *
         * @returns {void}
         */
        function initCamera() {

            scope.camera.position.x = 0;
            scope.camera.position.z = - 350;
            scope.camera.position.y = 150;
            scope.camera.fov = 45;
            scope.camera.near = 0.01;
            scope.camera.far = Math.sqrt( scope.mapSize.width * scope.mapSize.width + scope.mapSize.height * scope.mapSize.height );
            scope.camera.aspect = scope.getAspect();
            scope.camera.lookAt( scope.scene.position );
            scope.camera.updateProjectionMatrix();
        }

        function initLight() {
            var light = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 1 );
            light.position.set( 0, 1000, 0 );
            scope.scene.add( light );
        }

        /**
         *
         * @returns {void}
         */
        function windowResize () {
            scope.camera.aspect = scope.getAspect();
            scope.camera.updateProjectionMatrix();
            scope.renderer.setSize( scope.getWidth(), scope.getHeight() );
        }

        /**
         *
         * @returns {void}
         */
        function contextMenu( e ) {
            if ( scope._lock ) {
                e.preventDefault();
            }
        }

        /**
         *
         * @returns {void}
         */
        function keyDown( e ) {

            switch ( e.which ) {
                case 123:
                    if ( scope._lock ) {
                        e.preventDefault();
                    }
                    break;
                case 122:
                    if ( scope._lock ) {
                        e.preventDefault();
                    }
                    break;
            }
        }

        /**
         *
         * @param {number} value (0 - 1)
         * @returns {IW.SceneControls}
         */
        this.setOpacity = function ( value ) {
            this.container.style.opacity = value;
            return this;
        }
    };

    // CITIES
    IW.SceneControls.MODEL_G1_A = 'G1_A';
    // SHIPS
    IW.SceneControls.MODEL_S1_A = 'S1_A';
    IW.SceneControls.MODEL_S1_B = 'S1_B';
    IW.SceneControls.MODEL_S1_C = 'S1_C';
    IW.SceneControls.MODEL_S1_D = 'S1_D';

    // ROCKETS
    IW.SceneControls.MODEL_R1_A = 'R1_A';
    IW.SceneControls.MODEL_R1_B = 'R1_B';
    IW.SceneControls.MODEL_R1_C = 'R1_C';
