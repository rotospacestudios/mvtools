/*:
 * @plugindesc Manages the creation, display, and removal of various widgets in RPG Maker MV.
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin provides a WidgetManager class that handles the registration,
 * loading, showing, and hiding of different widget types. It allows for
 * dynamic management of widgets within the game.
 *
 * ============================================================================
 * Plugin Commands
 * ============================================================================
 * ShowWidget <widgetName> <id> <params...>
 * - Shows a widget of the specified type with the given ID and parameters.
 *
 * HideWidget <widgetName> <id>
 * - Hides the widget of the specified type with the given ID.
 *
 * ============================================================================
 * Example Usage
 * ============================================================================
 * Plugin Command: ShowWidget SpeechBubble 1 "Hello, World!" "EventName" 5000
 * Plugin Command: HideWidget SpeechBubble 1
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for use in both commercial and non-commercial projects.
 * Credit are required - Akko Sinn.
 */

class WidgetManager {
    constructor() {
        this.widgetConstructors = {};
        this.widgetInstances = {};
    }

    registerWidgetConstructor(widgetName, widgetConstructor) {
        if (!this.widgetConstructors[widgetName]) {
            this.widgetConstructors[widgetName] = widgetConstructor;
            console.log(`Widget constructor for ${widgetName} registered successfully.`);
        }
    }

    loadWidgetScript(widgetName, callback) {
        if (this.widgetConstructors[widgetName]) {
            callback();
            return;
        }

        const script = document.createElement('script');
        script.src = `js/widgets/${widgetName}.js`;
        script.onload = () => {
            if (typeof window[widgetName] === 'function') {
                this.registerWidgetConstructor(widgetName, window[widgetName]);
                callback();
            } else {
                console.error(`Widget ${widgetName} is not defined correctly.`);
            }
        };

        script.onerror = () => {
            console.error(`Failed to load widget: ${widgetName}`);
        };

        document.body.appendChild(script);
    }

    showWidget(widgetName, id, ...params) {
        this.loadWidgetScript(widgetName, () => {
            if (!this.widgetInstances[widgetName]) {
                this.widgetInstances[widgetName] = {};
            }

            if (!this.widgetInstances[widgetName][id]) {
                const widgetConstructor = this.widgetConstructors[widgetName];
                const widgetInstance = new widgetConstructor(id, ...params);
                this.widgetInstances[widgetName][id] = widgetInstance;
                widgetInstance.show(...params);
            } else {
                console.log(`Widget ${widgetName} with ID ${id} is already shown.`);
            }
        });
    }

    hideWidget(widgetName, id, callback) {
        if (this.widgetInstances[widgetName] && this.widgetInstances[widgetName][id]) {
            this.widgetInstances[widgetName][id].hide();
            if (callback) callback();
        } else {
            console.error(`Widget ${widgetName} with ID ${id} is not loaded.`);
        }
    }

    removeWidgetInstance(widgetName, id) {
        if (this.widgetInstances[widgetName] && this.widgetInstances[widgetName][id]) {
            delete this.widgetInstances[widgetName][id];
        }
    }
}

// Create a global instance of WidgetManager
window.widgetManager = new WidgetManager();

// Plugin command to show or hide a widget
const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'ShowWidget') {
        const widgetName = args[0];
        const id = Number(args[1]);
        const params = args.slice(2).join(' ').match(/"[^"]+"|[^\s]+/g).map(param => param.replace(/"/g, ''));
        widgetManager.showWidget(widgetName, id, ...params);
    } else if (command === 'HideWidget') {
        const widgetName = args[0];
        const id = Number(args[1]);
        widgetManager.hideWidget(widgetName, id, () => {
            console.log(`Event for ${widgetName} with ID ${id} has finished.`);
        });
    }
};
