import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppNotification } from '../../types';
import { INITIAL_NOTIFICATIONS } from '../../data';

interface NotificationState {
  notifications: AppNotification[];
  isLoading: boolean;
}

const initialState: NotificationState = {
  notifications: INITIAL_NOTIFICATIONS,
  isLoading: false,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
      state.notifications = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find((notif) => notif.id === action.payload);
      if (n) {
        n.isRead = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      state.notifications.unshift(action.payload);
    },
    cleanupPendingAlarmsOnLogout: (state) => {
      // Automatically cancel active task reminders and clear unread alerts on logout
      state.notifications = [];
    },
  },
});

export const {
  setNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  addNotification,
  cleanupPendingAlarmsOnLogout,
} = notificationSlice.actions;

export default notificationSlice.reducer;
