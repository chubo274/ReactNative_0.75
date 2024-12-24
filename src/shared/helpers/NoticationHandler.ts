import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { DeviceEventEmitter, EmitterSubscription, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { v4 as uuidv4 } from 'uuid';
import { EmitType, NOTIFICATION_CHANNEL } from './constant';
import { appState } from 'src/App';
import { ReferenceData } from 'src/models/notification/NotificationModel';
import { pressNoti } from './pressNoti';

interface INotificationHandler {
  onMessage: (message: FirebaseMessagingTypes.RemoteMessage) => void;
  onNotificationDisplayed?: (notification: any) => void;
  onNotificationOpened?: (notificationOpen: any, isForeground: boolean) => void;
}

class NoticationHandler implements INotificationHandler {
  subscription?: EmitterSubscription;

  createDefaultChannel = () => {
    PushNotification.channelExists(NOTIFICATION_CHANNEL, exists => {
      console.info('channel exists: ', exists);
      if (exists) {
        return;
      }
      PushNotification.createChannel({
        channelId: NOTIFICATION_CHANNEL,
        channelName: NOTIFICATION_CHANNEL,
      }, created => {
        console.info(`Created channel ${NOTIFICATION_CHANNEL}: `, created);
      });
    });
  }

  onMessage = (notification: FirebaseMessagingTypes.RemoteMessage) => {
    // DeviceEventEmitter.emit(EmitType.RefreshNotification);
    this.displayNotification(notification);
  };

  /**
   * when app state is ready
   * process navigation of deeplink
   */
  handleOpenNotification = (_notificationOpen: any) => {
    const data: ReferenceData = _notificationOpen?.notification?.additionalData
    pressNoti(data)
  };

  onNotificationOpened = (notificationOpen: any, isForeground: boolean) => {
    console.info('Opened Notification: ', notificationOpen);
    console.info('isForeground: ', isForeground);

    /**
     * Using emitter when open notif from background
     * Wait until all setup steps are done
     */
    if (!isForeground) {
      this.subscription?.remove();
      if (appState?.initializeReady) { // check app state is ready
        this.handleOpenNotification(notificationOpen);
      } else {
        this.subscription = DeviceEventEmitter.addListener(EmitType.InitializeReady, () => {
          console.info('app init success emit');
          this.handleOpenNotification(notificationOpen);
        });
      }
    } else {
      this.handleOpenNotification(notificationOpen);
    }
  };

  displayNotification = (notification: FirebaseMessagingTypes.RemoteMessage) => {
    const payload = notification?.data || {};
    const notificationContent = notification?.notification || {};
    console.info('display noti: ', notification);
    if (notificationContent && notificationContent.body && notificationContent.title) {
      if (Platform.OS === 'ios') {
        PushNotificationIOS.addNotificationRequest({
          id: uuidv4(),
          body: notificationContent.body,
          title: notificationContent.title,
          userInfo: payload
        });
      } else {
        PushNotification.presentLocalNotification({
          message: notificationContent.body,
          title: notificationContent.title,
          userInfo: payload,
          channelId: NOTIFICATION_CHANNEL
        });
      }
    }
  };
}
export default new NoticationHandler();
