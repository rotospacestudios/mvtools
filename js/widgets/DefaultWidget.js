class DefaultWidget {
    constructor() {
        this.window = new Window_Base(0, 0, 200, 100);
        SceneManager._scene.addChild(this.window);
    }

    show() {
        this.window.show();
    }

    hide() {
        this.window.hide();
    }
}

// Expose the widget class globally
window.DefaultWidget = DefaultWidget;
