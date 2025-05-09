"use client";

import {
  Box,
  Button,
  Center,
  Text,
  VStack,
  Heading,
  Alert,
  Spinner,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { modalAtom } from "@/lib/jotai/modalAtom";
import { hoveredIndexAtom } from "@/lib/jotai/hoveredIndexAtom";
import { alertVisibleAtom } from "@/lib/jotai/alertVisible";
import { supabase } from "@/lib/supabase";
import { maxHeightAtom } from "@/lib/jotai/maxHeightAtom";
import Canvas from "@/components/canvas/main";
import AddButton from "@/components/addButton";
import { componentAtom } from "@/lib/jotai/components";
import { addActionAtom } from "@/lib/jotai/addAction";

const UNIT = 240;
const MAX_WIDTH = 480;
const CUBE_MARGIN = 20;

export type blockTypes = {
  id: number;
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
  const [components, setComponents] = useAtom(componentAtom);

  const [hoveredIndex, setHoveredIndex] = useAtom(hoveredIndexAtom);

  const [empty, setEmpty] = useState<number[][]>();
  const [maxHeight, setMaxHeight] = useAtom(maxHeightAtom);
  const [isLogin, setIsLogin] = useState(false);

  const [onAddAction, setOnAddAction] = useAtom(addActionAtom);
  const [maxid, setMaxId] = useState(0);
  const [tmpPass, setTmpPass] = useState("");

  const alertVisible = useAtomValue(alertVisibleAtom);

  const closely = (emptyArray: number[][]) => {
    if (emptyArray.length != 0) {
      let tmpY = emptyArray[0][1];
      emptyArray.map(async (tmpEmptyBlock, index) => {
        if (index != 0) {
          if (tmpY == tmpEmptyBlock[1]) {
            const { data, error } = await supabase
              .from("content")
              .select("*")
              .gte("y", tmpY)
              .order("y", { ascending: true })
              .order("x", { ascending: true });
            if (data) {
              data.map(async (updateData: blockTypes) => {
                const updateY = updateData.y - 1;
                await supabase
                  .from("content")
                  .update({ y: updateY })
                  .eq("id", updateData.id);
              });
            }
          }
        }
        tmpY = tmpEmptyBlock[1];
      });
    }
  };

  const getData = async () => {
    const { data, error } = await supabase
      .from("content")
      .select("*")
      .order("y", { ascending: true })
      .order("x", { ascending: true });
    return data as blockTypes[];
  };

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowCubeWidth(window.innerWidth / 2);
    setCubeMargin(window.innerWidth / 24);
    getData().then((componentData) => {
      setComponents(componentData);
    });
    // setIsLogin(true);
    const channel = supabase
      .channel("public:content")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content" },
        (payload: any) => {
          getData().then((componentData) => {
            setComponents(componentData);
          });
        }
      )
      .subscribe();

    return () => {
      // アンマウント時にsubscriptionを解除
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let tmpArray: number[][] = [];
    let tmpMax = 0;
    let tmpMaxID = 0;
    if (components) {
      for (let i = 0; i < components.length; i++) {
        if (
          tmpMax <=
          (components[i].y + components[i].h) * Math.min(UNIT, windowCubeWidth)
        ) {
          tmpMax =
            (components[i].y + components[i].h) *
            Math.min(UNIT, windowCubeWidth);
        }
        if (tmpMaxID <= components[i].id) {
          tmpMaxID = components[i].id;
        }
      }
      setMaxHeight(tmpMax);
      for (let i = 0; i < tmpMax / Math.min(UNIT, windowCubeWidth); i++) {
        for (let j = 0; j < 2; j++) {
          tmpArray.push([j, i]);
        }
      }
      components.map((tmpData) => {
        for (let k = tmpData.x; k < tmpData.x + tmpData.w; k++) {
          for (let l = tmpData.y; l < tmpData.y + tmpData.h; l++) {
            tmpArray = tmpArray.filter(function (tmpEmptyData) {
              return !(tmpEmptyData[0] === k && tmpEmptyData[1] === l);
            });
          }
        }
      });
      setEmpty(tmpArray);
      closely(tmpArray);
    }
    if (!onAddAction) {
      setMaxId(tmpMaxID);
    }
    setOnAddAction(false);
  }, [components]);

  if (components) {
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
          ,empty:{empty},height:{maxHeight}
        </Text>
        {!isLogin ? (
          <>
            <Input
              onChange={(e) => setTmpPass(e.target.value)}
              type="password"
            />
            <Button
              onClick={() => {
                if ((process.env.NEXT_PUBLIC_TMP_PASS as string) == tmpPass) {
                  setIsLogin(true);
                }
              }}
            >
              ログイン
            </Button>
          </>
        ) : null}
        <Center width="100%">
          <VStack width="100%">
            <Box
              marginTop={12}
              marginBottom={12}
              position="relative"
              width="100%"
              height={maxHeight}
              maxWidth={`${MAX_WIDTH}px`}
            >
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
                    } else if (
                      hovered.w == 1 &&
                      hovered.h == 1 &&
                      hovered.x == 1
                    ) {
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
                  <Canvas
                    component={component}
                    index={index}
                    left={left}
                    top={top}
                    width={width}
                    height={height}
                    MAX_WIDTH={MAX_WIDTH}
                    CUBE_MARGIN={CUBE_MARGIN}
                    UNIT={UNIT}
                    windowWidth={windowWidth}
                    windowCubeWidth={windowCubeWidth}
                    cubeMargin={cubeMargin}
                    bgColor={bgColor}
                    isLogin={isLogin}
                    maxid={maxid}
                  />
                );
              })}
              {isLogin ? (
                <AddButton
                  empty={empty}
                  maxid={maxid}
                  UNIT={UNIT}
                  windowCubeWidth={windowCubeWidth}
                />
              ) : null}
            </Box>
            <Alert.Root
              w={Math.min(MAX_WIDTH, windowWidth)}
              h={Math.min(MAX_WIDTH, windowWidth) / 16}
              bottom={12}
              zIndex={1000}
              borderStartWidth="3px"
              borderStartColor="colorPalette.600"
              title="We are loading something"
            >
              <Alert.Indicator>
                <Spinner size="sm" />
              </Alert.Indicator>
              <Alert.Title>We are loading something</Alert.Title>
            </Alert.Root>
          </VStack>
        </Center>
      </>
    );
  } else {
    return (
      <>
        <Center>
          <Heading>Loading...</Heading>
        </Center>
      </>
    );
  }
}
