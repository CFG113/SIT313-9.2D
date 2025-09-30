import React, { useState, useRef } from "react";
import { Box, Button, Flex } from "@radix-ui/themes";
import { uploadImage, createArticleDocFromData } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { validateArticlePost } from "../utils/error";

const AddArticle = () => {
  const navigate = useNavigate();

  const [article, setArticle] = useState({
    title: "",
    abstract: "",
    text: "",
    tags: "",
  });
  const { title, abstract, text, tags } = article;

  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
  };

  const handleBrowse = () => fileInputRef.current?.click();
  const handleFileSelect = (e) => {
    const f = e.target.files?.[0] || null;
    setImageFile(f);
    setErrors((prev) => ({ ...prev, image: "", form: "" }));
  };
  const clearImage = () => setImageFile(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const { next, tagList } = validateArticlePost({
      title,
      abstract,
      text,
      tags,
      imageFile,
    });

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    try {
      setIsLoading(true);
      let imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await createArticleDocFromData({
        title: title.trim(),
        abstract: abstract.trim(),
        text: text.trim(),
        tags: tagList,
        ...(imageUrl ? { imageUrl } : {}),
      });

      navigate("/questions");
    } catch (error) {
      console.log("save article error", error);
      setErrors({ form: "Failed to save article. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const imageName = imageFile?.name ?? "";

  return (
    <form onSubmit={handleSubmit}>
      {/* Title row */}
      <Box style={{ padding: "1rem 1.5rem" }}>
        <Flex align="center" gap="3" style={{ width: "100%", display: "flex" }}>
          <label style={{ fontWeight: "bold" }}>Title</label>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              name="title"
              value={title}
              placeholder="Enter a descriptive title"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid black",
              }}
            />
            {errors.title ? (
              <div className="text-500-red">{errors.title}</div>
            ) : null}
          </div>
        </Flex>
      </Box>

      {/* Image picker */}
      <div style={{ padding: "0 1.5rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <label style={{ fontWeight: "bold" }}>Add an image:</label>

          <input
            type="text"
            value={imageName}
            readOnly
            style={{ flex: 1, padding: "0.5rem", border: "1px solid black" }}
          />

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Button type="button" onClick={handleBrowse}>
              Browse
            </Button>
            <Button type="button" disabled={!imageFile} onClick={clearImage}>
              Clear
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>

        {imageFile ? (
          <p style={{ marginTop: "0.5rem" }}>
            <span style={{ fontWeight: "bold" }}>Attached (pending):</span>{" "}
            {imageName}
          </p>
        ) : null}

        {errors.image ? (
          <p className="text-500-red" style={{ marginTop: "0.5rem" }}>
            {errors.image}
          </p>
        ) : null}
        {errors.form ? (
          <p className="text-500-red" style={{ marginTop: "0.5rem" }}>
            {errors.form}
          </p>
        ) : null}
      </div>

      {/* Abstract */}
      <div className="ui form" style={{ padding: "1rem" }}>
        <div className="field">
          <label style={{ fontWeight: "bold" }}>Abstract</label>
          <textarea
            rows="4"
            name="abstract"
            value={abstract}
            placeholder="Enter a 1-paragraph abstract"
            onChange={handleChange}
            style={{ width: "100%", border: "1px solid black" }}
          />
          {errors.abstract ? (
            <div className="text-500-red">{errors.abstract}</div>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="ui form" style={{ padding: "1rem" }}>
        <div className="field">
          <label style={{ fontWeight: "bold" }}>Article Text</label>
          <textarea
            rows="8"
            name="text"
            value={text}
            placeholder="Enter the article body"
            onChange={handleChange}
            style={{ width: "100%", border: "1px solid black" }}
          />
          {errors.text ? (
            <div className="text-500-red">{errors.text}</div>
          ) : null}
        </div>
      </div>

      {/* Tags row */}
      <Box style={{ padding: "1rem 1.5rem" }}>
        <Flex align="center" gap="3" style={{ width: "100%", display: "flex" }}>
          <label style={{ fontWeight: "bold" }}>Tags</label>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              name="tags"
              value={tags}
              placeholder="Add up to 3 tags to describe what your article is about e.g., Java"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid black",
              }}
            />
            {errors.tags ? (
              <div className="text-500-red">{errors.tags}</div>
            ) : null}
          </div>
        </Flex>
      </Box>

      {/* Submit */}
      <div style={{ padding: "1rem", textAlign: "right" }}>
        <Button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            marginRight: "2rem",
          }}
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};

export default AddArticle;
