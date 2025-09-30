import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Box,
  Flex,
  Text,
  Badge,
  Button,
  Separator,
} from "@radix-ui/themes";
import { QuestionsContext } from "@/context/questions.context";
import { deleteQuestionDocById } from "@/utils/firebase";
import { UserContext } from "@/context/user.context";
import DeleteQuestionModal from "@/components/DeleteQuestionModal";

const toDate = (v) => v?.toDate?.() ?? new Date(v);

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { questions, loading } = useContext(QuestionsContext);

  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const question = questions?.find?.((x) => x.id === id);

  const canDelete =
    !!currentUser &&
    !!question?.authorUid &&
    currentUser.uid === question.authorUid;

  async function handleDelete() {
    if (!id) return;
    try {
      setDeleting(true);
      await deleteQuestionDocById(id);
      navigate("/questions");
    } catch (e) {
      console.error(e);
      setError("Failed to delete question");
      setDeleting(false);
    }
  }

  return (
    <Box style={{ maxWidth: 800, marginInline: "auto" }}>
      {loading && (
        <Box>
          <Text>Loading…</Text>
        </Box>
      )}

      {!loading && !question && (
        <Box>
          <Text>Question not found.</Text>
          <Button mt="3" variant="soft" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      )}

      {!loading && question && (
        <Card size="3" variant="surface">
          <Flex direction="column" gap="4">
            <Flex align="center" justify="between">
              <Box>
                <Text as="h1" size="5" weight="bold">
                  {question.title}
                </Text>
                <Text as="div" size="2" color="gray">
                  {toDate(question.createdAt).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </Box>
            </Flex>

            {error && (
              <Text color="ruby" size="2">
                {error}
              </Text>
            )}

            {question.tags?.length ? (
              <Flex gap="2" wrap="wrap">
                {question.tags.map((t) => (
                  <Badge key={t} radius="full" variant="soft">
                    {t}
                  </Badge>
                ))}
              </Flex>
            ) : null}

            <Separator my="2" />

            <Text as="p" size="3" style={{ lineHeight: 1.6 }}>
              {question.description}
            </Text>

            <Flex justify="between" align="center" mt="3">
              <Box>
                <Button variant="soft" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </Box>
              <Box>
                {canDelete && (
                  <DeleteQuestionModal
                    deleting={deleting}
                    onConfirm={handleDelete}
                  />
                )}
              </Box>
            </Flex>
          </Flex>
        </Card>
      )}
    </Box>
  );
}
