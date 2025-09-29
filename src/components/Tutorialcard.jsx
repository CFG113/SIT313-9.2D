import { Card, Inset, Text, Flex, AspectRatio } from "@radix-ui/themes";
import { FaStar } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

function TutorialCard(props) {
  const { title, thumbnailUrl, views, ratingsCount, ratingsSum } = props;

  const avg = ratingsSum / ratingsCount;
  const safeAvg = avg > 0 ? avg.toFixed(1) : 0;

  return (
    <Card size="2" variant="surface" style={{ width: 260 }}>
      <Inset clip="border-box" side="top" pb="current">
        <AspectRatio ratio={16 / 9}>
          <img
            src={
              thumbnailUrl ||
              "https://via.placeholder.com/640x360?text=No+Thumbnail"
            }
            alt={title || "Tutorial thumbnail"}
            loading="lazy"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </AspectRatio>
      </Inset>

      <Text as="div" size="2" weight="bold">
        {title}
      </Text>
      <Flex align="center" gap="2">
        <Flex align="center" gap="1">
          <Text size="1" color="gray">
            <FaStar />
          </Text>
          <Text size="1" color="gray">
            {safeAvg} ({ratingsCount})
          </Text>
        </Flex>

        <Text size="1" color="gray">
          ·
        </Text>

        <Flex align="center" gap="1">
          <Text size="1" color="gray">
            <FiEye />
          </Text>
          <Text size="1" color="gray">
            {views} views
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}

export default TutorialCard;
