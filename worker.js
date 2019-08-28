console.log('Loaded service worker!');

self.addEventListener('push', ev => {
  const data = ev.data.json();
  console.log('Got push', data);
  //var clientId = ev.target.Client;
  //event.ports[0].postMessage("SW Says 'Hello back!'");
  createGistGET(data);
  //clientId.postMessage(data);
});

self.addEventListener('message', function(event){
    console.log("SW Received Message: " + event.data);
    event.ports[0].postMessage("SW Says 'Hello back!'");
});

/*
function createGist(opts) {
  console.log('Posting request to API...');
  fetch('http://localhost:4500/notify', {
    method: 'post',
    body: JSON.stringify(opts)
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('Sent Notification , response json is :', data);
  });
}*/

function createGistGET(opts) {

  console.log('Posting request to Local API...');
  document.showMyData(opts);
  fetch('http://localhost:4444/updateStats.aspx?m='+JSON.stringify(oopts))
//.then(response => response.json())
//.then(data => {
//  console.log(data) 
//})
.catch(error => console.error(error));
}
/*
function postRequest(url, data) {
  return fetch(url, {
    credentials: 'omit', // 'include', default: 'omit'
    method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
    body: JSON.stringify(data), // Coordinate the body type with 'Content-Type'
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  })
  .then(response => response.json())
}
*/
