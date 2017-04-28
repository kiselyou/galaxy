var IW = IW || {};

/**
 *
 * @param {IW.MultiLoader} multiLoader
 * @param {IW.Model} model
 * @param {IW.ModelShot} shot
 * @constructor
 */
IW.PanelControls = function ( multiLoader, model, shot ) {

    /**
     *
     * @type {IW.Model}
     */
    this.model = model;

    /**
     *
     * @type {IW.ModelShot}
     */
    this.modelShot = shot;

    /**
     *
     * @type {IW.PanelAction}
     */
    this.panelAction = new IW.PanelAction();

    /**
     *
     * @type {IW.PanelMap}
     */
    this.panelMap = new IW.PanelMap();

    /**
     *
     * @type {{}}
     */
    this.actionConfig = multiLoader.getFile(IW.PanelControls.CONFIG_ACTION);

    /**
     *
     * @type {IW.PanelControls}
     */
    var scope = this;

    /**
     * This method show panel map
     *
     * @returns {IW.PanelControls}
     */
    this.initPanelMap = function () {
        this.panelMap.appendMapTo();
        return this;
    };

    /**
     * This method show panel action and add actions
     *
     * @returns {IW.PanelControls}
     */
    this.initPanelAction = function () {
        for ( var action in this.actionConfig ) {
            if ( this.actionConfig.hasOwnProperty( action ) ) {

                var actions = this.actionConfig[ action ];

                for (var i = 0; i < actions.length; i++) {
                    setActionShot( actions[ i ], action );
                }
            }
        }


        this.panelAction.addProgress( 1, 'energy', this.model.getMaxEnergy(), this.model.getReductionEnergy(), '#FF9900' );
        this.panelAction.addProgress( 2, 'armor', 4000, 20, '#008AFA' );
        this.panelAction.addProgress( 3, 'hull', 1000, 10, '#C10020' );
        this.panelAction.addProgress( 4, 'speed', this.model.getMaxSpeed(), 0, '#FFFFFF' );

        this.panelAction.addCallback( 1, function ( param ) {
            scope.model.addEnergy( param.reduction );
        });

        this.panelAction.appendActionsTo();

        return this;
    };

    /**
     * This method are updating panel progress
     *
     * @return {void}
     */
    this.update = function () {

        this.panelAction.updateProgress( 1, this.model.getCurrentEnergy() );
        this.panelAction.updateProgress( 4, this.model.getCurrentSpeed() );
    };

    /**
     * Set action
     *
     * @param {{ name: [(?string|number)], icon: [(?string|number)], keyCode: [?number], active: [boolean], weapon: string|number }} param
     * @param {number|string} type
     */
    function setActionShot( param, type ) {

        switch ( type ) {
            // Add actions - Shot
            case IW.PanelControls.ACTION_SHOT:
                scope.panelAction.addAction( function () {

                    scope.modelShot.shot( param.weapon );

                }, param.name, param.icon, param.keyCode, param.active );
                break;
            // Add action - Full Screen
            case IW.PanelControls.ACTION_FULL_SCREEN:
                scope.panelAction.addAction( function () {

                    new IW.FullScreen().toggle();

                }, param.name, param.icon, param.keyCode, param.active );
                break;
        }
    }
};

IW.PanelControls.CONFIG_ACTION = 'config-action';

/**
 *
 * @type {string}
 */
IW.PanelControls.ACTION_SHOT = 'shot';

/**
 *
 * @type {string}
 */
IW.PanelControls.ACTION_FULL_SCREEN = 'fullscreen';