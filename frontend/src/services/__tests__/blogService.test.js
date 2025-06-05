import axios from "axios";
import blogService from "../blogService";

// Mock axios
jest.mock("axios");

describe("blogService", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllBlogs", () => {
    const mockBlogs = {
      blogs: [
        {
          _id: "1",
          title: "Test Blog",
          content: "Test Content",
          category: "Technology",
          authorName: "John Doe",
        },
      ],
      page: 1,
      pages: 1,
      count: 1,
    };

    it("should fetch blogs successfully", async () => {
      axios.get.mockResolvedValueOnce({ data: mockBlogs });

      const result = await blogService.getAllBlogs();
      expect(result).toEqual(mockBlogs);
      expect(axios.get).toHaveBeenCalledWith("/api/blogs", { params: {} });
    });

    it("should fetch blogs with filters", async () => {
      const filters = {
        category: "Technology",
        authorName: "John",
        page: 2,
        limit: 6,
      };

      axios.get.mockResolvedValueOnce({ data: mockBlogs });

      const result = await blogService.getAllBlogs(filters);
      expect(result).toEqual(mockBlogs);
      expect(axios.get).toHaveBeenCalledWith("/api/blogs", { params: filters });
    });

    it("should handle errors when fetching blogs", async () => {
      const errorMessage = "Failed to fetch blogs";
      axios.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(blogService.getAllBlogs()).rejects.toThrow(errorMessage);
    });
  });

  describe("getBlogById", () => {
    const mockBlog = {
      _id: "1",
      title: "Test Blog",
      content: "Test Content",
      category: "Technology",
      authorName: "John Doe",
    };

    it("should fetch a single blog successfully", async () => {
      axios.get.mockResolvedValueOnce({ data: mockBlog });

      const result = await blogService.getBlogById("1");
      expect(result).toEqual(mockBlog);
      expect(axios.get).toHaveBeenCalledWith("/api/blogs/1");
    });

    it("should handle errors when fetching a single blog", async () => {
      const errorMessage = "Blog not found";
      axios.get.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(blogService.getBlogById("1")).rejects.toThrow(errorMessage);
    });
  });

  describe("createBlog", () => {
    const mockBlogData = {
      title: "New Blog",
      content: "New Content",
      category: "Technology",
    };

    const mockCreatedBlog = {
      _id: "1",
      ...mockBlogData,
      authorName: "John Doe",
      createdAt: new Date().toISOString(),
    };

    it("should create a blog successfully", async () => {
      axios.post.mockResolvedValueOnce({ data: mockCreatedBlog });

      const result = await blogService.createBlog(mockBlogData);
      expect(result).toEqual(mockCreatedBlog);
      expect(axios.post).toHaveBeenCalledWith("/api/blogs", mockBlogData);
    });

    it("should handle errors when creating a blog", async () => {
      const errorMessage = "Failed to create blog";
      axios.post.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(blogService.createBlog(mockBlogData)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("updateBlog", () => {
    const mockUpdateData = {
      title: "Updated Blog",
      content: "Updated Content",
    };

    const mockUpdatedBlog = {
      _id: "1",
      ...mockUpdateData,
      category: "Technology",
      authorName: "John Doe",
      updatedAt: new Date().toISOString(),
    };

    it("should update a blog successfully", async () => {
      axios.put.mockResolvedValueOnce({ data: mockUpdatedBlog });

      const result = await blogService.updateBlog("1", mockUpdateData);
      expect(result).toEqual(mockUpdatedBlog);
      expect(axios.put).toHaveBeenCalledWith("/api/blogs/1", mockUpdateData);
    });

    it("should handle errors when updating a blog", async () => {
      const errorMessage = "Failed to update blog";
      axios.put.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(blogService.updateBlog("1", mockUpdateData)).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe("deleteBlog", () => {
    it("should delete a blog successfully", async () => {
      const mockResponse = { data: { message: "Blog deleted successfully" } };
      axios.delete.mockResolvedValueOnce(mockResponse);

      const result = await blogService.deleteBlog("1");
      expect(result).toEqual(mockResponse.data);
      expect(axios.delete).toHaveBeenCalledWith("/api/blogs/1");
    });

    it("should handle errors when deleting a blog", async () => {
      const errorMessage = "Failed to delete blog";
      axios.delete.mockRejectedValueOnce({
        response: { data: { message: errorMessage } },
      });

      await expect(blogService.deleteBlog("1")).rejects.toThrow(errorMessage);
    });
  });
});
