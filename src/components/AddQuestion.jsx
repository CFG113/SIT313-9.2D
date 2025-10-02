import React, { useState, useContext } from "react";
import { Box, Button, Flex } from "@radix-ui/themes";
import { createQuestionDocFromData } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { validateQuestionPost } from "../utils/error";
import { UserContext } from "@/context/user.context";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { oneDark } from "@codemirror/theme-one-dark";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";

export default function AddQuestion() {
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const [view, setView] = useState("write");

  const [question, setQuestion] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const { title, description, tags } = question;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setQuestion((pre) => ({ ...pre, [name]: value }));
    setErrors((pre) => ({ ...pre, [name]: "", form: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const { next, tagList } = validateQuestionPost({
      title,
      description,
      tags,
    });
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    try {
      setLoading(true);
      await createQuestionDocFromData({
        title: title.trim(),
        description: description.trim(),
        tags: tagList,
        authorUid: currentUser.uid,
      });
      navigate("/questions");
    } catch (error) {
      console.log("error in saving question", error);
      setErrors({ form: "Failed to save question. Please try again." });
    } finally {
      setLoading(false);
    }
  };

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
              placeholder="Start your question with how, what, why, etc."
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

      <Box style={{ padding: "1rem 1.5rem" }}>
        <Flex direction="column" gap="3">
          <label style={{ fontWeight: "bold" }}>Describe your problem</label>

          <div
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
          >
            <button
              type="button"
              onClick={() => setView("write")}
              disabled={view === "write"}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setView("preview")}
              disabled={view === "preview"}
            >
              Preview
            </button>
          </div>

          {/* Editor / Preview */}
          {view === "write" ? (
            <CodeMirror
              value={description}
              height="260px"
              theme={oneDark}
              extensions={[
                markdown({ base: markdownLanguage, codeLanguages: languages }),
              ]}
              onChange={(value) => {
                setQuestion((pre) => ({ ...pre, description: value }));
                setErrors((pre) => ({ ...pre, description: "", form: "" }));
              }}
            />
          ) : (
            <div
              style={{
                border: "1px solid black",
                padding: "0.75rem",
                background: "white",
                color: "black",
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              >
                {description || "_Nothing to preview yet…_"}
              </ReactMarkdown>
            </div>
          )}
        </Flex>
      </Box>

      {/* Tags row */}
      <Box style={{ padding: "1rem 1.5rem" }}>
        <Flex align="center" gap="3" style={{ width: "100%", display: "flex" }}>
          <label style={{ fontWeight: "bold" }}>Tags</label>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              name="tags"
              value={tags}
              placeholder="Add up to 3 tags to describe what your question is about e.g., Java"
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

      {errors.form ? (
        <div className="text-500-red" style={{ padding: "0 1.5rem" }}>
          {errors.form}
        </div>
      ) : null}

      <div style={{ padding: "1rem", textAlign: "right" }}>
        <Button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            marginRight: "2rem",
          }}
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
