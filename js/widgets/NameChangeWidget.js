class NameChangeWidget extends DefaultWidget {
    constructor(id, initialName = 'DefaultName', maxNameLength = 12) {
        super();
        this.id = id;
        this.initialName = initialName;
        this.maxNameLength = maxNameLength;
        this.currentName = this.initialName;
        this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
        this.selectedIndex = 0;

        // Create the input window
        this.createInputWindow();
        this.updatePosition();
    }

    createInputWindow() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        this.window = new Window_Base(0, 0, width, height);

        // Set the window dimensions
        this.window.move(0, 0, width, height);

        // Clear previous contents
        this.window.contents.clear();

        // Add the window to the scene
        if (SceneManager._scene) {
            SceneManager._scene.addChild(this.window);
        } else {
            console.error("SceneManager._scene is not available.");
        }

        // Draw the initial name and alphabet
        this.drawName();
        this.drawAlphabet();
    }

    drawName() {
        // Clear the area where the name is drawn
        this.window.contents.clearRect(0, 0, this.window.width, 50);
        this.window.drawText(this.currentName, this.window.padding, 0, this.window.width - this.window.padding * 2, 'left');
    }

    drawAlphabet() {
        const cols = 10;
        const rows = Math.ceil(this.alphabet.length / cols);
        const cellWidth = this.window.width / cols;
        const cellHeight = 50; // Adjust as needed

        // Clear previous contents except the name
        this.window.contents.clearRect(0, 50, this.window.width, this.window.height - 50);

        for (let i = 0; i < this.alphabet.length; i++) {
            const x = (i % cols) * cellWidth;
            const y = Math.floor(i / cols) * cellHeight + 50; // Adjust Y offset as needed
            this.window.drawText(this.alphabet[i], x, y, cellWidth, 'center');
        }

        // Highlight the selected letter
        const selectedX = (this.selectedIndex % cols) * cellWidth;
        const selectedY = Math.floor(this.selectedIndex / cols) * cellHeight + 50;
        this.window.contents.fillRect(selectedX, selectedY, cellWidth, cellHeight, 'rgba(255, 255, 255, 0.3)');
    }

    updatePosition() {
        this.window.x = 0;
        this.window.y = 0;
    }

    show() {
        if (!this.window.visible) {
            this.window.show();
            this.updatePosition();
            this.activateInput();
        } else {
            console.warn(`Widget NameChangeWidget with ID ${this.id} is already shown.`);
        }
    }

    hide() {
        if (this.window.visible) {
            this.window.hide();
            this.deactivateInput();
            if (window.widgetManager) {
                window.widgetManager.removeWidgetInstance('NameChangeWidget', this.id);
            }
        }
    }

    activateInput() {
        // Add event listeners for input
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    deactivateInput() {
        // Remove event listeners for input
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleKeyDown(event) {
        const cols = 10;
        const rows = Math.ceil(this.alphabet.length / cols);

        if (event.key === 'Enter') {
            if (this.currentName.length < this.maxNameLength) {
                this.currentName += this.alphabet[this.selectedIndex];
                this.drawName();
            }
        } else if (event.key === 'Backspace') {
            this.currentName = this.currentName.slice(0, -1);
            this.drawName();
        } else if (event.key === 'ArrowRight') {
            this.selectedIndex = (this.selectedIndex + 1) % this.alphabet.length;
        } else if (event.key === 'ArrowLeft') {
            this.selectedIndex = (this.selectedIndex - 1 + this.alphabet.length) % this.alphabet.length;
        } else if (event.key === 'ArrowDown') {
            this.selectedIndex = (this.selectedIndex + cols) % this.alphabet.length;
        } else if (event.key === 'ArrowUp') {
            this.selectedIndex = (this.selectedIndex - cols + this.alphabet.length) % this.alphabet.length;
        } else if (event.key === 'Escape') {
            this.hide();
        }

        this.drawAlphabet();
    }
}

// Expose the widget class globally
window.NameChangeWidget = NameChangeWidget;

widgetManager.registerWidgetConstructor('NameChangeWidget', NameChangeWidget);
