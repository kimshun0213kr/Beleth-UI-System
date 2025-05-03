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
  Heading,
  Float,
  Circle,
  Alert,
  Spinner,
  Input,
} from "@chakra-ui/react";
import {
  LuExternalLink,
  LuCircleX,
  LuMove,
  LuPlus,
  LuEllipsis,
} from "react-icons/lu";
import { useEffect, useState } from "react";
import ArticleModal from "@/components/article";
import { useAtom, useAtomValue } from "jotai";
import { modalAtom } from "@/lib/jotai/modalAtom";
import { hoveredIndexAtom } from "@/lib/jotai/hoveredIndexAtom";
import { alertVisibleAtom } from "@/lib/jotai/alertVisible";
import ArticleEditModal from "@/components/editmodal";
import { supabase } from "@/lib/supabase";

const UNIT = 240;
const MAX_WIDTH = 480;
const CUBE_MARGIN = 20;

// 今後はこのtypeの中にcanvasmodeを追加して、そこで写真なのか外部リンクなのか埋め込みファイルなのか文字なのかを判別できるようにしたい
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
  const [components, setComponents] = useState<blockTypes[]>();

  const [hoveredIndex, setHoveredIndex] = useAtom(hoveredIndexAtom);

  const [empty, setEmpty] = useState<number[][]>();
  const [maxHeight, setMaxHeight] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  const [onAddAction, setOnAddAction] = useState(false);
  const [maxid, setMaxId] = useState(0);
  const [tmpPass, setTmpPass] = useState("");

  const alertVisible = useAtomValue(alertVisibleAtom);

  // let maxid = 0;

  const tmpComponent: blockTypes[] = [
    {
      id: 1,
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
      id: 2,
      title: "",
      content: null,
      image: null,
      canvasmode: "Link",
      link: "https://github.com/kimshun0213kr",
      x: 1,
      y: 0,
      w: 1,
      h: 1,
    },
    {
      id: 3,
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
      id: 4,
      title: "記事を書いてみるよ",
      content: `東京電機大学（とうきょう でんきだいがく、英語: Tokyo Denki University）は、東京都足立区千住旭町5に本部を置く日本の私立大学。1907年創立、1949年大学設置。大学の略称は電大、電機大、TDU。

概観

1907年（明治40年）に廣田精一と扇本眞吉が創設した電機学校を起源とする。1949年（昭和24年）、第二次世界大戦後の学制改革に伴い、電機工業専門学校（私立の旧制専門学校）が前身となって開学した大学である。2023年（令和5年）時点で、5学部5研究科を設置するなど理工系の大学として発展している。
学生や大学内では「電大」という略称を用いることが多い。
校歌の歌詞では「東京電大」、インターネット上のドメイン名には「dendai.ac.jp」を用いている。
大学キャンパスは創立からおよそ100年の間、東京の神田地区に立地していたが、2012年（平成24年）に神田錦町から北千住駅前へ移転している。
建学の精神と教育・研究理念
| 実学尊重
| 技術は人なり
| —東京電機大学、建学の精神と教育・研究理念｜東京電機大学

学風および特色
工学の専門教育と実学尊重の教育を特色とする。産学官連携プロジェクトや、社会人向け講座、社会人学生の受け入れなど、企業とのコラボレーションも行っている。`,
      image: "/Beleth_Logo.png",
      canvasmode: "Article",
      link: null,
      x: 1,
      y: 1,
      w: 1,
      h: 1,
    },
    {
      id: 5,
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
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
      id: 10,
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
      id: 11,
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
      id: 12,
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
      id: 13,
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
      id: 14,
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
      console.log(componentData);
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
            console.log(componentData);
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
    console.log("Change components effect.");
    console.log();
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
      console.log(tmpMax);
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
      if (empty) {
        console.log(true, empty);
      } else {
        console.log(false, empty);
      }
    }
    if (!onAddAction) {
      setMaxId(tmpMaxID);
    }
    setOnAddAction(false);
    console.log("maxid:", maxid);
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
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      if (
                        component.y + 1 ==
                        maxHeight / Math.min(UNIT, windowCubeWidth)
                      ) {
                        setMaxHeight(
                          maxHeight +
                            component.h * (Math.min(UNIT, windowCubeWidth) / 2)
                        );
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isModalOpen) {
                        setHoveredIndex(null);
                      }
                      if (
                        component.y + 1 ==
                        (maxHeight -
                          component.h * (Math.min(UNIT, windowCubeWidth) / 2)) /
                          Math.min(UNIT, windowCubeWidth)
                      ) {
                        setMaxHeight(
                          maxHeight -
                            component.h * (Math.min(UNIT, windowCubeWidth) / 2)
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
                          {isLogin ? (
                            <ArticleEditModal
                              data={component}
                              modalWidth={Math.min(UNIT, windowCubeWidth)}
                              maxid={maxid}
                            />
                          ) : null}
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
                                        {component.title == ""
                                          ? component.link
                                              .slice(
                                                component.link.indexOf("//") + 2
                                              )
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
                                  <Text
                                    fontSize={"xl"}
                                    fontWeight={"bold"}
                                    marginBottom={0}
                                  >
                                    {component.title.length >
                                    (Math.min(UNIT, windowCubeWidth) / 30) *
                                      component.w
                                      ? component.title.slice(
                                          0,
                                          (Math.min(UNIT, windowCubeWidth) /
                                            30) *
                                            component.w -
                                            1
                                        ) + "..."
                                      : component.title}
                                  </Text>
                                  <Text marginTop={0}>
                                    {component.content ? (
                                      <>
                                        {component.content!.replaceAll(
                                          "\n",
                                          " "
                                        ).length >
                                        (Math.min(UNIT, windowCubeWidth) / 12) *
                                          component.w *
                                          component.h
                                          ? component.content
                                              ?.replaceAll("\n", " ")
                                              .slice(
                                                0,
                                                (Math.min(
                                                  UNIT,
                                                  windowCubeWidth
                                                ) /
                                                  12) *
                                                  component.w *
                                                  component.h -
                                                  1
                                              ) + "..."
                                          : component.content?.replaceAll(
                                              "\n",
                                              " "
                                            )}
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
                          </Center>
                        </>
                      ) : (
                        // ホバーされていない時の表示
                        <Center w="100%" h="100%">
                          <Box w="97%" h="97%" borderRadius={"2xl"}>
                            {component.canvasmode == "Image" ? (
                              <Center w="100%" h="100%">
                                <Image
                                  src={
                                    component.image
                                      ? component.image
                                      : "/Article.png"
                                  }
                                  h="100%"
                                  objectFit={"cover"}
                                />
                              </Center>
                            ) : null}
                            {component.canvasmode == "Link" ? (
                              <>
                                <Center w="100%" h="80%">
                                  <Image
                                    src={
                                      component.image
                                        ? component.image
                                        : "/Link.png"
                                    }
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
                                              .slice(
                                                component.link.indexOf("//") + 2
                                              )
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
                                          (Math.min(UNIT, windowCubeWidth) /
                                            30) *
                                            component.w *
                                            component.h -
                                            1
                                        ) + "..."
                                      : component.title}
                                  </Text>
                                </Center>
                              </>
                            ) : null}
                          </Box>
                        </Center>
                      )}
                    </Box>
                  </Box>
                );
              })}
              {isLogin ? (
                <>
                  {onAddAction ? (
                    <>
                      <Box
                        right={5}
                        bottom={5}
                        position={"fixed"}
                        bgColor={"black"}
                        zIndex={100}
                        borderRadius={"xl"}
                      >
                        <HStack margin={7}>
                          <Button
                            onClick={() => {
                              if (empty!.length != 0) {
                                setComponents([
                                  ...components,
                                  {
                                    id: maxid + 1,
                                    title: "",
                                    content: null,
                                    image: null,
                                    canvasmode: "Article",
                                    link: null,
                                    x: empty![0][0],
                                    y: empty![0][1],
                                    w: 1,
                                    h: 1,
                                  },
                                ]);
                                setMaxHeight(
                                  maxHeight + Math.min(UNIT, windowCubeWidth)
                                );
                                console.log(maxHeight);
                              } else {
                                setComponents([
                                  ...components,
                                  {
                                    id: maxid + 1,
                                    title: "",
                                    content: null,
                                    image: null,
                                    canvasmode: "Article",
                                    link: null,
                                    x: 0,
                                    y:
                                      maxHeight /
                                      Math.min(UNIT, windowCubeWidth),
                                    w: 1,
                                    h: 1,
                                  },
                                ]);
                              }
                            }}
                          >
                            <Center>
                              <VStack gap={0}>
                                <Box
                                  border={"1px solid white"}
                                  borderRadius={"md"}
                                  w={10}
                                  h={10}
                                ></Box>
                                <Text color={"white"}>Cube</Text>
                              </VStack>
                            </Center>
                          </Button>
                          <Button
                            onClick={() => {
                              setComponents([
                                ...components,
                                {
                                  id: maxid + 1,
                                  title: "",
                                  content: null,
                                  image: null,
                                  canvasmode: "Article",
                                  link: null,
                                  x: 0,
                                  y:
                                    maxHeight / Math.min(UNIT, windowCubeWidth),
                                  w: 2,
                                  h: 1,
                                },
                              ]);
                            }}
                          >
                            <Center>
                              <VStack gap={0}>
                                <Box
                                  border={"1px solid white"}
                                  borderRadius={"md"}
                                  w={20}
                                  h={10}
                                ></Box>
                                <Text color={"white"}>Rectangle</Text>
                              </VStack>
                            </Center>
                          </Button>
                          <Button
                            onClick={() => {
                              setComponents([
                                ...components,
                                {
                                  id: maxid + 1,
                                  title: "",
                                  content: null,
                                  image: null,
                                  canvasmode: "Article",
                                  link: null,
                                  x: 0,
                                  y:
                                    maxHeight / Math.min(UNIT, windowCubeWidth),
                                  w: 2,
                                  h: 2,
                                },
                              ]);
                            }}
                          >
                            <Center>
                              <VStack gap={0}>
                                <Box
                                  border={"1px solid white"}
                                  borderRadius={"md"}
                                  w={14}
                                  h={14}
                                ></Box>
                                <Text color={"white"}>Big Cube</Text>
                              </VStack>
                            </Center>
                          </Button>
                        </HStack>
                        <Button
                          size={"xs"}
                          margin={1}
                          onClick={() => setOnAddAction(false)}
                          colorPalette={"blue"}
                          variant={"subtle"}
                        >
                          キャンセル
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Button
                      right={5}
                      bottom={5}
                      position={"fixed"}
                      bgColor={"black"}
                      zIndex={100}
                      borderRadius={"4xl"}
                      onClick={() => setOnAddAction(true)}
                    >
                      <LuPlus />
                    </Button>
                  )}
                </>
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
