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

export default function LinkOnHoverCanvas({
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
  const titleString = (title: string) => {
    if (title.length > (Math.min(UNIT, windowCubeWidth) / 30) * component.w) {
      return (
        title.slice(
          0,
          (Math.min(UNIT, windowCubeWidth) / 30) * component.w - 1
        ) + "..."
      );
    } else {
      return title;
    }
  };

  const linkString = () => {
    if (
      `${component.link!.split("/")[2]}/${component.link!.split("/")[3]}`
        .length >
      (Math.min(UNIT, windowCubeWidth) / 12) * component.w
    ) {
      return (
        `${component.link!.split("/")[2]}/${
          component.link!.split("/")[3]
        }`.slice(0, (Math.min(UNIT, windowCubeWidth) / 12) * component.w - 1) +
        "..."
      );
    } else {
      return `${component.link!.split("/")[2]}/${
        component.link!.split("/")[3]
      }`;
    }
  };

  return (
    <>
      <>
        <Center w="100%" h="70%">
          <Box w="97%" h="97%" borderRadius={"2xl"}>
            <Center w="100%" h="100%">
              <Image
                src={component.image ? component.image : "/Link.png"}
                h={component.image ? "80%" : "60%"}
                objectFit={"cover"}
              />
            </Center>
          </Box>
        </Center>
        <Center>
          <VStack gap={0}>
            <Text fontWeight={"bold"} fontSize={"xl"}>
              {titleString(
                component.title
                  ? component.title
                  : component.link!.split("/")[2]
              )}
            </Text>
            <Text borderBottom={"1px solid black"}>
              <HStack>
                {component.link ? (
                  <>
                    <Link href={component.link}>
                      {component.link.split("/").length >= 4
                        ? linkString()
                        : component.link.split("/")[2]}
                      <LuExternalLink />
                    </Link>
                  </>
                ) : (
                  "リンクの設定がありません。"
                )}
              </HStack>
            </Text>
          </VStack>
        </Center>
      </>
    </>
  );
}
