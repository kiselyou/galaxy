
import InformerSuccess from './InformerSuccess';
import InformerWarning from './InformerWarning';
import InformerDanger from './InformerDanger';
import InformerInfo from './InformerInfo';
import {
    VIEW_PATH_INFORMER_SUCCESS,
    VIEW_PATH_INFORMER_WARNING,
    VIEW_PATH_INFORMER_DANGER,
    VIEW_PATH_INFORMER_INFO
} from './../view-path';

class Informer {
    constructor() {
        /**
         *
         * @type {InformerSuccess}
         * @private
         */
        this._success = new InformerSuccess(VIEW_PATH_INFORMER_SUCCESS);

        /**
         *
         * @type {InformerWarning}
         * @private
         */
        this._warning = new InformerWarning(VIEW_PATH_INFORMER_WARNING);

        /**
         *
         * @type {InformerWarning}
         * @private
         */
        this._danger = new InformerDanger(VIEW_PATH_INFORMER_DANGER);

        /**
         *
         * @type {InformerWarning}
         * @private
         */
        this._info = new InformerInfo(VIEW_PATH_INFORMER_INFO);
    }

    /**
     * Paste view "informer success" to the block
     *
     * @param {UIElement|Element|string} blockElement - String is selector
     * @param {Array|string} messages - It is messages. Can be string
     * @returns {Informer}
     */
    success(blockElement, messages) {
        this._success.pasteTo(blockElement, messages);
        return this;
    }

    /**
     * Paste view "informer warning" to the block
     *
     * @param {UIElement|Element|string} blockElement - String is selector
     * @param {Array|string} messages - It is messages. Can be string
     * @returns {Informer}
     */
    warning(blockElement, messages) {
        this._warning.pasteTo(blockElement, messages);
        return this;
    }

    /**
     * Paste view "informer danger" to the block
     *
     * @param {UIElement|Element|string} blockElement - String is selector
     * @param {Array|string} messages - It is messages. Can be string
     * @returns {Informer}
     */
    danger(blockElement, messages) {
        this._danger.pasteTo(blockElement, messages);
        return this;
    }

    /**
     * Paste view "informer info"  to the block
     *
     * @param {UIElement|Element|string} blockElement - String is selector
     * @param {Array|string} messages - It is messages. Can be string
     * @returns {Informer}
     */
    info(blockElement, messages) {
        this._info.pasteTo(blockElement, messages);
        return this;
    }
}

export default Informer;