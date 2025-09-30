import React from "react";
import { Card, Flex, Text, Badge, Box, Separator } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export default function QuestionCard(props) {
  const { question } = props;

  const navigate = useNavigate();
  const created = (
    question.createdAt?.toDate?.() ?? new Date(question.createdAt)
  ).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

  return (
    <Card
      size="2"
      variant="surface"
      onClick={() => navigate(`/questions/${question.id}`)}
      style={{ cursor: "pointer" }}
      role="button"
      tabIndex={0}
    >
      <Flex direction="column" gap="3">
        <Box>
          <Text as="h3" size="3" weight="bold">
            {question.title}
          </Text>
          <Text as="div" size="1" color="gray">
            {created}
          </Text>
        </Box>

        <Text
          as="p"
          size="2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {question.description}
        </Text>

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
        <Flex gap="2" wrap="wrap" onClick={(e) => e.stopPropagation()}></Flex>
      </Flex>
    </Card>
  );
}
