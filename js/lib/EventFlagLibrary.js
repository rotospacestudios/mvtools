class EventFlagLibrary extends FlagLibrary {
    // Add any specific methods for EventFlagLibrary if needed
    run(id, functionName, ...args) {
        if (typeof this[functionName] === 'function') {
            return this[functionName](id, ...args);
        } else {
            console.error(`Function ${functionName} not found in EventFlagLibrary.`);
        }
    }

    getFlag(id, flagName, defaultValue = null) {
        const value = super.getFlag(`event_${id}`, flagName);
        return value !== null && value !== undefined ? value : defaultValue;
    }

    setFlag(id, flagName, value) {
        super.setFlag(`event_${id}`, flagName, value);
    }
}

window.EventFlagLibrary = new EventFlagLibrary();
