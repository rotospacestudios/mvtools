/*:
 * @plugindesc Allows hooking into key press and release events globally.
 * @help
 * This plugin provides a way to hook into key press and release events globally.
 * 
 * Plugin Commands:
 *   None
 */

(function () {
    var _Input_onKeyDown = Input._onKeyDown;
    var _Input_onKeyUp = Input._onKeyUp;

    Input.keyPressHandlers = [];
    Input.keyReleaseHandlers = [];

    Input._onKeyDown = function (event) {
        console.log('Key down event:', event.key); // Log key down event
        _Input_onKeyDown.call(this, event);
        Input.keyPressHandlers.forEach(function (handler) {
            try {
                handler(event);
            } catch (e) {
                console.error('Error in key press handler:', e);
            }
        });
    };

    Input._onKeyUp = function (event) {
        console.log('Key up event:', event.key); // Log key up event
        _Input_onKeyUp.call(this, event);
        Input.keyReleaseHandlers.forEach(function (handler) {
            try {
                handler(event);
            } catch (e) {
                console.error('Error in key release handler:', e);
            }
        });
    };

    Input.addKeyPressHandler = function (handler) {
        if (typeof handler === 'function') {
            console.log('Adding key press handler'); // Log adding handler
            this.keyPressHandlers.push(handler);
        } else {
            console.warn('Attempted to add non-function key press handler');
        }
    };

    Input.addKeyReleaseHandler = function (handler) {
        if (typeof handler === 'function') {
            console.log('Adding key release handler'); // Log adding handler
            this.keyReleaseHandlers.push(handler);
        } else {
            console.warn('Attempted to add non-function key release handler');
        }
    };
})();
