class WidgetManager {
    constructor() {
        this.widgetConstructors = {};
        this.widgetInstances = {};

        // Load DefaultWidget.js during initialization
        this.loadDefaultWidgetScript(() => {
            console.log('DefaultWidget loaded and registered.');
        });
    }

    loadDefaultWidgetScript(callback) {
        const script = document.createElement('script');
        script.src = `js/widgets/DefaultWidget.js`;
        script.onload = () => {
            if (typeof window.DefaultWidget === 'function') {
                this.registerWidgetConstructor('DefaultWidget', window.DefaultWidget);
                callback();
            } else {
                console.error('DefaultWidget is not defined correctly.');
            }
        };

        script.onerror = () => {
            console.error('Failed to load DefaultWidget.');
        };

        document.body.appendChild(script);
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

        // Check if the script is already loaded
        const existingScript = document.querySelector(`script[src="js/widgets/${widgetName}.js"]`);
        if (existingScript) {
            existingScript.onload = () => {
                if (typeof window[widgetName] === 'function') {
                    this.registerWidgetConstructor(widgetName, window[widgetName]);
                    callback();
                } else {
                    console.error(`Widget ${widgetName} is not defined correctly.`);
                }
            };
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

// Register the CentralizedBubble widget constructor if not already registered
if (typeof CentralizedBubble !== 'undefined') {
    widgetManager.registerWidgetConstructor('CentralizedBubble', CentralizedBubble);
}
// Register the TextInputPrompt widget constructor if not already registered
if (typeof TextInputPrompt !== 'undefined') {
    widgetManager.registerWidgetConstructor('TextInputPrompt', TextInputPrompt);
}

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
