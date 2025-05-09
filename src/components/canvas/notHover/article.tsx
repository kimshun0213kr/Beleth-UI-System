import { VStack, Text, Image } from "@chakra-ui/react";
import { blockTypes } from "@/app/test/page";

export default function ArticleNoHoverCanvas({
  component,
  UNIT,
  windowCubeWidth,
}: {
  component: blockTypes;
  UNIT: number;
  windowCubeWidth: number;
}) {
  return (
    <>
      <VStack w="100%" h="100%">
        <Image
          src={component.image ? component.image : "/Article.png"}
          h="70%"
          // w="100%"
          objectFit={"cover"}
        />
        <Text fontWeight={"bold"} fontSize={"xl"}>
          {component.title.length >
          (Math.min(UNIT, windowCubeWidth) / 30) * component.w * component.h
            ? component.title.slice(
                0,
                (Math.min(UNIT, windowCubeWidth) / 30) *
                  component.w *
                  component.h -
                  1
              ) + "..."
            : component.title}
        </Text>
      </VStack>
    </>
  );
}
