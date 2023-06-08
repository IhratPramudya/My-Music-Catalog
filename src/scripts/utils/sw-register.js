// Menggunakan Workbox untuk Service Worker

import * as WorkboxWindow from 'workbox-window';

const swRegister = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported in the browser');
    return;
  }

  const wb = new WorkboxWindow.Workbox('./sw.bundle.js');

  try {
    await wb.register();
    console.log('Service worker registered');
  } catch (error) {
    console.log('Failed to register service worker', error);
  }
};

export default swRegister;

// Menggunakan Service Worker menggunakan Logika
// const swRegister = async () => {
//   if (!('serviceWorker' in navigator)) {
//     console.log('Service Worker not supported in the browser');
//   }

//   try {
//     await navigator.serviceWorker.register('./sw.bundle.js');
//     console.log('Service Worker registered');
//   } catch (error) {
//     console.log('Failed to register service worker');
//   }
// };

// export default swRegister;
