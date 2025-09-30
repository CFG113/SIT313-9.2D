import React, { useContext, useState } from "react";
import { Box, Flex, TextField, Select, Button, Text } from "@radix-ui/themes";
import { QuestionsContext } from "../context/questions.context";
import { Link } from "react-router-dom";
import QuestionsList from "../components/QuestionsList";
import { UserContext } from "@/context/user.context";

const toDate = (v) => v?.toDate?.() ?? new Date(v);
const WINDOWS = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export default function FindQuestionPage() {
  const { questions, loading } = useContext(QuestionsContext);
  const { currentUser } = useContext(UserContext);

  const [query, setQuery] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [datePreset, setDatePreset] = useState("all");

  const q = query.trim().toLowerCase();
  const tags = new Set(
    tagsInput
      .split(/[,\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
  );
  const after =
    datePreset === "all" ? 0 : Date.now() - (WINDOWS[datePreset] || 0);

  const filtered = questions
    .filter(
      (it) =>
        (!after || +toDate(it.createdAt) >= after) &&
        (!q || (it.titleLower ?? (it.title || "").toLowerCase()).includes(q)) &&
        (!tags.size ||
          (it.tags || []).some((t) => tags.has((t || "").toLowerCase())))
    )
    .sort((a, b) => +toDate(b.createdAt) - +toDate(a.createdAt));

  const reset = () => {
    setQuery("");
    setTagsInput("");
    setDatePreset("all");
  };

  return (
    <>
      <Box style={{ maxWidth: 960, marginInline: "auto" }}>
        <Flex align="center" gap="3" wrap="wrap" mb="4">
          <TextField.Root
            placeholder="Search title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <TextField.Root
            placeholder="Tags"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
          <Select.Root value={datePreset} onValueChange={setDatePreset}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="all">All time</Select.Item>
              <Select.Item value="24h">Last 24h</Select.Item>
              <Select.Item value="7d">Last 7 days</Select.Item>
              <Select.Item value="30d">Last 30 days</Select.Item>
            </Select.Content>
          </Select.Root>
          <Button variant="soft" onClick={reset}>
            Clear
          </Button>

          {currentUser ? (
            <Button asChild style={{ marginLeft: "auto" }}>
              <Link to="/post">Add Post</Link>
            </Button>
          ) : (
            <Button asChild variant="soft" style={{ marginLeft: "auto" }}>
              <Link to="/login">Sign in to post</Link>
            </Button>
          )}
        </Flex>

        {loading ? (
          <Text size="3">Loading data…</Text>
        ) : filtered.length === 0 ? (
          <Flex direction="column" align="center" mt="9">
            <Text size="6">No Questions</Text>
          </Flex>
        ) : (
          <QuestionsList items={filtered} />
        )}
      </Box>
    </>
  );
}
