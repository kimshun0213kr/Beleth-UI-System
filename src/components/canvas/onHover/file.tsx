import {
  VStack,
  Text,
  Image,
  Box,
  Center,
  HStack,
  Link,
} from "@chakra-ui/react";
import { blockTypes } from "@/app/test/page";
import ArticleModal from "@/components/article";
import ArticleEditModal from "@/components/editmodal";
import { LuExternalLink } from "react-icons/lu";

export default function FileOnHoverCanvas({
  component,
  UNIT,
  windowCubeWidth,
  isLogin,
  maxid,
  MAX_WIDTH,
  CUBE_MARGIN,
  cubeMargin,
  windowWidth,
}: {
  component: blockTypes;
  UNIT: number;
  windowCubeWidth: number;
  isLogin: boolean;
  maxid: number;
  MAX_WIDTH: number;
  CUBE_MARGIN: number;
  cubeMargin: number;
  windowWidth: number;
}) {
  return (
    <>
      <>
        <Center w="100%" h="70%">
          <Box w="97%" h="97%" borderRadius={"2xl"}>
            <Center w="100%" h="100%">
              <Image src="/File.png" h="60%" objectFit={"cover"} />
            </Center>
          </Box>
        </Center>
        <Center>
          <Text borderBottom={"1px solid black"}>
            <HStack>
              {component.link}
              <LuExternalLink />
            </HStack>
          </Text>
        </Center>
      </>
    </>
  );
}
