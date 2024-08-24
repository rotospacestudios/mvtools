class GlobalFlagLibrary extends FlagLibrary {
    // Add any specific methods for GlobalFlagLibrary if needed
    run(id, functionName, ...args) {
        if (typeof this[functionName] === 'function') {
            return this[functionName](id, ...args);
        } else {
            console.error(`Function ${functionName} not found in GlobalFlagLibrary.`);
        }
    }

    getFlag(id, flagName, defaultValue = null) {
        const value = super.getFlag(`global_${id}`, flagName);
        return value !== null && value !== undefined ? value : defaultValue;
    }

    setFlag(id, flagName, value) {
        super.setFlag(`global_${id}`, flagName, value);
    }
}

window.GlobalFlagLibrary = new GlobalFlagLibrary();
