import { VStack, Text, Image } from "@chakra-ui/react";
import { blockTypes } from "@/app/test/page";

export default function LinkNoHoverCanvas({
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
          src={component.image ? component.image : "/Link.png"}
          h="70%"
          objectFit={"cover"}
        />
        <Text fontWeight={"bold"} fontSize={"xl"}>
          {component.link
            ? component.link.split("/")[2]
            : "リンク設定がありません。"}
        </Text>
      </VStack>
    </>
  );
}
