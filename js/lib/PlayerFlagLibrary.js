class PlayerFlagLibrary extends FlagLibrary {
    // Add any specific methods for PlayerFlagLibrary if needed
    run(id, functionName, ...args) {
        if (typeof this[functionName] === 'function') {
            return this[functionName](id, ...args);
        } else {
            console.error(`Function ${functionName} not found in PlayerFlagLibrary.`);
        }
    }

    getFlag(id, flagName, defaultValue = null) {
        const value = super.getFlag(`player_${id}`, flagName);
        return value !== null && value !== undefined ? value : defaultValue;
    }

    setFlag(id, flagName, value) {
        super.setFlag(`player_${id}`, flagName, value);
    }
}

window.PlayerFlagLibrary = new PlayerFlagLibrary();
