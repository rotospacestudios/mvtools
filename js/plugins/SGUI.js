/*:
 * @plugindesc Simple GUI (SGUI) Plugin for RPGMaker MV
 * @help
 * This plugin provides a SGUI class that extends Window_Base
 * and includes simple setter and getter functions for size and position.
 * It also includes a SGUI.WindowManager to manage window registration and visibility.
 * Additionally, it provides a Button control and basic event handling.
 *
 * Example usage:
 * var myWindow = new SGUI.Window(0, 0, 200, 100);
 * myWindow.setX(50);
 * myWindow.setY(50);
 * myWindow.setWidth(300);
 * myWindow.setHeight(150);
 * SGUI.registerWindow(myWindow);
 *
 * var myButton = new SGUI.Button(10, 10, 100, 30, "Click Me");
 * myButton.setClickHandler(function() {
 *     console.log("Button clicked!");
 * });
 * myWindow.addChild(myButton);
 */
var SGUI = SGUI || {};
console.log("SGUI.js is loading...");


(function (SGUI) {

    function Window() {
        console.log("SGUI.Window is being initialized...");
        this.initialize.apply(this, arguments);
    }

    Window.prototype = Object.create(Window_Base.prototype);
    Window.prototype.constructor = Window;

    Window.prototype.initialize = function (x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._needsRedraw = true;
    };

    // Mark the window as needing a redraw
    Window.prototype.invalidate = function () {
        this._needsRedraw = true;
    };

    // Update the window's position and size if needed
    Window.prototype.update = function () {
        if (this._needsRedraw) {
            this.move(this._x, this._y, this._width, this._height);
            this.createContents();
            this._needsRedraw = false;
        }
    };

    // Refresh the window (trigger a redraw)
    Window.prototype.refresh = function () {
        this.invalidate();
        this.update();
    };

    // Serialize the window state
    Window.prototype.serialize = function () {
        return {
            type: 'Window',
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            children: this.children.map(child => child.serialize())
        };
    };

    // Deserialize the window state
    Window.prototype.deserialize = function (state) {
        this.x = state.x;
        this.y = state.y;
        this.width = state.width;
        this.height = state.height;
        state.children.forEach(child => {
            var childControl = SGUI.createControlFromState(child);
            this.addChild(childControl);
        });
    };

    // Factory function to create controls from serialized state
    SGUI.createControlFromState = function (state) {
        var control;
        switch (state.type) {
            case 'Window':
                control = new SGUI.Window(state.x, state.y, state.width, state.height);
                break;
            // Add cases for other control types here
        }
        if (control && control.deserialize) {
            control.deserialize(state);
        }
        return control;
    };

    // Expose the SGUI.Window to the SGUI namespace
    SGUI.Window = Window;


    function Button() {
        console.log("SGUI.Button is being initialized...");
        this.initialize.apply(this, arguments);
    }

    Button.prototype = Object.create(Window.prototype);
    Button.prototype.constructor = Button;

    Button.prototype.initialize = function (x, y, width, height) {
        Window.prototype.initialize.call(this, x, y, width, height);
        this._needsRedraw = true;
    };

    // Mark the button as needing a redraw
    Button.prototype.invalidate = function () {
        this._needsRedraw = true;
    };

    // Update the button's position and size if needed
    Button.prototype.update = function () {
        if (this._needsRedraw) {
            this.move(this._x, this._y, this._width, this._height);
            this.createContents();
            this._needsRedraw = false;
        }
    };

    // Serialize the button state
    Button.prototype.serialize = function () {
        return {
            type: 'Button',
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            children: this.children.map(child => child.serialize())
        };
    };

    // Deserialize the button state
    Button.prototype.deserialize = function (state) {
        this.x = state.x;
        this.y = state.y;
        this.width = state.width;
        this.height = state.height;
        state.children.forEach(child => {
            var childControl = SGUI.createControlFromState(child);
            this.addChild(childControl);
        });
    };

    // Expose the SGUI.Button to the SGUI namespace
    SGUI.Button = Button;

    function List() {
        console.log("SGUI.List is being initialized...");
        this.initialize.apply(this, arguments);
    }

    List.prototype = Object.create(Window.prototype);
    List.prototype.constructor = List;

    List.prototype.initialize = function (x, y, width, height) {
        Window.prototype.initialize.call(this, x, y, width, height);
        this._needsRedraw = true;
    };

    // Mark the list as needing a redraw
    List.prototype.invalidate = function () {
        this._needsRedraw = true;
    };

    // Update the list's position and size if needed
    List.prototype.update = function () {
        if (this._needsRedraw) {
            this.move(this._x, this._y, this._width, this._height);
            this.createContents();
            this._needsRedraw = false;
        }
    };

    // Serialize the list state
    List.prototype.serialize = function () {
        return {
            type: 'List',
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            children: this.children.map(child => child.serialize())
        };
    };

    // Deserialize the list state
    List.prototype.deserialize = function (state) {
        this.x = state.x;
        this.y = state.y;
        this.width = state.width;
        this.height = state.height;
        state.children.forEach(child => {
            var childControl = SGUI.createControlFromState(child);
            this.addChild(childControl);
        });
    };

    // Expose the SGUI.List to the SGUI namespace
    SGUI.List = List;
    function ScrollBox() {
        console.log("SGUI.ScrollBox is being initialized...");
        this.initialize.apply(this, arguments);
    }

    ScrollBox.prototype = Object.create(Window.prototype);
    ScrollBox.prototype.constructor = ScrollBox;

    ScrollBox.prototype.initialize = function (x, y, width, height) {
        Window.prototype.initialize.call(this, x, y, width, height);
        this._needsRedraw = true;
    };

    // Mark the scroll box as needing a redraw
    ScrollBox.prototype.invalidate = function () {
        this._needsRedraw = true;
    };

    // Update the scroll box's position and size if needed
    ScrollBox.prototype.update = function () {
        if (this._needsRedraw) {
            this.move(this._x, this._y, this._width, this._height);
            this.createContents();
            this._needsRedraw = false;
        }
    };

    // Serialize the scroll box state
    ScrollBox.prototype.serialize = function () {
        return {
            type: 'ScrollBox',
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            children: this.children.map(child => child.serialize())
        };
    };

    // Deserialize the scroll box state
    ScrollBox.prototype.deserialize = function (state) {
        this.x = state.x;
        this.y = state.y;
        this.width = state.width;
        this.height = state.height;
        state.children.forEach(child => {
            var childControl = SGUI.createControlFromState(child);
            this.addChild(childControl);
        });
    };

    // Expose the SGUI.ScrollBox to the SGUI namespace
    SGUI.ScrollBox = ScrollBox;
    function Grid() {
        console.log("SGUI.Grid is being initialized...");
        this.initialize.apply(this, arguments);
    }

    Grid.prototype = Object.create(Window.prototype);
    Grid.prototype.constructor = Grid;

    Grid.prototype.initialize = function (x, y, width, height) {
        Window.prototype.initialize.call(this, x, y, width, height);
        this._needsRedraw = true;
    };

    // Mark the grid as needing a redraw
    Grid.prototype.invalidate = function () {
        this._needsRedraw = true;
    };

    // Update the grid's position and size if needed
    Grid.prototype.update = function () {
        if (this._needsRedraw) {
            this.move(this._x, this._y, this._width, this._height);
            this.createContents();
            this._needsRedraw = false;
        }
    };

    // Serialize the grid state
    Grid.prototype.serialize = function () {
        return {
            type: 'Grid',
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            children: this.children.map(child => child.serialize())
        };
    };

    // Deserialize the grid state
    Grid.prototype.deserialize = function (state) {
        this.x = state.x;
        this.y = state.y;
        this.width = state.width;
        this.height = state.height;
        state.children.forEach(child => {
            var childControl = SGUI.createControlFromState(child);
            this.addChild(childControl);
        });
    };

    // Expose the SGUI.Grid to the SGUI namespace
    SGUI.Grid = Grid;

    function TextBox() {
        console.log("SGUI.TextBox is being initialized...");
        this.initialize.apply(this, arguments);
    }

    TextBox.prototype = Object.create(Window.prototype);
    TextBox.prototype.constructor = TextBox;

    TextBox.prototype.initialize = function (x, y, width, height) {
        Window.prototype.initialize.call(this, x, y, width, height);
        this._needsRedraw = true;
    };

    // Mark the text box as needing a redraw
    TextBox.prototype.invalidate = function () {
        this._needsRedraw = true;
    };

    // Update the text box's position and size if needed
    TextBox.prototype.update = function () {
        if (this._needsRedraw) {
            this.move(this._x, this._y, this._width, this._height);
            this.createContents();
            this._needsRedraw = false;
        }
    };

    // Serialize the text box state
    TextBox.prototype.serialize = function () {
        return {
            type: 'TextBox',
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            children: this.children.map(child => child.serialize())
        };
    };

    // Deserialize the text box state
    TextBox.prototype.deserialize = function (state) {
        this.x = state.x;
        this.y = state.y;
        this.width = state.width;
        this.height = state.height;
        state.children.forEach(child => {
            var childControl = SGUI.createControlFromState(child);
            this.addChild(childControl);
        });
    };

    // Expose the SGUI.TextBox to the SGUI namespace
    SGUI.TextBox = TextBox;


    function HUD() {
        console.log("SGUI.HUD is being initialized...");
        this.initialize.apply(this, arguments);
    }

    HUD.prototype = Object.create(Window.prototype);
    HUD.prototype.constructor = HUD;

    HUD.prototype.initialize = function (x, y, width, height) {
        Window.prototype.initialize.call(this, x, y, width, height);
        this._needsRedraw = true;
    };

    // Mark the HUD as needing a redraw
    HUD.prototype.invalidate = function () {
        this._needsRedraw = true;
    };

    // Update the HUD's position and size if needed
    HUD.prototype.update = function () {
        if (this._needsRedraw) {
            this.move(this._x, this._y, this._width, this._height);
            this.createContents();
            this._needsRedraw = false;
        }
    };

    // Serialize the HUD state
    HUD.prototype.serialize = function () {
        return {
            type: 'HUD',
            x: this._x,
            y: this._y,
            width: this._width,
            height: this._height,
            children: this.children.map(child => child.serialize())
        };
    };

    // Deserialize the HUD state
    HUD.prototype.deserialize = function (state) {
        this.x = state.x;
        this.y = state.y;
        this.width = state.width;
        this.height = state.height;
        state.children.forEach(child => {
            var childControl = SGUI.createControlFromState(child);
            this.addChild(childControl);
        });
    };

    // Expose the SGUI.HUD to the SGUI namespace
    SGUI.HUD = HUD;
    // Expose the SGUI.Window and SGUI.Button to the SGUI namespace
    SGUI.Window = Window;
    SGUI.Button = Button;

    // WindowManager to manage window registration and visibility
    SGUI.WindowManager = {
        _windows: [],

        registerWindow: function (window) {
            this._windows.push(window);
        },

        redrawAllWindows: function () {
            this._windows.forEach(window => window.refresh());
        },

        updateAllWindows: function () {
            this._windows.forEach(window => window.update());
        }
    };
    // Expose registerWindow and redrawAllWindows as part of SGUI library
    SGUI.registerWindow = function (window) {
        SGUI.WindowManager.registerWindow(window);
    };

    SGUI.redrawAllWindows = function () {
        SGUI.WindowManager.redrawAllWindows();
    };
    // Call updateAllWindows in the main game loop
    const _SceneManager_updateMain = SceneManager.updateMain;
    SceneManager.updateMain = function () {
        _SceneManager_updateMain.call(this);
        SGUI.WindowManager.updateAllWindows();
    };

    window.SGUI_LOADED = true;
})(SGUI);



console.log("SGUI.js has finished loading.");