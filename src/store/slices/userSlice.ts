import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, CurrencyCode } from '../../types';
import { INITIAL_USER } from '../../data';
import { AuthUserSession } from '../../services/authService';

interface UserState {
  profile: UserProfile;
  session: AuthUserSession | null;
  isLoading: boolean;
}

const initialState: UserState = {
  profile: INITIAL_USER,
  session: null,
  isLoading: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    updateCurrency: (state, action: PayloadAction<CurrencyCode>) => {
      state.profile.preferredCurrency = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    completeOnboarding: (state) => {
      state.profile.onboardingCompleted = true;
    },
    setAuthSession: (state, action: PayloadAction<AuthUserSession | null>) => {
      state.session = action.payload;
    },
    clearAuthSession: (state) => {
      state.session = null;
    },
  },
});

export const {
  setUserProfile,
  updateCurrency,
  updateUserProfile,
  completeOnboarding,
  setAuthSession,
  clearAuthSession,
} = userSlice.actions;
export default userSlice.reducer;
