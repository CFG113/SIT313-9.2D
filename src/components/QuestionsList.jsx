import React from "react";
import { Box, Grid } from "@radix-ui/themes";
import QuestionCard from "./QuestionCard";

export default function QuestionsList(props) {
  const items = props.items;
  return (
    <Box style={{ maxWidth: 960, marginInline: "auto" }}>
      <Grid columns={{ initial: "1", sm: "2" }} gap="5">
        {items.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </Grid>
    </Box>
  );
}
