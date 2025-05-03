import { blockTypes } from "@/app/test/page";
import {
  Button,
  Text,
  Dialog,
  CloseButton,
  Portal,
  Image,
  Center,
} from "@chakra-ui/react";
import { useAtom, useSetAtom } from "jotai";
import { modalAtom } from "@/lib/jotai/modalAtom";
import { hoveredIndexAtom } from "@/lib/jotai/hoveredIndexAtom";

export default function ArticleModal({
  data,
  modalWidth,
}: {
  data: blockTypes;
  modalWidth: number;
}) {
  const onOpen = useSetAtom(modalAtom);
  const setHoveredIndex = useSetAtom(hoveredIndexAtom);

  const modalJotai = (isOpen: boolean) => {
    onOpen(isOpen);
    if (!isOpen) {
      setHoveredIndex(null);
    }
  };

  return (
    <>
      <Dialog.Root
        size="xl"
        placement={"center"}
        scrollBehavior={"inside"}
        onOpenChange={(e) => modalJotai(e.open)}
      >
        <Dialog.Trigger asChild>
          <Button bgColor={"pink.500"} variant={"subtle"} size="xs">
            この{data.canvasmode == "Article" ? "記事を読む" : "写真を見る"}
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content w={modalWidth}>
              <Dialog.Header margin={modalWidth / 50}>
                <Dialog.Title margin={modalWidth / 50} fontSize={"2xl"}>
                  {data.title}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body margin={modalWidth / 100}>
                {data.image ? (
                  <Center>
                    <Image src={data.image} w="90%" />
                  </Center>
                ) : null}
                <Text
                  fontSize={"md"}
                  whiteSpace={"pre-line"}
                  margin={modalWidth / 50}
                >
                  {data.content}
                </Text>
              </Dialog.Body>
              <Dialog.Footer margin={modalWidth / 100}></Dialog.Footer>
              <Dialog.CloseTrigger top="0" insetEnd="0" asChild>
                <CloseButton bg="bg" size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
