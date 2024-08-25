(function (SGUI) {
    class Window_PlayerNameInput extends SGUI.Window {
        constructor(x, y, width, height, actorId) {
            super(x, y, width, height);
            this._actorId = actorId;
            this.initialize(x, y, width, height);
        }

        initialize(x, y, width, height) {
            super.initialize(x, y, width, height);
            this._actor = $gameActors.actor(this._actorId);
            this._name = this._actor ? this._actor.name() : '';
            this._maxLength = 12; // Maximum length of the player name
            this._padding = 20;
            this._underlineWidth = 20; // Width of each underline
            this.activate();

            // Add key press handler
            if (!this._handlersAdded) {
                Input.addKeyPressHandler(this.onKeyPress.bind(this));
                this._handlersAdded = true;
            }

            SGUI.registerWindow(this); // Register the window with the WindowManager
            // Delay the refresh call to ensure the window is fully initialized
            setTimeout(() => {
                this.refresh();
            }, 100); // 100ms delay
        }

        refresh() {
            this.contents.clear();
            this.drawText("Enter Player Name:", 0, 0, this.contentsWidth(), 'center');
            this.drawUnderlines();
            this.drawName();
        }

        drawUnderlines() {
            const spacing = 5; // Space between underlines
            const startX = this._padding;
            const y = this.lineHeight() * 2;
            for (let i = 0; i < this._maxLength; i++) {
                const x = startX + i * (this._underlineWidth + spacing);
                this.drawText('_', x, y, this._underlineWidth, 'left');
            }
        }

        drawName() {
            const spacing = 5; // Space between characters
            const startX = this._padding;
            const y = this.lineHeight();
            for (let i = 0; i < this._name.length; i++) {
                const x = startX + i * (this._underlineWidth + spacing);
                this.drawText(this._name[i], x, y, this._underlineWidth, 'left');
            }
        }

        onKeyPress(event) {
            if (this.isOpen() && this.active) {
                if (event.key === 'Enter') {
                    this.onOk();
                } else if (event.key === 'Backspace') {
                    this.onBackspace();
                } else {
                    this.onInput(event.key);
                }
            }
        }

        onOk() {
            // Confirm the name input
            this.deactivate();
            if (this._actor) {
                this._actor.setName(this._name); // Set the name for the specified actor
            }
            SceneManager.pop(); // Return to the previous scene
        }

        onBackspace() {
            if (this._name.length > 0) {
                this._name = this._name.slice(0, -1);
                this.refresh();
            }
        }

        onInput(key) {
            const char = this.getInputCharacter(key);
            if (char && this._name.length < this._maxLength) {
                this._name += char;
                this.refresh();
            }
        }

        getInputCharacter(key) {
            const keyCode = key.charCodeAt(0);
            if ((keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122)) {
                return Input.isPressed('shift') ? key.toUpperCase() : key.toLowerCase();
            } else if (keyCode >= 48 && keyCode <= 57) { // Numeric keys
                return key;
            } else if (key.length === 1 && key.match(/[\W_]/)) { // Special characters
                return key;
            }
            return null;
        }
    }

    SGUI.Window_PlayerNameInput = Window_PlayerNameInput;

    class Scene_PlayerNameInput extends Scene_MenuBase {
        constructor() {
            super();
        }

        initialize(actorId) {
            this._actorId = actorId;
            super.initialize();
        }

        create() {
            super.create();
            this.createPlayerNameInputWindow();
        }

        createPlayerNameInputWindow() {
            const width = Graphics.boxWidth / 2;
            const height = Graphics.boxHeight / 4;
            const x = (Graphics.boxWidth - width) / 2;
            const y = (Graphics.boxHeight - height) / 2;
            this._playerNameInputWindow = new SGUI.Window_PlayerNameInput(x, y, width, height, this._actorId);
            this.addWindow(this._playerNameInputWindow);
            this._playerNameInputWindow.activate(); // Ensure the window is activated
            this._playerNameInputWindow.refresh(); // Ensure refresh is called after window creation
        }
    }

    SGUI.Scene_PlayerNameInput = Scene_PlayerNameInput;

    const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'OpenPlayerNameInput') {
            const actorId = parseInt(args[0], 10);
            console.log(`Plugin command received: OpenPlayerNameInput for actor ${actorId}`);
            SceneManager.push(function () {
                const scene = new SGUI.Scene_PlayerNameInput();
                scene.initialize(actorId);
                return scene;
            });
        }
    };
})(SGUI);
