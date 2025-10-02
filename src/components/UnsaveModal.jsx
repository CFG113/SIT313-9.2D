import { Dialog, Button, Flex } from "@radix-ui/themes";

export default function UnsaveModal({ unsaving, onConfirm }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant="soft">Unsave</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Unsave question?</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to remove this question from your saved list?
        </Dialog.Description>

        <Flex justify="between" gap="3" mt="4">
          <Dialog.Close>
            <Button variant="soft" disabled={unsaving}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button color="ruby" onClick={onConfirm} disabled={unsaving}>
            {unsaving ? "Unsaving..." : "Unsave"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
