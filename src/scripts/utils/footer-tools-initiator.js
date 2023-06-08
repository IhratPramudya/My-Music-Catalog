import CONFIG from "../globals/config";
import NotificationHelper from "./notification-helper";

const FooterToolsInitiator = {
    async init({ subscribeButton, unsubscribeButton }) {
        // menginisialisasikan variable subscribe dan unsubscribe element
        this._subscribeButton = subscribeButton;
        this._unsubscribeButton = unsubscribeButton;

        // membuat isi null ke dalam variable registrasi serviceWorker
        this._registrationServiceWorker = null;

        // mengecek apakah browser mendukung service worker
        if ('serviceWorker' in navigator) {
            /* 
                Jika mendukung makan variable regitrasi di isi 
                dengan proses registrasi service worker
            */  
            this._registrationServiceWorker = await navigator.serviceWorker.getRegistration();
        }

        /* 
            initialListener digunakan untuk menampilan/merender button 
            subscribe dan unsubscribe 
        */
        await this._initialListener();
        await this._initialState();
    },

    async _initialListener() {
        // kode di bawah digunakan untuk tobol click subscribe dan memanggil
        // fungsi _subscribePushMessage() yang digunakan untuk pushMessage
        this._subscribeButton.addEventListener('click', (event) => {
            this._subscribePushMessage(event);
        });

        // kode di bawah digunakan untuk tobol click unsubscribe dan memanggil
        // fungsi _unsubscribePushMessage() yang digunakan untuk unPushMessage
        this._unsubscribeButton.addEventListener('click', (event) => {
            this._unsubscribePushMessage(event);
        } )
    },

    async _initialState() {
        this._showSubscribeButton();
    },

    async _subscribePushMessage(event) {

        // kode di bawah digunakan agar tidak memanggil element induk yang sma
        event.stopPropagation();
        //TODO


        // kode dibawah adalah jika memastikan apakah client sudah terdaftar subscribe
        // jika belum akan mengembalikan false dan jika sudah akan mengembalikan true
        if(await this._isCurrentSubscriptionAvailable()) {
            window.alert('Already subscribe to push message');
            return
        }

        // kode di bawah memeriksa apakah fitur notifikasi tersedia dan juga mengecek
        // apakah akses danied berarrti di tolak dan default berarti netral atau menutup
        // tanda silang pop-up

        if(!await this._isNotificationReady()) {
            console.log('Notification isn\'t available');
            return
        }

        // kode di bawah digunakan untuk mensubscribe dan mengisi kredensial 
        // seperti visibility dan juga data key yang digunakan untuk mengidentifikasi
        // ke sebuah client, dan client mengebalikan true atau false
        console.log('_subscribePushMessage: Subscribing to push message...');
        const pushSubscription = await this._registrationServiceWorker?.pushManager.subscribe(
            this._generateSubscribeOptions(),
          );
        
        // untuk memastikan apakah pushSubscription bernilai true atau false
        // jika false makan condetional di eksekusi jika true coditional di lewatkan
        if (!pushSubscription) {
            console.log('Failed to subscribe push message');
            return
        }

        try {
            // kode ini digunakan untuk mengirimkan pushSubscription ke server dengan 
            // url yang tersedia pada API back end 
            await this._sendPostToServer(CONFIG.PUSH_MSG_SUBSCRIBE_URL, pushSubscription);
            console.log('Push message has been subscribed');
        } catch(err) {
            // error jika ada kesalahan pada server
            console.log('Failed to store push notification data to server:', err.message);
            // mengembalikan subscribing push notification ke unsubscribe jika nilai 
            // pushSubscription sama dengan true
            await pushSubscription?.unsubscribe();
        }

        this._showSubscribeButton();
    },

    async _unsubscribePushMessage(event) {
        event.stopPropagation();
     
        const pushSubscription = await this._registrationServiceWorker?.pushManager.getSubscription();
        if (!pushSubscription) {
          window.alert('Haven\'t subscribing to push message');
          return;
        }
        try {
          await this._sendPostToServer(CONFIG.PUSH_MSG_UNSUBSCRIBE_URL, pushSubscription);
          const isHasBeenUnsubscribed = await pushSubscription.unsubscribe();
          if (!isHasBeenUnsubscribed) {
            console.log('Failed to unsubscribe push message');
            await this._sendPostToServer(CONFIG.PUSH_MSG_SUBSCRIBE_URL, pushSubscription);
            return;
          }
          console.log('Push message has been unsubscribed');
        } catch (err) {
          console.error('Failed to erase push notification data from server:', err.message);
        }

        this._showSubscribeButton();
      },

        // untuk menjeneret api key pada this._generatedSubscriptionOptions() 
        // applicationServerKey ke _urlB64ToUint8Array

    _urlB64ToUint8Array: (base64String) => {
        // eslint-disable-next-line no-mixed-operators
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
     
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < rawData.length; i++) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      },

      // untuk mengirimkan pushSubscription ke server
    async _sendPostToServer(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        return response.json();
    },


    _isSubscribedToServerForHiddenSubscribeButton(state = false) {
        if (state) {
          this._subscribeButton.style.display = 'none';
          this._unsubscribeButton.style.display = 'inline-block';
        } else {
          this._subscribeButton.style.display = 'inline-block';
          this._unsubscribeButton.style.display = 'none';
        }
      },

    async _isCurrentSubscriptionAvailable() {
        // mengecek apakah sudah subscribe atau belum
        const checkSubscription = await this._registrationServiceWorker?.pushManager.getSubscription();
        return Boolean(checkSubscription);
    },

    async _isNotificationReady() {

        // mengecek apakah fitur notifikasi tersedia di browser jika ya makan
        // melewatkan conditional jika tidak makan akan mengeksekusi conditional
        // dan mengembalikan false
        if (!NotificationHelper._checkAvailability()) {
            console.log('Notification not supported in this browser');
            return false;
        }

        // ketika pop-up muncul apakah izin, denied atau default jika deniet atau default
        // maka akn mengeksekusi perintah conditional di bawah
        if (!NotificationHelper._checkPermission()) {
            console.log('User did not granted the notification permission yet');
            const status = await Notification.requestPermission();
            if (status === 'denied') {
              window.alert('Cannot subscribe to push message because the status of notification permission is denied');
              return false;
            }
            if (status === 'default') {
              window.alert('Cannot subscribe to push message because the status of notification permission is ignored');
              return false;
            }
        }

        // jika akses di accept setuju makan kode di atas di lewatkan dan mengembalikan
        // nilai true
        return true;
    },

    async _showSubscribeButton() {
        this._isSubscribedToServerForHiddenSubscribeButton(
          await this._isCurrentSubscriptionAvailable(),
        );
    },
    /*
        Opsi userVisibleOnly ditambahkan untuk memberikan tanda secara resmi 
        bahwa aplikasi web akan menampilkan pemberitahuan setiap kali push message 
        diterima (terhindar dari silent push) dengan memberikan nilai true. 
        Jika tidak menyertakan opsi userVisibleOnly atau memasukkan nilai false, 
        kita akan mendapatkan pesan error seperti berikut
    */
    _generateSubscribeOptions() {
        return {
            userVisibleOnly: true,
            applicationServerKey: this._urlB64ToUint8Array(CONFIG.PUSH_MSG_VAPID_PUBLIC_KEY),
        };
    },
}


export default FooterToolsInitiator;