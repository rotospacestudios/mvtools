(function () {
    class Context {
        constructor() {
            this.stringValue = "";
            this.intValue = 0;
        }

        setStringValue(str) {
            this.stringValue = str;
        }

        setIntValue(intVal) {
            this.intValue = intVal;
        }

        getStringValue() {
            return this.stringValue;
        }

        getIntValue() {
            return this.intValue;
        }
    }

    class RPGContext {
        constructor() {
            this.contexts = new Map();
            this.activeContextId = 0;
            this._ensureContext(0); // Initialize default context with ID 0
        }

        setActiveContext(id) {
            this.activeContextId = id;
            this._ensureContext(id);
        }

        setString(str) {
            this._ensureContext(this.activeContextId);
            this.contexts.get(this.activeContextId).setStringValue(str);
        }

        setInt(intVal) {
            this._ensureContext(this.activeContextId);
            this.contexts.get(this.activeContextId).setIntValue(intVal);
        }

        getString() {
            return this.contexts.has(this.activeContextId) ? this.contexts.get(this.activeContextId).getStringValue() : "";
        }

        getInt() {
            return this.contexts.has(this.activeContextId) ? this.contexts.get(this.activeContextId).getIntValue() : 0;
        }

        serialize() {
            const serializedContexts = {};
            this.contexts.forEach((context, id) => {
                serializedContexts[id] = {
                    stringValue: context.getStringValue(),
                    intValue: context.getIntValue()
                };
            });
            return JSON.stringify(serializedContexts);
        }

        static deserialize(serializedData) {
            const data = JSON.parse(serializedData);
            const context = new RPGContext();
            for (const id in data) {
                const ctx = new Context();
                ctx.setStringValue(data[id].stringValue);
                ctx.setIntValue(data[id].intValue);
                context.contexts.set(Number(id), ctx);
            }
            return context;
        }

        _ensureContext(id) {
            if (!this.contexts.has(id)) {
                this.contexts.set(id, new Context());
            }
        }
    }

    const context = new RPGContext();

    // Extend DataManager to save and load context data
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function () {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.rpgContext = context.serialize();
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function (contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.rpgContext) {
            const loadedContext = RPGContext.deserialize(contents.rpgContext);
            context.contexts = loadedContext.contexts;
        }
    };

    // Add custom event commands
    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'SetContext') {
            context.setActiveContext(Number(args[0]));
        } else if (command === 'SetString') {
            const str = args.slice(0).join(' ').match(/"([^"]*)"/)[1];
            context.setString(str);
        } else if (command === 'SetInt') {
            context.setInt(Number(args[0]));
        } else if (command === 'GetString') {
            const variableId = Number(args[0]);
            $gameVariables.setValue(variableId, context.getString());
        } else if (command === 'GetInt') {
            const variableId = Number(args[0]);
            $gameVariables.setValue(variableId, context.getInt());
        } else if (command === 'ReserveContext') {
            const contextVarId = Number(args[0]);
            const stringVarId = Number(args[1]);
            const intVarId = Number(args[2]);
            $gameVariables.setValue(contextVarId, context.activeContextId);
            $gameVariables.setValue(stringVarId, context.getString());
            $gameVariables.setValue(intVarId, context.getInt());
        }
    };


})();
