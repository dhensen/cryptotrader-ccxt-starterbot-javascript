/**
 * Credits go to: https://italonascimento.github.io/applying-a-timeout-to-your-promises/
 *
 * @param {int} ms - A timeout in milliseconds
 * @param {Promise} promise - The promise to race with timeout
 */
module.exports = function(ms, promise) {
    let timeoutId;
    let timeout = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            clearTimeout(timeoutId);
            reject('Timed out in ' + ms + 'ms.');
        }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout])
        .then(result => {
            clearTimeout(timeoutId);
            return result;
        })
        .catch(err => console.error(err));
};
