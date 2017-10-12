import {
	MODEL_DEFAULT
} from './../../ini/obj.ini';

class PlayerSettings {
	constructor() {

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._envPath = './src/img/skybox/004_space.jpg';

		/**
		 *
		 * @type {string}
		 * @private
		 */
		this._background = '/src/img/background/default.jpg';

		/**
		 *
		 * @type {{x: number, y: number, z: number}|Vector3}
		 * @private
		 */
		this._modelShipPosition = {x: 0, y: 0, z: 0};

		/**
		 * @type {string}
		 */
		this._modelShipName = MODEL_DEFAULT;

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
		this._enableOrbitControls = true;
	}

	/**
	 *
	 * @returns {string}
	 */
	get background() {
		return this._background;
	}

	/**
	 *
	 * @param {string} path
	 * @returns {PlayerSettings}
	 */
	setBackground(path) {
		this._background = path;
		return this;
	}

	/**
	 *
	 * @return {boolean}
	 */
	get isEnabledOrbitControls() {
		return this._enableOrbitControls;
	}

	/**
	 *
	 * @param {boolean} value
	 * @return {PlayerSettings}
	 */
	enableOrbitControls(value) {
		this._enableOrbitControls = value;
		return this;
	}

	/**
	 *
	 * @return {string}
	 */
	get envPath() {
		return this._envPath;
	}

	/**
	 *
	 * @param {string} path
	 * @return {PlayerSettings}
	 */
	setEnvPath(path) {
		this._envPath = path;
		return this;
	}

	/**
	 *
	 * @return {{x: number, y: number, z: number}|Vector3}
	 */
	get modelShipPosition() {
		return this._modelShipPosition;
	}

	/**
	 *
	 * @param {string} position
	 * @return {PlayerSettings}
	 */
	setModelShipPosition(position) {
		this._modelShipPosition = position;
		return this;
	}

	/**
	 *
	 * @return {string}
	 */
	get modelShipName() {
		return this._modelShipName;
	}

	/**
	 *
	 * @param {string} name
	 * @return {PlayerSettings}
	 */
	setModelShipName(name) {
		this._modelShipName = name;
		return this;
	}
}

export default PlayerSettings;