import UITableCell from './UITableCell';
import uuidv4 from 'uuid/v4';

class UITableRow {
    constructor() {
        /**
         * @type {string}
         */
        this._uuid = uuidv4();

        /**
         *
         * @type {Array.<UITableCell>}
         * @private
         */
        this._cells = [];
    }

    /**
     * Gets uuid of row
     *
     * @returns {string}
     */
    get uuid() {
        return this._uuid;
    }

    /**
     * Gets cells
     *
     * @returns {Array.<UITableCell>}
     */
    get cells() {
        return this._cells;
    }

    /**
     *
     * @param {?(string|number|UITableCell)} value
     * @param {?number} [width]
     * @returns {UITableRow}
     */
    addCellTest(value, width) {
        let cell = value instanceof UITableCell ? value : new UITableCell();
        if (value instanceof UITableCell) {
            cell.setContent(value);
        }

        if (width) {

        }

        this._cells.push(cell);
        return this;
    }
    /**
     * @param {UIElement} cell - This element of cell
     * @callback prepareContainer
     */

    /**
     * By this method you can add a object or string data to the cell
     *
     * @param {string|number} content - It is string data
     * @param {prepareContainer} [listener] - It is listener to cell
     * @returns {UITableRow}
     */
    addCell(content, listener) {
        let cell = new UITableCell();
        cell.setContent(content);
        if (listener) {
            cell.addContentEvent(listener);
        }
        this._cells.push(cell);
        return this;
    }
}

export default UITableRow;