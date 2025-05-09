import { addActionAtom } from "@/lib/jotai/addAction";
import { componentAtom } from "@/lib/jotai/components";
import { maxHeightAtom } from "@/lib/jotai/maxHeightAtom";
import { Box, HStack, Button, Center, VStack, Text } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { LuPlus } from "react-icons/lu";

export default function AddButton({
  empty,
  maxid,
  UNIT,
  windowCubeWidth,
}: {
  empty: number[][] | undefined;
  maxid: number;
  UNIT: number;
  windowCubeWidth: number;
}) {
  const [onAddAction, setOnAddAction] = useAtom(addActionAtom);
  const [maxHeight, setMaxHeight] = useAtom(maxHeightAtom);
  const [components, setComponents] = useAtom(componentAtom);
  return (
    <>
      {onAddAction ? (
        <>
          <Box
            right={5}
            bottom={5}
            position={"fixed"}
            bgColor={"black"}
            zIndex={100}
            borderRadius={"xl"}
          >
            <HStack margin={7}>
              <Button
                onClick={() => {
                  if (empty!.length != 0) {
                    setComponents([
                      ...components,
                      {
                        id: maxid + 1,
                        title: "",
                        content: null,
                        image: null,
                        canvasmode: "Article",
                        link: null,
                        x: empty![0][0],
                        y: empty![0][1],
                        w: 1,
                        h: 1,
                      },
                    ]);
                    setMaxHeight(maxHeight + Math.min(UNIT, windowCubeWidth));
                  } else {
                    setComponents([
                      ...components,
                      {
                        id: maxid + 1,
                        title: "",
                        content: null,
                        image: null,
                        canvasmode: "Article",
                        link: null,
                        x: 0,
                        y: maxHeight / Math.min(UNIT, windowCubeWidth),
                        w: 1,
                        h: 1,
                      },
                    ]);
                  }
                }}
              >
                <Center>
                  <VStack gap={0}>
                    <Box
                      border={"1px solid white"}
                      borderRadius={"md"}
                      w={10}
                      h={10}
                    ></Box>
                    <Text color={"white"}>Cube</Text>
                  </VStack>
                </Center>
              </Button>
              <Button
                onClick={() => {
                  setComponents([
                    ...components,
                    {
                      id: maxid + 1,
                      title: "",
                      content: null,
                      image: null,
                      canvasmode: "Article",
                      link: null,
                      x: 0,
                      y: maxHeight / Math.min(UNIT, windowCubeWidth),
                      w: 2,
                      h: 1,
                    },
                  ]);
                }}
              >
                <Center>
                  <VStack gap={0}>
                    <Box
                      border={"1px solid white"}
                      borderRadius={"md"}
                      w={20}
                      h={10}
                    ></Box>
                    <Text color={"white"}>Rectangle</Text>
                  </VStack>
                </Center>
              </Button>
              <Button
                onClick={() => {
                  setComponents([
                    ...components,
                    {
                      id: maxid + 1,
                      title: "",
                      content: null,
                      image: null,
                      canvasmode: "Article",
                      link: null,
                      x: 0,
                      y: maxHeight / Math.min(UNIT, windowCubeWidth),
                      w: 2,
                      h: 2,
                    },
                  ]);
                }}
              >
                <Center>
                  <VStack gap={0}>
                    <Box
                      border={"1px solid white"}
                      borderRadius={"md"}
                      w={14}
                      h={14}
                    ></Box>
                    <Text color={"white"}>Big Cube</Text>
                  </VStack>
                </Center>
              </Button>
            </HStack>
            <Button
              size={"xs"}
              margin={1}
              onClick={() => setOnAddAction(false)}
              colorPalette={"blue"}
              variant={"subtle"}
            >
              キャンセル
            </Button>
          </Box>
        </>
      ) : (
        <Button
          right={5}
          bottom={5}
          position={"fixed"}
          bgColor={"black"}
          zIndex={100}
          borderRadius={"4xl"}
          onClick={() => setOnAddAction(true)}
        >
          <LuPlus />
        </Button>
      )}
    </>
  );
}
