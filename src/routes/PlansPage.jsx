import React, { useContext } from "react";
import {
  Section,
  Container,
  Flex,
  Heading,
  Text,
  Card,
  Box,
  Grid,
  Separator,
  Button,
  Badge,
} from "@radix-ui/themes";
import { UserContext } from "@/context/user.context";
import usePremiumStatus from "@/hooks/usePremiumStatus";
import { createCheckoutSession } from "@/utils/firebase";

export default function PlansPage() {
  const { currentUser } = useContext(UserContext);
  const { isPremium, loading } = usePremiumStatus(currentUser);

  const handleUpgrade = async () => {
    if (!currentUser) {
      alert("Please sign in to upgrade.");
      return;
    }
    try {
      await createCheckoutSession(currentUser.uid);
    } catch (error) {
      console.error("Checkout init failed:", error);
    }
  };

  return (
    <Section>
      <Container>
        {loading ? (
          <Text size="3" role="status" aria-live="polite" mb="3">
            Checking your plan…
          </Text>
        ) : (
          <>
            <Flex
              align="center"
              justify="between"
              direction={{ initial: "column", md: "row" }}
              gap="3"
              mb="5"
            >
              <div>
                <Heading as="h1" size="8">
                  Upgrade your plan
                </Heading>
                <Text size="3" color="gray">
                  Choose the plan that fits you.
                </Text>
              </div>
            </Flex>

            <Grid
              columns={{ initial: "1", sm: "2" }}
              gap="4"
              width="auto"
              align="stretch"
            >
              {/* Free Plan */}
              <Card size="3" variant="surface" aria-label="Free plan">
                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Heading as="h2" size="6">
                      Free
                    </Heading>
                    <Badge color="gray" variant="soft">
                      Starter
                    </Badge>
                  </Flex>

                  <Box>
                    <Text as="div" size="7" weight="bold">
                      $0{" "}
                      <Text as="span" size="3" color="gray">
                        / month
                      </Text>
                    </Text>
                  </Box>

                  <Separator my="2" size="4" />

                  <Box>
                    <Text as="div" size="3" color="gray">
                      What's included
                    </Text>
                    <Box mt="2">
                      <Text as="div" size="3">
                        Basic usage
                      </Text>
                      <Text as="div" size="3" color="gray">
                        No themes
                      </Text>
                      <Text as="div" size="3" color="gray">
                        No marked posts
                      </Text>
                    </Box>
                  </Box>

                  {isPremium ? (
                    <Text size="3" color="green">
                      Included in your Premium subscription
                    </Text>
                  ) : (
                    <Text
                      size="5"
                      color="green"
                      weight="bold"
                      role="status"
                      aria-live="polite"
                    >
                      Current plan
                    </Text>
                  )}
                </Flex>
              </Card>

              {/* Premium Plan */}
              <Card size="3" variant="classic" aria-label="Premium plan">
                <Flex direction="column" gap="4">
                  <Flex align="center" justify="between">
                    <Heading as="h2" size="6">
                      Premium
                    </Heading>
                    <Badge color="indigo" variant="solid" highContrast>
                      Most popular
                    </Badge>
                  </Flex>

                  <Box>
                    <Text as="div" size="7" weight="bold">
                      $12{" "}
                      <Text as="span" size="3" color="gray">
                        / month
                      </Text>
                    </Text>
                  </Box>

                  <Separator my="2" size="4" />

                  <Box>
                    <Text as="div" size="3" color="gray">
                      Everything in Free, plus
                    </Text>
                    <Box mt="2">
                      <Text as="div" size="3">
                        Themes
                      </Text>
                      <Text as="div" size="3">
                        Marked posts
                      </Text>
                      <Text as="div" size="3">
                        Priority support
                      </Text>
                    </Box>
                  </Box>

                  {isPremium ? (
                    <Text
                      size="5"
                      color="green"
                      weight="bold"
                      role="status"
                      aria-live="polite"
                    >
                      Current plan
                    </Text>
                  ) : (
                    <Button size="3" highContrast onClick={handleUpgrade}>
                      Upgrade to Premium
                    </Button>
                  )}
                </Flex>
              </Card>
            </Grid>
          </>
        )}
      </Container>
    </Section>
  );
}
