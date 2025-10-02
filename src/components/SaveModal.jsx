import { Dialog, Button, Flex } from "@radix-ui/themes";

export default function SavedModal({ saving, onConfirm }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Save</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>Save question?</Dialog.Title>

        <Dialog.Description>
          Are you sure you want to Save this question?
        </Dialog.Description>

        <Flex justify="between" gap="3" mt="4">
          <Dialog.Close>
            <Button variant="soft" disabled={saving}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={onConfirm} disabled={saving}>
            {saving ? "saving..." : "Save"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
