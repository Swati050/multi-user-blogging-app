import axios from "axios";
import authService from "../authService";

// Mock axios
jest.mock("axios");

describe("authService", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    const mockUserData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    const mockResponse = {
      data: {
        user: {
          _id: "1",
          name: mockUserData.name,
          email: mockUserData.email,
        },
        token: "mock-jwt-token",
      },
    };

    it("should sign up a user successfully", async () => {
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.signup(mockUserData);
      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith("/api/auth/signup", mockUserData);
    });

    it("should handle errors when signing up", async () => {
      const errorMessage = "Email already exists";
      axios.post.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(authService.signup(mockUserData)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("login", () => {
    const mockCredentials = {
      email: "john@example.com",
      password: "password123",
    };

    const mockResponse = {
      data: {
        user: {
          _id: "1",
          name: "John Doe",
          email: mockCredentials.email,
        },
        token: "mock-jwt-token",
      },
    };

    it("should log in a user successfully", async () => {
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login(mockCredentials);
      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(
        "/api/auth/login",
        mockCredentials
      );
    });

    it("should handle errors when logging in", async () => {
      const errorMessage = "Invalid email or password";
      axios.post.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(authService.login(mockCredentials)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("getCurrentUser", () => {
    const mockUser = {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
    };

    it("should fetch current user successfully", async () => {
      axios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await authService.getCurrentUser();
      expect(result).toEqual(mockUser);
      expect(axios.get).toHaveBeenCalledWith("/api/auth/me");
    });

    it("should handle errors when fetching current user", async () => {
      const errorMessage = "Not authenticated";
      axios.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(authService.getCurrentUser()).rejects.toThrow(errorMessage);
    });
  });

  describe("updateProfile", () => {
    const mockUpdateData = {
      name: "John Smith",
      email: "john.smith@example.com",
    };

    const mockUpdatedUser = {
      _id: "1",
      ...mockUpdateData,
    };

    it("should update profile successfully", async () => {
      axios.put.mockResolvedValueOnce({ data: mockUpdatedUser });

      const result = await authService.updateProfile(mockUpdateData);
      expect(result).toEqual(mockUpdatedUser);
      expect(axios.put).toHaveBeenCalledWith(
        "/api/auth/profile",
        mockUpdateData
      );
    });

    it("should handle errors when updating profile", async () => {
      const errorMessage = "Failed to update profile";
      axios.put.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(authService.updateProfile(mockUpdateData)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("changePassword", () => {
    const mockPasswordData = {
      currentPassword: "oldpassword123",
      newPassword: "newpassword123",
    };

    const mockResponse = {
      data: { message: "Password changed successfully" },
    };

    it("should change password successfully", async () => {
      axios.put.mockResolvedValueOnce(mockResponse);

      const result = await authService.changePassword(mockPasswordData);
      expect(result).toEqual(mockResponse.data);
      expect(axios.put).toHaveBeenCalledWith(
        "/api/auth/change-password",
        mockPasswordData
      );
    });

    it("should handle errors when changing password", async () => {
      const errorMessage = "Current password is incorrect";
      axios.put.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(
        authService.changePassword(mockPasswordData)
      ).rejects.toThrow(errorMessage);
    });
  });
});
