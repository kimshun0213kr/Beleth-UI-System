import { VStack, Text, Image } from "@chakra-ui/react";
import { blockTypes } from "@/app/test/page";

export default function ImageNoHoverCanvas({
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
      <Image
        src={component.image ? component.image : "/Article.png"}
        h="100%"
        w="100%"
        objectFit={"cover"}
      />
    </>
  );
}
