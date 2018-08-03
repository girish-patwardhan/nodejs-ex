console.log('Loaded service worker!');

self.addEventListener('push', ev => {
  const data = ev.data.json();
  console.log('Got push', data);
  createGist(data);
});

function createGist(opts) {
  console.log('Posting request to GitHub API...');
  fetch('http://localhost:4500/notify', {
    method: 'post',
    body: JSON.stringify(opts)
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('Sent Notification , response json is :', data);
  });
}
