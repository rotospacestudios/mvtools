/*:
 * @plugindesc A manager for loading and registering function libraries from the /js/lib/ directory.
 * @help This plugin allows you to load and register function libraries dynamically.
 */

(function () {
    class FunctionLibraryManager {
        constructor() {
            if (FunctionLibraryManager.instance) {
                return FunctionLibraryManager.instance;
            }

            this.functionLibraries = {};
            this.loadedLibraries = new Set();
            this.librariesLoaded = false; // Flag to track if libraries have been loaded

            // Load all function libraries during initialization
            this.loadAllFunctionLibraries();

            FunctionLibraryManager.instance = this;
        }

        loadAllFunctionLibraries() {
            if (this.librariesLoaded) {
                return;
            }

            this.librariesLoaded = true;

            const path = require('path');
            const fs = require('fs');
            const libPath = path.join('js', 'lib');

            fs.readdir(libPath, (err, files) => {
                if (err) {
                    console.error('Failed to read directory:', err);
                    return;
                }

                files.forEach(file => {
                    if (file.endsWith('.js')) {
                        const libraryName = file.replace('.js', '');
                        if (!this.loadedLibraries.has(libraryName)) {
                            this.loadFunctionLibraryScript(libraryName, () => {
                                console.log(`${libraryName} loaded and registered.`);
                            });
                        }
                    }
                });
            });
        }

        loadFunctionLibraryScript(libraryName, callback) {
            if (this.functionLibraries[libraryName]) {
                callback();
                return;
            }

            const script = document.createElement('script');
            script.src = `js/lib/${libraryName}.js`; // Adjusted path
            script.onload = () => {
                if (typeof window[libraryName] === 'object') {
                    this.registerFunctionLibrary(libraryName, window[libraryName]);
                    this.loadedLibraries.add(libraryName);
                    callback();
                } else {
                    console.error(`${libraryName} is not defined correctly.`);
                }
            };

            script.onerror = () => {
                console.error(`Failed to load function library: ${libraryName}`);
            };

            document.body.appendChild(script);
        }

        registerFunctionLibrary(libraryName, libraryObject) {
            if (!this.functionLibraries[libraryName]) {
                this.functionLibraries[libraryName] = libraryObject;
                console.log(`Function library ${libraryName} registered successfully.`);
            }
        }

        getFunction(libraryName, functionName) {
            if (this.functionLibraries[libraryName] && this.functionLibraries[libraryName][functionName]) {
                return this.functionLibraries[libraryName][functionName];
            } else {
                console.error(`Function ${functionName} not found in library ${libraryName}.`);
                return null;
            }
        }

        parseArguments(args) {
            const regex = /"([^"]+)"|(\S+)/g;
            const result = [];
            let match;
            while ((match = regex.exec(args)) !== null) {
                result.push(match[1] || match[2]);
            }
            return result;
        }

        executePluginCommand(command, args) {
            const parsedArgs = this.parseArguments(args.join(' '));
            const [libraryName, functionName, ...functionArgs] = parsedArgs;
            const func = this.getFunction(libraryName, functionName);
            if (func) {
                func(...functionArgs);
            } else {
                console.error(`Failed to execute plugin command: ${command}`);
            }
        }

        run(libraryType, ...args) {
            switch (libraryType) {
                case 'Global':
                    window.GlobalFlagLibrary.run(...args);
                    break;
                case 'Player':
                    window.PlayerFlagLibrary.run(...args);
                    break;
                case 'Event':
                    window.EventFlagLibrary.run(...args);
                    break;
                default:
                    console.error(`Unknown library type: ${libraryType}`);
            }
        }
    }

    // Create a global instance of FunctionLibraryManager
    window.functionLibraryManager = new FunctionLibraryManager();

    // Register the plugin command handler
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'CallFunction') {
            window.functionLibraryManager.executePluginCommand(command, args);
        } else if (command === 'SetGlobalFlag') {
            const [category, flagName, value] = args;
            window.GlobalFlagLibrary.setFlag(category, flagName, value);
        } else if (command === 'Run') {
            const [libraryType, ...restArgs] = args;
            window.functionLibraryManager.run(libraryType, ...restArgs);
        }
    };
})();

// Hook into the save and load mechanisms
const _DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function () {
    const contents = _DataManager_makeSaveContents.call(this);
    contents.globalFlags = window.GlobalFlagLibrary.saveFlags();
    contents.playerFlags = window.PlayerFlagLibrary.saveFlags();
    contents.eventFlags = window.EventFlagLibrary.saveFlags();
    return contents;
};

const _DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function (contents) {
    _DataManager_extractSaveContents.call(this, contents);
    if (contents.globalFlags) {
        window.GlobalFlagLibrary.loadFlags(contents.globalFlags);
    }
    if (contents.playerFlags) {
        window.PlayerFlagLibrary.loadFlags(contents.playerFlags);
    }
    if (contents.eventFlags) {
        window.EventFlagLibrary.loadFlags(contents.eventFlags);
    }
};

class FlagLibrary {
    constructor() {
        this.flags = {};
    }

    getFlag(category, flagName) {
        if (this.flags[category] && this.flags[category][flagName] !== undefined) {
            const value = this.flags[category][flagName];
            console.log(`Flag retrieved: ${category}.${flagName} = ${value}`);
            return value;
        }
        return null;
    }


    setFlag(category, flagName, value) {
        if (!this.flags[category]) {
            this.flags[category] = {};
        }
        this.flags[category][flagName] = value;
    }

    saveFlags() {
        return JSON.stringify(this.flags);
    }

    loadFlags(data) {
        Object.assign(this.flags, JSON.parse(data));
    }

    run(id, functionName, ...args) {
        if (typeof this[functionName] === 'function') {
            this[functionName](id, ...args);
        } else {
            console.error(`Function ${functionName} not found in library.`);
        }
    }
}
