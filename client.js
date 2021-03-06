const publicVapidKey = 'BJDV2UtuOj35ywfQnhgStMD_6KWQdI6aRa0Tq7J8laG9CBEZcng7_3bR23MdJOBA-GaXyL2mDiQXHxY8JwSVcG8';

if ('serviceWorker' in navigator) {
  console.log('Registering service worker');
  
  // Handler for messages coming from the service worker
  navigator.serviceWorker.addEventListener('message', function(event){
        console.log("Client Received Message: " + event.data);
	alert(event.data);
        //event.ports[0].postMessage("Client 1 Says 'Hello back!'");
    });
	
  run().catch(error => console.error(error));
}

if('serviceWorker' in navigator){
    
}

async function run() {
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.
    register('/worker.js', {scope: '/'});
  console.log('Registered service worker');

  console.log('Registering push');
  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
  console.log('Registered push');

  console.log('Sending push');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Sent push');
}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
