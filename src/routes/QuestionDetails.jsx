import React, { useContext, useState, useEffect } from "react";
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
import usePremiumStatus from "@/hooks/usePremiumStatus";
import SavedModal from "@/components/SaveModal";
import {
  saveQuestion,
  isQuestionSaved,
  unsaveQuestion,
} from "@/utils/firebase";
import UnsaveModal from "@/components/UnsaveModal";

const toDate = (v) => v?.toDate?.() ?? new Date(v);

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const { questions, loading } = useContext(QuestionsContext);

  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(null);

  const question = questions?.find?.((x) => x.id === id);

  const canDelete =
    !!currentUser &&
    !!question?.authorUid &&
    currentUser.uid === question.authorUid;

  const { isPremium, loading: loadingPremium } = usePremiumStatus(currentUser);

  // render unsave if user wants to remove the question from there saved
  useEffect(() => {
    async function decide() {
      const uid = currentUser?.uid;
      if (!uid || !id) {
        setIsSaved(false);
        return;
      }
      try {
        const already = await isQuestionSaved(uid, id);
        setIsSaved(!!already);
      } catch {
        setIsSaved(false);
      }
    }
    decide();
  }, [currentUser?.uid, id]);

  // Author can delete their own question
  async function handleDelete() {
    if (!id) return;
    try {
      setDeleting(true);
      await deleteQuestionDocById(id);
      navigate("/questions");
    } catch (error) {
      console.error(error);
      setError("Failed to delete question");
      setDeleting(false);
    }
  }

  // Premium user can save their question to their save post page
  async function handleSave() {
    if (!currentUser || !question) return;
    try {
      setSaving(true);
      await saveQuestion(currentUser.uid, { ...question, id: question.id });
      setIsSaved(true);
      navigate("/saved");
    } catch (error) {
      console.error("save failed:", error);
      setError("Failed to save question");
    } finally {
      setSaving(false);
    }
  }

  // allow premium users to unsave posts from their save post page
  async function handleUnsave() {
    if (!currentUser?.uid || !id) return;
    try {
      await unsaveQuestion(currentUser.uid, id);
      setIsSaved(false);
      navigate("/saved");
    } catch (error) {
      setError("Failed to unsave question", error);
    }
  }

  const isPageLoading = loading || loadingPremium;
  return (
    <Box style={{ maxWidth: 800, marginInline: "auto" }}>
      {isPageLoading && (
        <Box>
          <Text>Loading…</Text>
        </Box>
      )}

      {!isPageLoading && !question && (
        <Box>
          <Text>Question not found.</Text>
          <Button mt="3" variant="soft" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      )}

      {!isPageLoading && question && (
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
                <div style={{ marginLeft: 10, display: "inline-flex" }}>
                  {!loadingPremium &&
                    isPremium &&
                    (isSaved ? (
                      <UnsaveModal unsaving={false} onConfirm={handleUnsave} />
                    ) : (
                      <SavedModal saving={saving} onConfirm={handleSave} />
                    ))}
                </div>
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
