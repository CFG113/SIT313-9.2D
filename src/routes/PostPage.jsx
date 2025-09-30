import React, { useState } from "react";
import { Box, Flex } from "@radix-ui/themes";
import AddArticle from "../components/AddArticle";
import AddQuestion from "../components/AddQuestion";

const PostPage = () => {
  const [postType, setPostType] = useState("question");

  return (
    <>
      {/* Header bar */}
      <Box style={{ backgroundColor: "grey", padding: "1rem 1.5rem" }}>
        <Flex align="center">
          <strong style={{ fontWeight: "bold" }}>New Post</strong>
        </Flex>
      </Box>

      <div className="ui form" style={{ padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <label style={{ marginRight: "0.5rem" }}>Select Post Type:</label>

          <div className="ui radio checkbox">
            <input
              type="radio"
              name="postType"
              value="question"
              checked={postType === "question"}
              onChange={() => setPostType("question")}
            />
            <label>Question</label>
          </div>

          <div className="ui radio checkbox">
            <input
              type="radio"
              name="postType"
              value="article"
              checked={postType === "article"}
              onChange={() => setPostType("article")}
            />
            <label>Article</label>
          </div>
        </div>
      </div>

      {/* Section title bar */}
      <Box style={{ backgroundColor: "grey", padding: "1rem 1.5rem" }}>
        <Flex align="center">
          <strong style={{ fontWeight: "bold" }}>
            What do you want to ask or share
          </strong>
        </Flex>
      </Box>

      <div>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This section is
          designed based on the type of the post. It could be developed by
          conditional rendering.{" "}
          <span style={{ color: "red" }}>
            For post {postType === "article" ? "an article" : "a question"}, the
            following section would be appeared.
          </span>
        </p>
      </div>

      {postType === "article" ? <AddArticle /> : <AddQuestion />}
    </>
  );
};

export default PostPage;
