import Ajax from './Ajax';
import Lock from './Lock';
import UIMessage from './ui/UIMessage';
import Sound from './sound/Sound';

/**
 * Class representing a base functional.
 *
 * @class Application
 */
class Application {
    constructor() {

        /**
         *
         * @type {Lock}
         */
        this.lock = Lock.get();

        /**
         *
         * @type {Sound}
         */
        this.sound = new Sound();

        /**
         *
         * @type {Ajax}
         */
        this.ajax = new Ajax();

        /**
         *
         * @type {UIMessage}
         */
        this.msg = new UIMessage();
    }
}

export default Application;
