import {
  Box,
  Center,
  VStack,
  HStack,
  Image,
  Text,
  Link,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import ArticleModal from "../article";
import ArticleEditModal from "../editmodal";
import { blockTypes } from "@/app/test/page";
import { useAtom, useAtomValue } from "jotai";
import { hoveredIndexAtom } from "@/lib/jotai/hoveredIndexAtom";
import { maxHeightAtom } from "@/lib/jotai/maxHeightAtom";
import { modalAtom } from "@/lib/jotai/modalAtom";
import LinkNoHoverCanvas from "./notHover/link";
import ImageNoHoverCanvas from "./notHover/image";
import FileNoHoverCanvas from "./notHover/file";
import ArticleNoHoverCanvas from "./notHover/article";
import ArticleOnHoverCanvas from "./onHover/article";
import FileOnHoverCanvas from "./onHover/file";
import ImageOnHoverCanvas from "./onHover/image";
import LinkOnHoverCanvas from "./onHover/link";

export default function Canvas({
  component,
  index,
  left,
  top,
  width,
  height,
  MAX_WIDTH,
  CUBE_MARGIN,
  UNIT,
  windowWidth,
  windowCubeWidth,
  cubeMargin,
  bgColor,
  isLogin,
  maxid,
}: {
  component: blockTypes;
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
  MAX_WIDTH: number;
  CUBE_MARGIN: number;
  UNIT: number;
  windowWidth: number;
  windowCubeWidth: number;
  cubeMargin: number;
  bgColor: string;
  isLogin: boolean;
  maxid: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useAtom(hoveredIndexAtom);
  const [maxHeight, setMaxHeight] = useAtom(maxHeightAtom);
  const isModalOpen = useAtomValue(modalAtom);

  const noHoverComponent = () => {
    switch (component.canvasmode) {
      case "Article":
        return (
          <ArticleNoHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
          />
        );
      case "File":
        return (
          <FileNoHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
          />
        );
      case "Image":
        return (
          <ImageNoHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
          />
        );
      case "Link":
        return (
          <LinkNoHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
          />
        );
    }
  };

  const onHoverComponent = () => {
    switch (component.canvasmode) {
      case "Article":
        return (
          <ArticleOnHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
            isLogin={isLogin}
            maxid={maxid}
            MAX_WIDTH={MAX_WIDTH}
            CUBE_MARGIN={CUBE_MARGIN}
            cubeMargin={cubeMargin}
            windowWidth={windowWidth}
          />
        );
      case "File":
        return (
          <FileOnHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
            isLogin={isLogin}
            maxid={maxid}
            MAX_WIDTH={MAX_WIDTH}
            CUBE_MARGIN={CUBE_MARGIN}
            cubeMargin={cubeMargin}
            windowWidth={windowWidth}
          />
        );
      case "Image":
        return (
          <ImageOnHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
            isLogin={isLogin}
            maxid={maxid}
            MAX_WIDTH={MAX_WIDTH}
            CUBE_MARGIN={CUBE_MARGIN}
            cubeMargin={cubeMargin}
            windowWidth={windowWidth}
          />
        );
      case "Link":
        return (
          <LinkOnHoverCanvas
            component={component}
            UNIT={UNIT}
            windowCubeWidth={windowCubeWidth}
            isLogin={isLogin}
            maxid={maxid}
            MAX_WIDTH={MAX_WIDTH}
            CUBE_MARGIN={CUBE_MARGIN}
            cubeMargin={cubeMargin}
            windowWidth={windowWidth}
          />
        );
    }
  };

  return (
    <Box
      key={`${component.title}-${index}`}
      position="absolute"
      left={`${left}px`}
      top={`${top}px`}
      maxWidth={
        Math.min(MAX_WIDTH, windowWidth) - Math.min(CUBE_MARGIN, cubeMargin)
      }
      width={`${width - Math.min(CUBE_MARGIN, cubeMargin)}px`}
      height={`${height - Math.min(CUBE_MARGIN, cubeMargin)}px`}
      margin={CUBE_MARGIN / 10}
      bgColor={bgColor}
      borderRadius="4xl"
      p={3}
      transition="all 0.3s ease"
      zIndex={hoveredIndex === index ? 10 : 1}
      onMouseEnter={() => {
        setHoveredIndex(index);
        if (component.y + 1 == maxHeight / Math.min(UNIT, windowCubeWidth)) {
          setMaxHeight(
            maxHeight + component.h * (Math.min(UNIT, windowCubeWidth) / 2)
          );
        }
      }}
      onMouseLeave={() => {
        if (!isModalOpen) {
          setHoveredIndex(null);
        }
        if (
          component.y + 1 ==
          (maxHeight - component.h * (Math.min(UNIT, windowCubeWidth) / 2)) /
            Math.min(UNIT, windowCubeWidth)
        ) {
          setMaxHeight(
            maxHeight - component.h * (Math.min(UNIT, windowCubeWidth) / 2)
          );
        }
      }}
      overflow="hidden"
      shadow={"2xl"}
      shadowColor={"blue.500"}
    >
      <Box position={"relative"} w="100%" h="100%">
        {hoveredIndex == index ? (
          // ホバーされている時の表示
          <>
            {/* isLoginの所はおいておく */}
            {isLogin ? (
              <ArticleEditModal
                data={component}
                modalWidth={Math.min(UNIT, windowCubeWidth)}
                maxid={maxid}
              />
            ) : null}
            {/* <Center w="100%" h="70%">
              <Box w="97%" h="97%" borderRadius={"2xl"}>
                {component.canvasmode == "Image" ? (
                  <Image
                    src={component.image!}
                    h="100%"
                    w="100%"
                    objectFit={"cover"}
                  />
                ) : (
                  <Center w="100%" h="100%">
                    <Image
                      src={
                        component.image
                          ? `${component.image}`
                          : `/${component.canvasmode}.png`
                      }
                      h={component.image ? "80%" : "60%"}
                      objectFit={"cover"}
                    />
                  </Center>
                )}
              </Box>
            </Center>
            <Center>
              {component.canvasmode == "Link" ? (
                <>
                  {component.link ? (
                    <>
                      <VStack>
                        <Text fontSize={"xl"} fontWeight={"bold"}>
                          {component.title == ""
                            ? component.link
                                .slice(component.link.indexOf("//") + 2)
                                .split("/")[0]
                            : component.title}
                        </Text>
                        <Link
                          href={component.link}
                          target="blank"
                          borderBottom={"1px solid black"}
                        >
                          <HStack>
                            <Text>
                              {component.link
                                .replace("http://", "")
                                .replace("https://", "")}
                            </Text>
                            <LuExternalLink />
                          </HStack>
                        </Link>
                      </VStack>
                    </>
                  ) : (
                    <Text>Linkの設定がありません。</Text>
                  )}
                </>
              ) : null}
              {component.canvasmode == "File" ? (
                <>
                  <Link
                    href={component.link ? component.link : ""}
                    target="blank"
                    borderBottom={"1px solid black"}
                    fontSize={"xl"}
                    fontWeight={"bold"}
                  >
                    <HStack>
                      <Text>{component.title}</Text>
                      <LuExternalLink />
                    </HStack>
                  </Link>
                </>
              ) : null}
              {component.canvasmode == "Article" ? (
                <>
                  <VStack gap={0}>
                    <Text fontSize={"xl"} fontWeight={"bold"} marginBottom={0}>
                      {component.title.length >
                      (Math.min(UNIT, windowCubeWidth) / 30) * component.w
                        ? component.title.slice(
                            0,
                            (Math.min(UNIT, windowCubeWidth) / 30) *
                              component.w -
                              1
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
                </>
              ) : null}
              {component.canvasmode == "Image" ? (
                <>
                  <VStack>
                    <Text fontSize={"xl"} fontWeight={"bold"}>
                      {component.title}
                    </Text>
                    <Text>{component.content}</Text>

                    <ArticleModal
                      data={component}
                      modalWidth={
                        Math.min(MAX_WIDTH, windowWidth) -
                        Math.min(CUBE_MARGIN, cubeMargin)
                      }
                    />
                  </VStack>
                </>
              ) : null}
            </Center> */}
            {onHoverComponent()}
          </>
        ) : (
          // ホバーされていない時の表示
          <Center w="100%" h="100%">
            {/* <Box w="97%" h="97%" borderRadius={"2xl"}>
              {component.canvasmode == "Image" ? (
                <Center w="100%" h="100%">
                  <Image
                    src={component.image ? component.image : "/Article.png"}
                    h="100%"
                    objectFit={"cover"}
                  />
                </Center>
              ) : null}
              {component.canvasmode == "Link" ? (
                <>
                  <Center w="100%" h="80%">
                    <Image
                      src={component.image ? component.image : "/Link.png"}
                      h={component.image ? "80%" : "60%"}
                      objectFit={"cover"}
                    />
                  </Center>
                  <Center>
                    {component.link ? (
                      <>
                        <Text fontSize={"xl"} fontWeight={"bold"}>
                          {component.title == ""
                            ? component.link
                                .slice(component.link.indexOf("//") + 2)
                                .split("/")[0]
                            : component.title}
                        </Text>
                      </>
                    ) : (
                      <Text>Linkの設定がありません。</Text>
                    )}
                  </Center>
                </>
              ) : null}
              {component.canvasmode == "File" ||
              component.canvasmode == "Article" ? (
                <>
                  <Center w="100%" h="80%">
                    <Image
                      src={
                        component.image
                          ? component.image
                          : `/${component.canvasmode}.png`
                      }
                      h={component.image ? "80%" : "60%"}
                      objectFit={"cover"}
                    />
                  </Center>
                  <Center>
                    <Text fontSize={"xl"} fontWeight={"bold"}>
                      {component.title.length >
                      (Math.min(UNIT, windowCubeWidth) / 30) *
                        component.w *
                        component.h
                        ? component.title.slice(
                            0,
                            (Math.min(UNIT, windowCubeWidth) / 30) *
                              component.w *
                              component.h -
                              1
                          ) + "..."
                        : component.title}
                    </Text>
                  </Center>
                </>
              ) : null}
            </Box> */}
            {noHoverComponent()}
          </Center>
        )}
      </Box>
    </Box>
  );
}
