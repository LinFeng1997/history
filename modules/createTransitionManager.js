function createTransitionManager() {

  function confirmTransitionTo(
    location,
    action,
    getUserConfirmation,
    callback
  ) {
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    callback(true);
  }

  let listeners = [];

  function appendListener(fn) {
    let isActive = true;

    function listener(...args) {
      if (isActive) fn(...args);
    }

    listeners.push(listener);

    return () => {
      isActive = false;
      listeners = listeners.filter(item => item !== listener);
    };
  }

  function notifyListeners(...args) {
    listeners.forEach(listener => listener(...args));
  }

  return {
    confirmTransitionTo,
    appendListener,
    notifyListeners
  };
}

export default createTransitionManager;
