module.exports = function(ms, promise) {
    let timeoutId;
    let timeout = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject('Timed out in ' + ms + 'ms.');
        }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]).then(result => {
        clearTimeout(timeoutId);
        return result;
    });
};
