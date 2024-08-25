/*:
 * @plugindesc Displays a centralized speech bubble in RPG Maker MV.
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin provides a CentralizedBubble class that displays a speech bubble
 * in the center of the screen. The speech bubble can show text and will be
 * displayed for a specified duration.
 *
 * ============================================================================
 * Parameters
 * ============================================================================
 * id - A unique identifier for the speech bubble instance.
 * text - The text to display inside the speech bubble.
 * maxShowTime - The maximum time (in milliseconds) to display the speech bubble.
 *
 * ============================================================================
 * Example Usage
 * ============================================================================
 * const centralizedBubble = new CentralizedBubble(1, "Hello, World!", 5000);
 * centralizedBubble.show();
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for use in both commercial and non-commercial projects.
 * Credit is required - Akko Sinn.
 */

class CentralizedBubble extends DefaultWidget {
    constructor(id, text, maxShowTime) {
        super();
        this.id = id; // Assign a unique ID to each instance
        this.text = text;
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

    updatePosition() {
        const screenWidth = Graphics.boxWidth;
        const screenHeight = Graphics.boxHeight;
        this.window.x = (screenWidth - this.window.width) / 2;
        this.window.y = (screenHeight - this.window.height) / 2;
    }

    show() {
        this.window.show();
        this.updatePosition();
    }

    hide() {
        this.window.hide();
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
            window.widgetManager.removeWidgetInstance('CentralizedBubble', this.id);
        }
    }
}

// Expose the widget class globally
window.CentralizedBubble = CentralizedBubble;

widgetManager.registerWidgetConstructor('CentralizedBubble', CentralizedBubble);
