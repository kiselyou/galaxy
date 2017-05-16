var IW = IW || {};

/**
 *
 * @augments IW.Ajax
 * @constructor
 */
IW.Templates = function () {

    var PATH_TO_LOAD = '/template';

    this._loaded = [];

    /**
     *
     * @type {IW.Templates}
     */
    var scope = this;

    /**
     * Load template
     *
     * @param {string} name it is path of template
     * @param {function} event
     * @returns {IW.Templates}
     */
    this.load = function (name, event) {
        var tpl = this._loaded.find(function (item) {
            return item['name'] === name;
        });

        if (tpl) {
            event.call( this, tpl.tpl );
        } else {
            new IW.Ajax().post(
                PATH_TO_LOAD,
                { template: name },
                function ( template ) {
                    scope._loaded.push({ name: name, tpl: template });
                    event.call( this, template );

                },
                function () {

                    console.warn('Error');
                }
            );
        }
        return this;
    };

    this.paste = function (selector, str) {
        var to = document.querySelectorAll(selector);
        if (to) {
            var el = document.createElement('div');
            el.innerHTML = str;

            for (var b = 0; b < to.length; b++) {
                to[b].appendChild(el);
            }

            var script = el.querySelectorAll('script');
            for (var i = 0; i < script.length; i++) {
                this._evalScript(script[i]);
                script[i].remove();
            }
        }
    };

    /**
     *
     * @param {Element|HTMLElement} el
     * @return {void}
     * @private
     */
    this._evalScript = function (el) {
        var data = (el.text || el.textContent || el.innerHTML || '' ),
            body = document.getElementsByTagName('body')[0] || document.documentElement,
            script = document.createElement('script');

        script.type = 'text/javascript';

        try {
            // doesn't work on ie...
            script.appendChild(document.createTextNode(data));
        } catch(e) {
            // IE has funky script nodes
            script.text = data;
        }

        body.appendChild(script);
        body.removeChild(script);
    };
};
