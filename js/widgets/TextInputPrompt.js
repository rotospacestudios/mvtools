class TextInputPrompt extends DefaultWidget {
    constructor(id, promptText, maxShowTime) {
        super();
        this.id = id;
        this.promptText = promptText;
        this.maxShowTime = maxShowTime || 5000; // Default to 5000ms if not provided

        // Create the prompt window
        this.createPromptWindow();

        // Set a timer to hide the prompt if maxShowTime is provided
        if (this.maxShowTime > 0) {
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.maxShowTime);
        }
    }

    createPromptWindow() {
        const width = 400;
        const height = 200;

        this.window = new Window_Base(0, 0, width, height);
        this.window.move((Graphics.boxWidth - width) / 2, (Graphics.boxHeight - height) / 2, width, height);
        this.window.contents.clear();

        // Draw the prompt text
        this.window.drawText(this.promptText, this.window.padding, 0, width - this.window.padding * 2, 'left');

        // Create the input field
        this.createInputField();

        // Add the window to the scene
        if (SceneManager._scene) {
            SceneManager._scene.addChild(this.window);
        } else {
            console.error("SceneManager._scene is not available.");
        }
    }

    createInputField() {
        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        input.style.left = `${this.window.x + this.window.padding}px`;
        input.style.top = `${this.window.y + this.window.padding + 50}px`;
        input.style.width = `${this.window.width - this.window.padding * 2}px`;
        input.style.height = '30px';
        input.style.fontSize = '18px';
        input.style.zIndex = 1000;

        document.body.appendChild(input);
        input.focus();

        this.inputField = input;

        // Handle input submission
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.onSubmit(input.value);
            }
        });
    }

    onSubmit(value) {
        console.log(`Input received: ${value}`);
        this.hide();
    }

    show() {
        this.window.show();
        this.inputField.style.display = 'block';
    }

    hide() {
        this.window.hide();
        this.inputField.style.display = 'none';
        clearTimeout(this.hideTimeout);

        // Remove the input field from the document
        document.body.removeChild(this.inputField);

        // Remove the window from the scene
        if (SceneManager._scene) {
            SceneManager._scene.removeChild(this.window);
        }

        // Notify WidgetManager to remove this instance
        if (window.widgetManager) {
            window.widgetManager.removeWidgetInstance('TextInputPrompt', this.id);
        }
    }
}

// Expose the widget class globally
window.TextInputPrompt = TextInputPrompt;

widgetManager.registerWidgetConstructor('TextInputPrompt', TextInputPrompt);
