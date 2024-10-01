class ReduxDispatchSingleton {
    static Dispatch;

    static setDispatch(value) {
        ReduxDispatchSingleton.Dispatch = value;
    }

    static getDispatch() {
        return ReduxDispatchSingleton.Dispatch;
    }
}

export default ReduxDispatchSingleton;
