import authReducer, {
  clearAuth,
  setAccessToken,
  setAuth,
  setRefreshToken,
  setUserData,
} from "@/redux/slices/authSlice";

describe("authSlice", () => {
  const initialState = {
    data: null,
  };

  const mockAuthData = {
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    id: 1,
    email: "test@example.com",
    fullName: "Test User",
    role: "USER",
    address: "123 Test St",
    gender: "male",
    dateOfBirth: "1990-01-01",
    phone: "0123456789",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  describe("initial state", () => {
    it("should return the initial state", () => {
      expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
    });
  });

  describe("setAuth", () => {
    it("should set complete auth data with all fields", () => {
      const state = authReducer(initialState, setAuth(mockAuthData));

      expect(state.data).toBeDefined();
      expect(state.data?.accessToken).toBe(mockAuthData.accessToken);
      expect(state.data?.refreshToken).toBe(mockAuthData.refreshToken);
      expect(state.data?.user).toBeDefined();
      expect(state.data?.user?.id).toBe(mockAuthData.id);
      expect(state.data?.user?.email).toBe(mockAuthData.email);
      expect(state.data?.user?.fullName).toBe(mockAuthData.fullName);
      expect(state.data?.user?.role).toBe(mockAuthData.role);
      expect(state.data?.user?.address).toBe(mockAuthData.address);
      expect(state.data?.user?.gender).toBe(mockAuthData.gender);
      expect(state.data?.user?.dateOfBirth).toBe(mockAuthData.dateOfBirth);
      expect(state.data?.user?.phone).toBe(mockAuthData.phone);
      expect(state.data?.user?.avatarUrl).toBe(mockAuthData.avatarUrl);
    });

    it("should set auth data with optional fields as null/undefined", () => {
      const minimalAuthData = {
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
      };

      const state = authReducer(initialState, setAuth(minimalAuthData));

      expect(state.data).toBeDefined();
      expect(state.data?.user?.address).toBeNull();
      expect(state.data?.user?.gender).toBeUndefined();
      expect(state.data?.user?.dateOfBirth).toBeNull();
      expect(state.data?.user?.phone).toBeNull();
      expect(state.data?.user?.avatarUrl).toBeNull();
    });

    it("should override existing auth data", () => {
      const existingState = {
        data: {
          accessToken: "old-token",
          refreshToken: "old-refresh",
          user: {
            id: 999,
            email: "old@example.com",
            fullName: "Old User",
            role: "ADMIN",
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
      expect(state.data?.user?.id).toBe(mockAuthData.id);
      expect(state.data?.user?.email).toBe(mockAuthData.email);
    });
  });

  describe("setAccessToken", () => {
    it("should update access token when data exists", () => {
      const existingState = {
        data: {
          accessToken: "old-token",
          refreshToken: "refresh-token",
          user: {
            id: 1,
            email: "test@example.com",
            fullName: "Test User",
            role: "USER",
            address: null,
            gender: undefined,
            dateOfBirth: null,
            phone: null,
            avatarUrl: null,
          },
        },
      };

      const newToken = "new-access-token";
      const state = authReducer(existingState, setAccessToken(newToken));

      expect(state.data?.accessToken).toBe(newToken);
      expect(state.data?.refreshToken).toBe(existingState.data.refreshToken);
      expect(state.data?.user).toEqual(existingState.data.user);
    });

    it("should not update when data is null", () => {
      const state = authReducer(initialState, setAccessToken("new-token"));
      expect(state.data).toBeNull();
    });
  });

  describe("setRefreshToken", () => {
    it("should update refresh token when data exists", () => {
      const existingState = {
        data: {
          accessToken: "access-token",
          refreshToken: "old-refresh-token",
          user: {
            id: 1,
            email: "test@example.com",
            fullName: "Test User",
            role: "USER",
            address: null,
            gender: undefined,
            dateOfBirth: null,
            phone: null,
            avatarUrl: null,
          },
        },
      };

      const newRefreshToken = "new-refresh-token";
      const state = authReducer(
        existingState,
        setRefreshToken(newRefreshToken)
      );

      expect(state.data?.refreshToken).toBe(newRefreshToken);
      expect(state.data?.accessToken).toBe(existingState.data.accessToken);
      expect(state.data?.user).toEqual(existingState.data.user);
    });

    it("should not update when data is null", () => {
      const state = authReducer(
        initialState,
        setRefreshToken("new-refresh-token")
      );
      expect(state.data).toBeNull();
    });
  });

  describe("setUserData", () => {
    it("should update user data when data exists", () => {
      const existingState = {
        data: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
          user: {
            id: 1,
            email: "old@example.com",
            fullName: "Old User",
            role: "USER",
            address: null,
            gender: undefined,
            dateOfBirth: null,
            phone: null,
            avatarUrl: null,
          },
        },
      };

      const newUserData = {
        id: 1,
        email: "new@example.com",
        fullName: "New User",
        role: "ADMIN",
        address: "456 New St",
        gender: "female",
        dateOfBirth: "1995-05-05",
        phone: "0987654321",
        avatarUrl: "https://example.com/new-avatar.jpg",
      };

      const state = authReducer(existingState, setUserData(newUserData));

      expect(state.data?.user).toEqual(newUserData);
      expect(state.data?.accessToken).toBe(existingState.data.accessToken);
      expect(state.data?.refreshToken).toBe(existingState.data.refreshToken);
    });

    it("should create data object with user when data is null", () => {
      const newUserData = {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
        address: null,
        gender: undefined,
        dateOfBirth: null,
        phone: null,
        avatarUrl: null,
      };

      const state = authReducer(initialState, setUserData(newUserData));

      expect(state.data).toBeDefined();
      expect(state.data?.user).toEqual(newUserData);
      expect(state.data?.accessToken).toBeNull();
      expect(state.data?.refreshToken).toBeNull();
    });
  });

  describe("clearAuth", () => {
    it("should clear all auth data", () => {
      const existingState = {
        data: {
          accessToken: "access-token",
          refreshToken: "refresh-token",
          user: {
            id: 1,
            email: "test@example.com",
            fullName: "Test User",
            role: "USER",
            address: null,
            gender: undefined,
            dateOfBirth: null,
            phone: null,
            avatarUrl: null,
          },
        },
      };

      const state = authReducer(existingState, clearAuth());

      expect(state.data).toBeNull();
    });

    it("should work when data is already null", () => {
      const state = authReducer(initialState, clearAuth());
      expect(state.data).toBeNull();
    });
  });

  describe("action creators", () => {
    it("should create setAuth action with correct type", () => {
      const action = setAuth(mockAuthData);
      expect(action.type).toBe("auth/setAuth");
      expect(action.payload).toEqual(mockAuthData);
    });

    it("should create setAccessToken action with correct type", () => {
      const token = "new-token";
      const action = setAccessToken(token);
      expect(action.type).toBe("auth/setAccessToken");
      expect(action.payload).toBe(token);
    });

    it("should create setRefreshToken action with correct type", () => {
      const token = "new-refresh-token";
      const action = setRefreshToken(token);
      expect(action.type).toBe("auth/setRefreshToken");
      expect(action.payload).toBe(token);
    });

    it("should create setUserData action with correct type", () => {
      const userData = {
        id: 1,
        email: "test@example.com",
        fullName: "Test User",
        role: "USER",
        address: null,
        gender: undefined,
        dateOfBirth: null,
        phone: null,
        avatarUrl: null,
      };
      const action = setUserData(userData);
      expect(action.type).toBe("auth/setUserData");
      expect(action.payload).toEqual(userData);
    });

    it("should create clearAuth action with correct type", () => {
      const action = clearAuth();
      expect(action.type).toBe("auth/clearAuth");
      expect(action.payload).toBeUndefined();
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple sequential updates", () => {
      let state = authReducer(initialState, setAuth(mockAuthData));

      const newToken = "updated-token";
      state = authReducer(state, setAccessToken(newToken));

      const newUserData = {
        ...mockAuthData,
        fullName: "Updated Name",
      };
      state = authReducer(state, setUserData(newUserData));

      expect(state.data?.accessToken).toBe(newToken);
      expect(state.data?.user?.fullName).toBe("Updated Name");
    });

    it("should clear auth and then set new auth", () => {
      let state = authReducer(initialState, setAuth(mockAuthData));
      state = authReducer(state, clearAuth());
      expect(state.data).toBeNull();

      state = authReducer(state, setAuth(mockAuthData));
      expect(state.data).toBeDefined();
      expect(state.data?.accessToken).toBe(mockAuthData.accessToken);
    });
  });
});
