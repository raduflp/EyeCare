/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {

    bounds: {
      width: 400,
      height: 235
    },
    frame: 'none',
    resizable: false
  });
});
      