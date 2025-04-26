"use client";

import {
  Box,
  Button,
  Center,
  Text,
  Image,
  VStack,
  Link,
  HStack,
} from "@chakra-ui/react";
import { LuExternalLink } from "react-icons/lu";
import { useEffect, useState } from "react";
import ArticleModal from "@/components/article";
import { useAtom, useAtomValue } from "jotai";
import { modalAtom, hoveredIndexAtom } from "@/lib/modalAtom";

const UNIT = 240;
const MAX_WIDTH = 480;
const CUBE_MARGIN = 20;

// 今後はこのtypeの中にcanvasmodeを追加して、そこで写真なのか外部リンクなのか埋め込みファイルなのか文字なのかを判別できるようにしたい
export type blockTypes = {
  title: string;
  content: string | null;
  image: string | null;
  canvasmode: string;
  link: string | null;
  x: number;
  y: number;
  w: number;
  h: number;
};

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(1000);
  const [windowCubeWidth, setWindowCubeWidth] = useState(1000);
  const [cubeMargin, setCubeMargin] = useState(10);
  const isModalOpen = useAtomValue(modalAtom);
  const components: blockTypes[] = [
    {
      title: "代々木公園",
      content: "2025年4月9日撮影",
      image: "/portfolio/D01.jpg",
      canvasmode: "Image",
      link: null,
      x: 0,
      y: 0,
      w: 1,
      h: 1,
    },
    {
      title: "Cube2",
      content: "Right 1x1",
      image: null,
      canvasmode: "Link",
      link: "https://github.com/kimshun0213kr",
      x: 1,
      y: 0,
      w: 1,
      h: 1,
    },
    {
      title: "ベレト工務店ロゴ",
      content: null,
      image: null,
      canvasmode: "File",
      link: "/Beleth_Logo.png",
      x: 0,
      y: 1,
      w: 1,
      h: 1,
    },
    {
      title: "記事を書いてみるよぉぉぉぉぉぉぉぉぉぉ",
      content:
        "こんにちは\nはじめましてかもね。\nこうやって記事も書けるんだよってことで最初の記事を書いてみようと思うよ。\nああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ\nああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ\nああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ\nああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ\nああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ\nああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ\n",
      image: "/Beleth_Logo.png",
      canvasmode: "Article",
      link: null,
      x: 1,
      y: 1,
      w: 1,
      h: 1,
    },
    {
      title: "Cube5",
      content: "Left 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 0,
      y: 2,
      w: 1,
      h: 1,
    },
    {
      title: "Cube6",
      content: "Right 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 1,
      y: 2,
      w: 1,
      h: 1,
    },
    {
      title: "Rect1",
      content: "Left 2x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 0,
      y: 3,
      w: 2,
      h: 1,
    },
    {
      title: "Cube7",
      content: "Left 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 0,
      y: 4,
      w: 1,
      h: 1,
    },
    {
      title: "Cube8",
      content: "Right 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 1,
      y: 4,
      w: 1,
      h: 1,
    },
    {
      title: "Big Cube1",
      content: "Left 2x2",
      image: "/portfolio/D02.jpg",
      canvasmode: "Article",
      link: null,
      x: 0,
      y: 5,
      w: 2,
      h: 2,
    },
    {
      title: "Cube9",
      content: "Left 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 0,
      y: 7,
      w: 1,
      h: 1,
    },
    {
      title: "Cube10",
      content: "Right 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 1,
      y: 7,
      w: 1,
      h: 1,
    },
    {
      title: "Cube11",
      content: "Left 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 0,
      y: 8,
      w: 1,
      h: 1,
    },
    {
      title: "Cube12",
      content: "Right 1x1",
      image: null,
      canvasmode: "Article",
      link: null,
      x: 1,
      y: 8,
      w: 1,
      h: 1,
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useAtom(hoveredIndexAtom);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowCubeWidth(window.innerWidth / 2);
    setCubeMargin(window.innerWidth / 24);
  });

  return (
    <>
      <Text>
        innerWidth:{windowWidth},windowCubeWidth:{windowCubeWidth},cubeMargin:
        {cubeMargin}
        <br />
        componentWidth:{Math.min(MAX_WIDTH, windowWidth)},cubeWidth:
        {Math.min(UNIT, windowCubeWidth)},margin:
        {Math.min(CUBE_MARGIN, cubeMargin)}
        ,maxWidth:
        {Math.min(MAX_WIDTH, windowWidth) - Math.min(CUBE_MARGIN, cubeMargin)}
      </Text>
      <Center width="100%">
        <Box position="relative" width="100%" maxWidth={`${MAX_WIDTH}px`}>
          {components.map((component, index) => {
            const baseLeft = component.x * Math.min(UNIT, windowCubeWidth);
            const baseTop = component.y * Math.min(UNIT, windowCubeWidth);
            let width = component.w * Math.min(UNIT, windowCubeWidth);
            let height = component.h * Math.min(UNIT, windowCubeWidth);
            let left = baseLeft;
            let top = baseTop;

            let scaleW = 0;
            let scaleH = 0;

            let moveX = 0;
            let moveY = 0;

            let bgColor = "#90ee90";

            if (hoveredIndex !== null) {
              const hovered = components[hoveredIndex];
              const isHovered = index === hoveredIndex;

              if (isHovered) {
                if (hovered.w == 1 && hovered.h == 1 && hovered.x == 0) {
                  scaleW = 0.5;
                  scaleH = 0.5;
                } else if (hovered.w == 1 && hovered.h == 1 && hovered.x == 1) {
                  scaleW = 0.5;
                  scaleH = 0.5;
                  moveX = -0.5;
                } else if (hovered.w == 2 && hovered.h == 1) {
                  scaleH = 0.5;
                } else if (hovered.w == 2 && hovered.h == 2) {
                  scaleH = 1;
                }
                bgColor = "#ffcccb";
              } else {
                const isRight =
                  component.x === hovered.x + hovered.w &&
                  component.y === hovered.y;
                const isLeft =
                  component.x + component.w === hovered.x &&
                  component.y === hovered.y;
                let isBelow =
                  component.y === hovered.y + hovered.h &&
                  (component.x === hovered.x || component.w === 2);
                if (hovered.w == 2) {
                  isBelow = component.y === hovered.y + hovered.h;
                }
                const isBelowLeft =
                  component.y === hovered.y + hovered.h &&
                  component.x + component.w === hovered.x;
                const isBelowRight =
                  component.y === hovered.y + hovered.h &&
                  component.x === hovered.x + hovered.w;
                const isBelow_Below =
                  component.y == hovered.y + 3 &&
                  hovered.h == 2 &&
                  hovered.w == 2;

                const rightComponent = components.find(
                  (c) => c.x === hovered.x + hovered.w && c.y === hovered.y
                );
                const belowComponent = components.find(
                  (c) =>
                    c.y === hovered.y + hovered.h &&
                    (c.x === hovered.x || (hovered.w === 1 && c.w === 2))
                );

                // Case1
                if (hovered.w == 1 && hovered.h == 1 && hovered.x == 0) {
                  if (isRight) {
                    if (
                      component.w == 1 &&
                      component.h == 1 &&
                      component.x == 1
                    ) {
                      scaleW = -0.5;
                      scaleH = 0.5;
                      moveX = 0.5;
                      bgColor = "#add8e6";
                    }
                  }

                  if (isBelow) {
                    scaleH = -0.5;
                    scaleW = 0.5;
                    moveY = 0.5;
                    bgColor = "#dab6fc";
                  }

                  if (isBelowRight) {
                    scaleH = -0.5;
                    scaleW = -0.5;
                    moveX = 0.5;
                    moveY = 0.5;
                    bgColor = "#ffa500";
                  }
                }

                // Case2
                if (hovered.w == 1 && hovered.h == 1 && hovered.x == 1) {
                  if (isLeft) {
                    if (
                      component.x == 0 &&
                      component.w == 1 &&
                      component.h == 1
                    ) {
                      scaleW = -0.5;
                      scaleH = 0.5;
                      bgColor = "#add8e6";
                    }
                  }

                  if (isBelow) {
                    scaleH = -0.5;
                    scaleW = 0.5;
                    if (component.w != 2) {
                      moveX = -0.5;
                    }
                    moveY = 0.5;
                    bgColor = "#dab6fc";
                  }

                  if (isBelowLeft) {
                    scaleH = -0.5;
                    scaleW = -0.5;
                    moveY = 0.5;
                    bgColor = "#ffa500";
                  }
                }
                // Case3
                if (hovered.w == 2 && hovered.h == 1) {
                  if (isBelow) {
                    scaleH = -0.5;
                    moveY = 0.5;
                    bgColor = "#dab6fc";
                  }

                  if (isBelowLeft) {
                    scaleH = -0.5;
                    scaleW = -0.5;
                    moveY = 0.5;
                    bgColor = "#ffa500";
                  }
                }
                // Case4
                if (hovered.w == 2 && hovered.h == 2) {
                  if (isBelow) {
                    scaleH = -0.5;
                    moveY = 1;
                    bgColor = "#dab6fc";
                  }

                  if (isBelowLeft) {
                    scaleH = -0.5;
                    scaleW = -0.5;
                    moveY = 0.5;
                    bgColor = "#ffa500";
                  }

                  if (isBelowRight) {
                    scaleH = -0.5;
                    moveY = 0.5;
                    bgColor = "#ffa500";
                  }
                  if (isBelow_Below) {
                    scaleH -= 0.5;
                    moveY = 0.5;
                    bgColor = "#ffa500";
                  }
                }
              }
            }
            width += scaleW * Math.min(UNIT, windowCubeWidth);
            height += scaleH * Math.min(UNIT, windowCubeWidth);
            left += moveX * Math.min(UNIT, windowCubeWidth);
            top += moveY * Math.min(UNIT, windowCubeWidth);

            if (left + width > Math.min(MAX_WIDTH, windowWidth)) {
              width = Math.min(MAX_WIDTH, windowWidth) - left;
            }

            return (
              <Box
                key={`${component.title}-${index}`}
                position="absolute"
                left={`${left}px`}
                top={`${top}px`}
                maxWidth={
                  Math.min(MAX_WIDTH, windowWidth) -
                  Math.min(CUBE_MARGIN, cubeMargin)
                }
                width={`${width - Math.min(CUBE_MARGIN, cubeMargin)}px`}
                height={`${height - Math.min(CUBE_MARGIN, cubeMargin)}px`}
                margin={CUBE_MARGIN / 10}
                bgColor={bgColor}
                borderRadius="4xl"
                p={3}
                transition="all 0.3s ease"
                zIndex={hoveredIndex === index ? 10 : 1}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => {
                  isModalOpen ? null : setHoveredIndex(null);
                }}
                overflow="hidden"
                shadow={"2xl"}
              >
                {hoveredIndex == index ? (
                  <>
                    <Center w="100%" h="70%">
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
                                  {
                                    component.link
                                      .slice(component.link.indexOf("//") + 2)
                                      .split("/")[0]
                                  }
                                </Text>
                                {/* <Text>{component.link}</Text> */}
                                <Link
                                  href={component.link}
                                  target="blank"
                                  borderBottom={"1px solid black"}
                                >
                                  <HStack>
                                    <Text>{component.link}</Text>
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
                          <VStack>
                            <Text
                              fontSize={"xl"}
                              fontWeight={"bold"}
                              borderBottom={0}
                            >
                              {component.title.length > 8
                                ? component.title.slice(0, 7) + "..."
                                : component.title}
                            </Text>
                            <Text borderTop={0}>
                              {component.content!.replaceAll("\n", " ").length >
                              20
                                ? component.content
                                    ?.replaceAll("\n", " ")
                                    .slice(0, 19) + "..."
                                : component.content?.replaceAll("\n", " ")}
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
                          </VStack>
                        </>
                      ) : null}
                    </Center>
                  </>
                ) : (
                  <Center w="100%" h="100%">
                    <Box w="97%" h="97%" borderRadius={"2xl"}>
                      {component.canvasmode == "Image" ? (
                        <Center w="100%" h="100%">
                          <Image
                            src={component.image ? component.image : ""}
                            h="100%"
                            objectFit={"cover"}
                          />
                        </Center>
                      ) : null}
                      {component.canvasmode == "Link" ? (
                        <>
                          <Center w="100%" h="80%">
                            <Image
                              src="/Link.png"
                              h="60%"
                              objectFit={"cover"}
                            />
                          </Center>
                          <Center>
                            {component.link ? (
                              <>
                                <Text fontSize={"xl"} fontWeight={"bold"}>
                                  {
                                    component.link
                                      .slice(component.link.indexOf("//") + 2)
                                      .split("/")[0]
                                  }
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
                              {component.title.length > 8
                                ? component.title.slice(0, 7) + "..."
                                : component.title}
                            </Text>
                          </Center>
                        </>
                      ) : null}
                    </Box>
                  </Center>
                )}
              </Box>
            );
          })}
        </Box>
      </Center>
    </>
  );
}
