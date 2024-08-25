/*:
 * @plugindesc Displays a speech bubble above an event in RPG Maker MV.
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin provides a SpeechBubble class that displays a speech bubble
 * above a specified event. The speech bubble can show text and follow the
 * event as it moves.
 *
 * ============================================================================
 * Parameters
 * ============================================================================
 * id - A unique identifier for the speech bubble instance.
 * text - The text to display inside the speech bubble.
 * eventName - The name of the event to follow.
 * maxShowTime - The maximum time (in milliseconds) to display the speech bubble.
 *
 * ============================================================================
 * Example Usage
 * ============================================================================
 * const speechBubble = new SpeechBubble(1, "Hello, World!", "EventName", 5000);
 * speechBubble.show();
 *
 */

{
    constructor() {
    }

    show() {
        this.window.show();
    }

    hide() {
        this.window.hide();
    }
}

class SpeechBubble extends DefaultWidget {
    constructor(id, text, eventName, maxShowTime) {
        super();
        this.id = id; // Assign a unique ID to each instance
        this.text = text;
        this.eventName = eventName;
        this.maxShowTime = maxShowTime || 5000; // Default to 5000ms if not provided
        this.fadeInApplied = false; // Flag to track if fade-in has been applied

        // Create a temporary window to measure text dimensions
        const tempWindow = new Window_Base(0, 0, 200, 100); // Initial default size for measurement
        const textWidth = tempWindow.textWidth(this.text);
        const padding = tempWindow.padding * 2;
        const extraWidth = 20; // Additional width to ensure the text fits

        // Calculate the final width and height
        const finalWidth = textWidth + padding + extraWidth;
        const finalHeight = tempWindow.fittingHeight(1);

        // Call createTextWindow with final width and height
        this.createTextWindow(finalWidth, finalHeight);
        this.updatePosition();

        // Start the fade-in effect for the box
        this.fadeInBox();

        // Start the fade-in effect for the text
        this.fadeInText();

        // Set a timer to hide the bubble if maxShowTime is provided
        if (this.maxShowTime > 0) {
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.maxShowTime);
        }

        // Start updating the position to follow the event
        this.startUpdatingPosition();
    }

    createTextWindow(w, h) {
        this.window = new Window_Base(0, 0, w, h); // Initial default size

        // Set the window dimensions
        this.window.move(0, 0, w, h);

        // Clear previous contents
        this.window.contents.clear();

        // Add the window to the scene
        if (SceneManager._scene) {
            SceneManager._scene.addChild(this.window);
        } else {
            console.error("SceneManager._scene is not available.");
        }
    }

    fadeInBox() {
        if (this.fadeInApplied) return; // Prevent repeat fade-in

        this.window.opacity = 0;
        const fadeDuration = 30; // Faster duration in frames (0.5 second if 60 FPS)
        const fadeStep = 255 / fadeDuration;

        this.fadeBoxInterval = setInterval(() => {
            this.window.opacity += fadeStep;
            if (this.window.opacity >= 255) {
                this.window.opacity = 255;
                clearInterval(this.fadeBoxInterval);
            }
        }, 1000 / 60); // 60 FPS
    }

    fadeInText() {
        if (this.fadeInApplied) return; // Prevent repeat fade-in

        this.window.contentsOpacity = 0;
        const fadeDuration = 30; // Faster duration in frames (0.5 second if 60 FPS)
        const fadeStep = 255 / fadeDuration;

        this.fadeTextInterval = setInterval(() => {
            this.window.contentsOpacity += fadeStep;
            if (this.window.contentsOpacity >= 255) {
                this.window.contentsOpacity = 255;
                clearInterval(this.fadeTextInterval);
            }
        }, 1000 / 60); // 60 FPS

        // Draw the text
        this.window.drawText(this.text, this.window.padding, 0, this.window.width - this.window.padding * 2, 'left');

        this.fadeInApplied = true; // Mark fade-in as applied
    }

    findEventByName(name) {
        return $gameMap.events().find(event => event.event().name === name);
    }

    startUpdatingPosition() {
        this.updateInterval = setInterval(() => {
            this.updatePosition();
            this.updateEventDirection();
        }, 1000 / 60); // Update position and direction at 60 FPS
    }

    stopUpdatingPosition() {
        clearInterval(this.updateInterval);
    }

    updatePosition() {
        const event = this.findEventByName(this.eventName);
        if (event) {
            const eventScreenX = event.screenX();
            const eventScreenY = event.screenY();
            this.window.x = eventScreenX - this.window.width / 2;
            this.window.y = eventScreenY - this.window.height - 30; // Adjust the offset as needed
        }
    }

    updateEventDirection() {
        const event = this.findEventByName(this.eventName);
        if (event) {
            const player = $gamePlayer;
            const dx = player.x - event.x;
            const dy = player.y - event.y;

            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    event.setDirection(6); // Face right
                } else {
                    event.setDirection(4); // Face left
                }
            } else {
                if (dy > 0) {
                    event.setDirection(2); // Face down
                } else {
                    event.setDirection(8); // Face up
                }
            }
        }
    }

    show() {
        this.window.show();
        this.updatePosition();
    }

    hide() {
        this.window.hide();
        this.stopUpdatingPosition();
        clearTimeout(this.hideTimeout);
        clearInterval(this.fadeBoxInterval);
        clearInterval(this.fadeTextInterval);
        this.fadeInApplied = false; // Reset fade-in flag for re-initialization

        // Remove the window from the scene
        if (SceneManager._scene) {
            SceneManager._scene.removeChild(this.window);
        }

        // Notify WidgetManager to remove this instance
        if (window.widgetManager) {
            window.widgetManager.removeWidgetInstance('SpeechBubble', this.id);
        }
    }
}

// Expose the widget class globally
window.SpeechBubble = SpeechBubble;
