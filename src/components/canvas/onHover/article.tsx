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

export default function ArticleOnHoverCanvas({
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
              <Image
                src={component.image ? component.image : "/Article.png"}
                h={component.image ? "80%" : "60%"}
                objectFit={"cover"}
              />
            </Center>
          </Box>
        </Center>
        <Center>
          <VStack gap={0}>
            <Text fontSize={"xl"} fontWeight={"bold"} marginBottom={0}>
              {component.title.length >
              (Math.min(UNIT, windowCubeWidth) / 30) * component.w
                ? component.title.slice(
                    0,
                    (Math.min(UNIT, windowCubeWidth) / 30) * component.w - 1
                  ) + "..."
                : component.title}
            </Text>
            <Text marginTop={0}>
              {component.content ? (
                <>
                  {component.content!.replaceAll("\n", " ").length >
                  (Math.min(UNIT, windowCubeWidth) / 12) *
                    component.w *
                    component.h
                    ? component.content
                        ?.replaceAll("\n", " ")
                        .slice(
                          0,
                          (Math.min(UNIT, windowCubeWidth) / 12) *
                            component.w *
                            component.h -
                            1
                        ) + "..."
                    : component.content?.replaceAll("\n", " ")}
                </>
              ) : null}
            </Text>
            <ArticleModal
              data={component}
              modalWidth={
                Math.min(MAX_WIDTH, windowWidth) -
                Math.min(CUBE_MARGIN, cubeMargin)
              }
            />
          </VStack>
        </Center>
      </>
    </>
  );
}
