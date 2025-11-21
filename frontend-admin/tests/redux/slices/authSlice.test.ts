/**
 * Test suite for authSlice
 *
 * Module: authSlice
 * Path: @/redux/slices/authSlice
 *
 * Purpose: Tests Redux slice for authentication state management
 *
 * Test Coverage:
 * - setAuth action - setting full auth state with user data
 * - setAccessToken action - updating access token
 * - setRefreshToken action - updating refresh token
 * - setUserData action - updating user data
 * - clearAuth action - clearing auth state
 * - Edge cases and state transitions
 */
import authReducer, {
  clearAuth,
  setAccessToken,
  setAuth,
  setRefreshToken,
  setUserData,
} from "@/redux/slices/authSlice";

describe("authSlice", () => {
  // Initial state for tests
  const initialState = {
    data: null,
  };

  const mockUser = {
    id: 1,
    email: "test@example.com",
    fullName: "Test User",
    role: "admin",
    address: "123 Test St",
    gender: "male",
    dateOfBirth: "1990-01-01",
    phone: "0123456789",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  const mockAuthData = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    ...mockUser,
  };

  // =========================
  // Step 1: Initial State
  // =========================
  describe("Initial State", () => {
    it("returns initial state when passed undefined state", () => {
      const state = authReducer(undefined, { type: "unknown" });
      expect(state).toEqual(initialState);
    });

    it("has null data by default", () => {
      const state = authReducer(undefined, { type: "unknown" });
      expect(state.data).toBeNull();
    });
  });

  // =========================
  // Step 2: setAuth Action
  // =========================
  describe("setAuth", () => {
    it("sets complete auth state with all user fields", () => {
      const state = authReducer(initialState, setAuth(mockAuthData));

      expect(state.data).not.toBeNull();
      expect(state.data?.accessToken).toBe(mockAuthData.accessToken);
      expect(state.data?.refreshToken).toBe(mockAuthData.refreshToken);
      expect(state.data?.user).toEqual(mockUser);
    });

    it("sets auth state with minimal required fields", () => {
      const minimalAuth = {
        accessToken: "token",
        refreshToken: "refresh",
        id: 1,
        email: "user@test.com",
        fullName: "User",
        role: "user",
      };

      const state = authReducer(initialState, setAuth(minimalAuth));

      expect(state.data?.user?.address).toBeNull();
      expect(state.data?.user?.gender).toBeUndefined();
      expect(state.data?.user?.dateOfBirth).toBeNull();
      expect(state.data?.user?.phone).toBeNull();
      expect(state.data?.user?.avatarUrl).toBeNull();
    });

    it("handles optional fields with null values", () => {
      const authWithNulls = {
        ...mockAuthData,
        address: null,
        gender: null,
        dateOfBirth: null,
        phone: null,
        avatarUrl: null,
      };

      const state = authReducer(initialState, setAuth(authWithNulls));

      expect(state.data?.user?.address).toBeNull();
      expect(state.data?.user?.dateOfBirth).toBeNull();
      expect(state.data?.user?.phone).toBeNull();
      expect(state.data?.user?.avatarUrl).toBeNull();
    });

    it("overwrites existing auth data", () => {
      const existingState = {
        data: {
          accessToken: "old-token",
          refreshToken: "old-refresh",
          user: {
            id: 999,
            email: "old@example.com",
            fullName: "Old User",
            role: "user",
            address: null,
            gender: undefined,
            dateOfBirth: null,
            phone: null,
            avatarUrl: null,
          },
        },
      };

      const state = authReducer(existingState, setAuth(mockAuthData));

      expect(state.data?.accessToken).toBe(mockAuthData.accessToken);
      expect(state.data?.user?.id).toBe(mockUser.id);
      expect(state.data?.user?.email).toBe(mockUser.email);
    });
  });

  // =========================
  // Step 3: setAccessToken Action
  // =========================
  describe("setAccessToken", () => {
    it("updates access token when data exists", () => {
      const stateWithAuth = {
        data: {
          accessToken: "old-token",
          refreshToken: "refresh-token",
          user: mockUser,
        },
      };

      const newToken = "new-access-token";
      const state = authReducer(stateWithAuth, setAccessToken(newToken));

      expect(state.data?.accessToken).toBe(newToken);
      expect(state.data?.refreshToken).toBe("refresh-token");
      expect(state.data?.user).toEqual(mockUser);
    });

    it("does nothing when data is null", () => {
      const state = authReducer(initialState, setAccessToken("new-token"));

      expect(state.data).toBeNull();
    });

    it("preserves all other state fields", () => {
      const stateWithAuth = {
        data: {
          accessToken: "old-token",
          refreshToken: "refresh-token",
          user: mockUser,
        },
      };

      const state = authReducer(stateWithAuth, setAccessToken("updated-token"));

      expect(state.data?.user).toEqual(mockUser);
      expect(state.data?.refreshToken).toBe("refresh-token");
    });
  });

  // =========================
  // Step 4: setRefreshToken Action
  // =========================
  describe("setRefreshToken", () => {
    it("updates refresh token when data exists", () => {
      const stateWithAuth = {
        data: {
          accessToken: "access-token",
          refreshToken: "old-refresh",
          user: mockUser,
        },
      };

      const newRefresh = "new-refresh-token";
      const state = authReducer(stateWithAuth, setRefreshToken(newRefresh));

      expect(state.data?.refreshToken).toBe(newRefresh);
      expect(state.data?.accessToken).toBe("access-token");
      expect(state.data?.user).toEqual(mockUser);
    });

    it("does nothing when data is null", () => {
      const state = authReducer(initialState, setRefreshToken("new-refresh"));

      expect(state.data).toBeNull();
    });

    it("preserves all other state fields", () => {
      const stateWithAuth = {
        data: {
          accessToken: "access-token",
          refreshToken: "old-refresh",
          user: mockUser,
        },
      };

      const state = authReducer(
        stateWithAuth,
        setRefreshToken("updated-refresh")
      );

      expect(state.data?.user).toEqual(mockUser);
      expect(state.data?.accessToken).toBe("access-token");
    });
  });

  // =========================
  // Step 5: setUserData Action
  // =========================
  describe("setUserData", () => {
    it("updates user data when data exists", () => {
      const stateWithAuth = {
        data: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
          user: {
            id: 999,
            email: "old@example.com",
            fullName: "Old User",
            role: "user",
            address: null,
            gender: undefined,
            dateOfBirth: null,
            phone: null,
            avatarUrl: null,
          },
        },
      };

      const state = authReducer(stateWithAuth, setUserData(mockUser));

      expect(state.data?.user).toEqual(mockUser);
      expect(state.data?.accessToken).toBe("access-token");
      expect(state.data?.refreshToken).toBe("refresh-token");
    });

    it("creates data structure when data is null", () => {
      const state = authReducer(initialState, setUserData(mockUser));

      expect(state.data).not.toBeNull();
      expect(state.data?.user).toEqual(mockUser);
      expect(state.data?.accessToken).toBeNull();
      expect(state.data?.refreshToken).toBeNull();
    });

    it("updates user data with partial fields", () => {
      const stateWithAuth = {
        data: {
          accessToken: "token",
          refreshToken: "refresh",
          user: mockUser,
        },
      };

      const updatedUser = {
        ...mockUser,
        fullName: "Updated Name",
        phone: "9999999999",
      };

      const state = authReducer(stateWithAuth, setUserData(updatedUser));

      expect(state.data?.user?.fullName).toBe("Updated Name");
      expect(state.data?.user?.phone).toBe("9999999999");
    });

    it("handles user data with null optional fields", () => {
      const userWithNulls = {
        id: 1,
        email: "test@example.com",
        fullName: "Test",
        role: "user",
        address: null,
        gender: undefined,
        dateOfBirth: null,
        phone: null,
        avatarUrl: null,
      };

      const state = authReducer(initialState, setUserData(userWithNulls));

      expect(state.data?.user?.address).toBeNull();
      expect(state.data?.user?.gender).toBeUndefined();
      expect(state.data?.user?.phone).toBeNull();
    });
  });

  // =========================
  // Step 6: clearAuth Action
  // =========================
  describe("clearAuth", () => {
    it("clears auth data when data exists", () => {
      const stateWithAuth = {
        data: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
          user: mockUser,
        },
      };

      const state = authReducer(stateWithAuth, clearAuth());

      expect(state.data).toBeNull();
    });

    it("remains null when data is already null", () => {
      const state = authReducer(initialState, clearAuth());

      expect(state.data).toBeNull();
    });

    it("completely removes all auth information", () => {
      const stateWithAuth = {
        data: {
          accessToken: "token",
          refreshToken: "refresh",
          user: mockUser,
        },
      };

      const state = authReducer(stateWithAuth, clearAuth());

      expect(state).toEqual(initialState);
    });
  });

  // =========================
  // Step 7: Edge Cases
  // =========================
  describe("Edge Cases", () => {
    it("handles multiple sequential state updates", () => {
      let state = authReducer(initialState, setAuth(mockAuthData));
      expect(state.data?.user?.fullName).toBe("Test User");

      state = authReducer(state, setAccessToken("new-token"));
      expect(state.data?.accessToken).toBe("new-token");

      state = authReducer(state, setRefreshToken("new-refresh"));
      expect(state.data?.refreshToken).toBe("new-refresh");

      const updatedUser = { ...mockUser, fullName: "Updated User" };
      state = authReducer(state, setUserData(updatedUser));
      expect(state.data?.user?.fullName).toBe("Updated User");

      state = authReducer(state, clearAuth());
      expect(state.data).toBeNull();
    });

    it("handles empty string values in optional fields", () => {
      const authWithEmpty = {
        accessToken: "token",
        refreshToken: "refresh",
        id: 1,
        email: "test@test.com",
        fullName: "Test",
        role: "user",
        address: "",
        phone: "",
      };

      const state = authReducer(initialState, setAuth(authWithEmpty));

      // Empty strings are treated as falsy and converted to null
      expect(state.data?.user?.address).toBeNull();
      expect(state.data?.user?.phone).toBeNull();
    });

    it("preserves state immutability", () => {
      const stateWithAuth = {
        data: {
          accessToken: "token",
          refreshToken: "refresh",
          user: mockUser,
        },
      };

      const originalState = JSON.parse(JSON.stringify(stateWithAuth));
      authReducer(stateWithAuth, setAccessToken("new-token"));

      expect(stateWithAuth).toEqual(originalState);
    });
  });
});
