// src/routes/SavedPage.jsx
import React, { useContext } from "react";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import { UserContext } from "@/context/user.context";
import useSavedQuestions from "@/hooks/useSavedQuestions";
import QuestionsList from "@/components/QuestionsList";

export default function SavedPage() {
  const { currentUser } = useContext(UserContext);
  const uid = currentUser?.uid;
  const { savedQuestions, loading } = useSavedQuestions(uid);

  return (
    <Container size="4" py="6">
      <Flex align="center" justify="between" mb="4">
        <Heading size="6">Saved Questions</Heading>
      </Flex>

      {loading ? (
        <Text size="3">Loading…</Text>
      ) : savedQuestions.length === 0 ? (
        <Flex direction="column" align="center" mt="9">
          <Text size="6">No saved questions yet</Text>
          <Text color="gray" mt="2">
            Save a question from its detail page to see it here.
          </Text>
        </Flex>
      ) : (
        <QuestionsList items={savedQuestions} />
      )}
    </Container>
  );
}
