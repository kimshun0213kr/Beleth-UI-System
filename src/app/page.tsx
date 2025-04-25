import { Box, Button, Center, Flex, HStack, VStack } from "@chakra-ui/react";
import Image from "next/image";
type blockTypes = {
  title: string;
  content: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export default function Home() {
  const componentWidth = 240;
  const components: blockTypes[] = [
    { title: "ABC", content: "This is a test block.", x: 0, y: 0, w: 2, h: 1 },
    { title: "ABC", content: "This is a test block.", x: 0, y: 1, w: 1, h: 1 },
    { title: "ABC", content: "This is a test block.", x: 0, y: 2, w: 1, h: 2 },
    { title: "ABC", content: "This is a test block.", x: 0, y: 2, w: 2, h: 2 },
  ];
  const colorArray = ["#ffc0cb", "#e0ffff", "#90ee90"];
  return (
    <div>
      <Center>
        <VStack w="100%">
          <Flex
            wrap="wrap"
            width="100%"
            maxW={componentWidth * 2}
            bgColor="#111111"
            position="relative"
            alignItems="flex-start"
          >
            {components.map((component, index) => {
              const blockWidth = component.w * componentWidth - 10;
              const blockHeight = component.h * componentWidth - 10;

              return (
                <Box
                  key={`${component.title}-${index}`}
                  width={`${blockWidth}px`}
                  height={`${blockHeight}px`}
                  bgColor={colorArray[Math.floor(Math.random() * 3)]}
                  borderRadius="3xl"
                  p={4}
                  m="1" // ちょっと余白
                  color="black"
                  boxSizing="border-box"
                >
                  <strong>{component.title}</strong>
                  <p>{component.content}</p>
                </Box>
              );
            })}
          </Flex>
        </VStack>
      </Center>
      <Button
        position={"absolute"}
        bottom={5}
        right={5}
        w="50px"
        h="50px"
        borderRadius={"2xl"}
        // onClick={() =>
        //   components.push({
        //     title: "ABC",
        //     content: "This is a test block.",
        //     x: 0,
        //     y: 2,
        //     w: 2,
        //     h: 2,
        //   })
        // }
      >
        A
      </Button>
    </div>
  );
}
