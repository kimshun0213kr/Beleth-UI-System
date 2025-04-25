"use client";

import { Box, Button, Center, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const UNIT = 240;
const MAX_WIDTH = 480;
const CUBE_MARGIN = 20;

type blockTypes = {
  title: string;
  content: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(1000);
  const [windowCubeWidth, setWindowCubeWidth] = useState(1000);
  const [cubeMargin, setCubeMargin] = useState(10);
  const components: blockTypes[] = [
    { title: "Cube1", content: "Left 1x1", x: 0, y: 0, w: 1, h: 1 },
    { title: "Cube2", content: "Right 1x1", x: 1, y: 0, w: 1, h: 1 },
    { title: "Cube3", content: "Left 1x1", x: 0, y: 1, w: 1, h: 1 },
    { title: "Cube4", content: "Right 1x1", x: 1, y: 1, w: 1, h: 1 },
    { title: "Cube5", content: "Left 1x1", x: 0, y: 2, w: 1, h: 1 },
    { title: "Cube6", content: "Right 1x1", x: 1, y: 2, w: 1, h: 1 },
    { title: "Rect1", content: "Left 2x1", x: 0, y: 3, w: 2, h: 1 },
    { title: "Cube7", content: "Left 1x1", x: 0, y: 4, w: 1, h: 1 },
    { title: "Cube8", content: "Right 1x1", x: 1, y: 4, w: 1, h: 1 },
    { title: "Big Cube1", content: "Left 2x2", x: 0, y: 5, w: 2, h: 2 },
    { title: "Cube9", content: "Left 1x1", x: 0, y: 7, w: 1, h: 1 },
    { title: "Cube10", content: "Right 1x1", x: 1, y: 7, w: 1, h: 1 },
    { title: "Cube11", content: "Left 1x1", x: 0, y: 8, w: 1, h: 1 },
    { title: "Cube12", content: "Right 1x1", x: 1, y: 8, w: 1, h: 1 },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
                onMouseLeave={() => setHoveredIndex(null)}
                overflow="hidden"
              >
                <strong>{component.title}</strong>
                <p>{component.content}</p>
              </Box>
            );
          })}
        </Box>
      </Center>
    </>
  );
}
