import { blockTypes } from "@/app/test/page";
import { hoveredIndexAtom } from "@/lib/jotai/hoveredIndexAtom";
import { modalAtom } from "@/lib/jotai/modalAtom";
import { supabase } from "@/lib/supabase";
import {
  Box,
  Button,
  Center,
  Circle,
  CloseButton,
  Dialog,
  Float,
  HStack,
  Portal,
  Image,
  Text,
  Input,
  Textarea,
  Editable,
  IconButton,
  VStack,
  Select,
  createListCollection,
  NativeSelect,
} from "@chakra-ui/react";
import { useSetAtom } from "jotai";
import { useState } from "react";
import {
  LuCheck,
  LuEllipsis,
  LuPencilLine,
  LuTrash,
  LuX,
} from "react-icons/lu";
import { toaster } from "./ui/toaster";

// canvasmode は、Image,Link,File,Articleのうちどれか

export default function ArticleEditModal({
  data,
  modalWidth,
  maxid,
}: {
  data: blockTypes;
  modalWidth: number;
  maxid: number;
}) {
  const onOpen = useSetAtom(modalAtom);
  const setHoveredIndex = useSetAtom(hoveredIndexAtom);
  const [isOpen, setIsOpen] = useState(false);
  const id = data.id;
  const [mode, setMode] = useState<string>(data.canvasmode);
  const [title, setTitle] = useState<string>(data.title);
  const [content, setContent] = useState<string | null>(data.content);
  const [image, setImage] = useState<string | null>(data.image);
  const [link, setLink] = useState<string | null>(data.link);
  const [hasChanged, setHasChanged] = useState(false);
  const [inputFile, setInputFile] = useState<File>();
  const [inputImage, setInputImage] = useState<Blob>();
  const [alertVisible, setAlertVisible] = useState(false);

  const canvasModes = createListCollection({
    items: ["Article", "File", "Image", "Link"],
  });

  const setFile = async (file: File) => {
    console.log(file);
    console.log(file.name.split("."));
    console.log(file.name.split(".")[file.name.split(".").length - 1]);
    setInputFile(file);
    if (!title) {
      setTitle(file.name);
    }
    console.log(data);
  };

  const getOGP = async () => {
    if (mode == "Link") {
      const res = await fetch("/api/getOGP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: link }),
      });
      const data = await res.json();
      if (!data.error) {
        setImage(data.image);
        return data.image;
      } else {
        return null;
      }
    }
  };

  const updateCanvas = async () => {
    console.log(data.id, maxid);
    if (mode == "Link") {
      getOGP().then(async (imageLink) => {
        if (maxid < data.id) {
          const { data: updateData, error: updateError } = await supabase
            .from("content")
            .insert({
              title: title,
              content: content,
              image: imageLink,
              link: link,
              canvasmode: mode,
              x: data.x,
              y: data.y,
              w: data.w,
              h: data.h,
            });
          if (updateError) {
            throw updateError;
          }
          modalJotai(false);
          return updateData;
        } else {
          const { data: updateData, error: updateError } = await supabase
            .from("content")
            .update({
              title: title,
              content: content,
              image: imageLink,
              link: link,
              canvasmode: mode,
            })
            .eq("id", data.id);
          if (updateError) {
            throw updateError;
          }
          modalJotai(false);
          return updateData;
        }
      });
    } else {
      if (inputFile) {
        const tmpFileName = crypto.randomUUID();
        const { data: fileInputData, error } = await supabase.storage
          .from("file")
          .upload(
            `public/${tmpFileName}.${
              inputFile.name.split(".")[inputFile.name.split(".").length - 1]
            }`,
            inputFile,
            {
              cacheControl: "3600",
              upsert: false,
            }
          );
        if (error) {
          console.error(error);
          throw error;
        }
        console.log(fileInputData);
        if (maxid < data.id) {
          console.log("ADD");
          const { data: updateData, error: updateError } = await supabase
            .from("content")
            .insert({
              title: title,
              content: content,
              image: inputFile.type.startsWith("image")
                ? process.env.NEXT_PUBLIC_SUPABASE_URL +
                  "/storage/v1/object/public/file/public/" +
                  tmpFileName +
                  "." +
                  inputFile.name.split(".")[
                    inputFile.name.split(".").length - 1
                  ]
                : null,
              link:
                mode == "File"
                  ? process.env.NEXT_PUBLIC_SUPABASE_URL +
                    "/storage/v1/object/public/file/public/" +
                    tmpFileName +
                    "." +
                    inputFile.name.split(".")[
                      inputFile.name.split(".").length - 1
                    ]
                  : null,
              canvasmode: mode,
              x: data.x,
              y: data.y,
              w: data.w,
              h: data.h,
            });
          if (updateError) {
            console.error("error:", updateError);
            throw updateError;
          }
          console.log("UPDATEDATA:", updateData);
          modalJotai(false);
          return updateData;
        } else {
          console.log("UPDATE");
          const { data: updateData, error: updateError } = await supabase
            .from("content")
            .update({
              title: title,
              content: content,
              image: inputFile.type.startsWith("image")
                ? process.env.NEXT_PUBLIC_SUPABASE_URL +
                  "/storage/v1/object/public/file/public/" +
                  tmpFileName +
                  "." +
                  inputFile.name.split(".")[
                    inputFile.name.split(".").length - 1
                  ]
                : null,
              link:
                process.env.NEXT_PUBLIC_SUPABASE_URL +
                "/storage/v1/object/public/file/public/" +
                tmpFileName +
                "." +
                inputFile.name.split(".")[inputFile.name.split(".").length - 1],
              canvasmode: mode,
            })
            .eq("id", data.id);
          if (updateError) {
            console.error("error:", updateError);
            throw updateError;
          }
          console.log("UPDATEDATA:", updateData);
          modalJotai(false);
          return updateData;
        }
      } else {
        if (maxid < data.id) {
          console.log("ADD");
          const { data: updateData, error: updateError } = await supabase
            .from("content")
            .insert({
              title: title,
              content: content,
              image: null,
              link: null,
              canvasmode: mode,
              x: data.x,
              y: data.y,
              w: data.w,
              h: data.h,
            });
          if (updateError) {
            console.error("error:", updateError);
            throw updateError;
          }
          console.log("UPDATEDATA:", updateData);
          modalJotai(false);
          return updateData;
        } else {
          console.log("UPDATE");
          const { data: updateData, error: updateError } = await supabase
            .from("content")
            .update({
              title: title,
              content: content,
              canvasmode: mode,
            })
            .eq("id", data.id);
          if (updateError) {
            console.error("error:", updateError);
            throw updateError;
          }
          console.log("UPDATEDATA:", updateData);
          modalJotai(false);
          return updateData;
        }
      }
    }
  };

  const deleteFunction = async () => {
    console.log("delete func.");
    const coord = [data.x, data.y];
    const w = data.w;
    if (w == 2) {
      const { data: deleteDatas, error } = await supabase
        .from("content")
        .select("*")
        .gt("y", coord[1]);
      console.log(data, data.id);
      await supabase
        .from("content")
        .delete()
        .eq("id", data.id)
        .then(async (deleteResult) => {
          console.log("result:", deleteResult);
          if (
            data.image &&
            data.image.startsWith(
              process.env.NEXT_PUBLIC_SUPABASE_URL as string
            )
          ) {
            console.log(data.image.slice(71));
            await supabase.storage.from("file").remove([data.image.slice(71)]);
          }
          if (deleteDatas) {
            deleteDatas.map(async (deleteData) => {
              await supabase
                .from("content")
                .update({ y: deleteData.y - data.h })
                .eq("id", deleteData.id);
            });
          }
        });
      const { data: canvas } = await supabase.from("content").select("*");
      console.log(canvas);
    } else {
      // wが1のときには、w=2のコンポーネントが来るまで、自身よりも後のコンポーネントを前にずらしていく
      console.log(data, data.id);
      await supabase
        .from("content")
        .delete()
        .eq("id", data.id)
        .then(async (deleteResult) => {
          console.log("result:", deleteResult);
          if (
            data.image &&
            data.image.startsWith(
              process.env.NEXT_PUBLIC_SUPABASE_URL as string
            )
          ) {
            console.log(data.image.slice(71));
            await supabase.storage.from("file").remove([data.image.slice(71)]);
          }
        });
      const { data: canvas } = await supabase.from("content").select("*");
      console.log(canvas);
    }
    modalJotai(false);
  };

  const modalJotai = (isOpen: boolean) => {
    onOpen(isOpen);
    if (!isOpen) {
      setHoveredIndex(null);
    }
  };
  const componentSwitch = () => {
    switch (mode) {
      case "Link":
        return (
          <>
            <Center w="100%">
              <VStack w="100%">
                <Text>LINK</Text>
                <Input
                  onChange={(e) => {
                    setLink(e.target.value);
                    setHasChanged(true);
                  }}
                  defaultValue={link ? link : ""}
                  w="90%"
                />
                {hasChanged ? (
                  <Button onClick={updateCanvas}>保存</Button>
                ) : null}
              </VStack>
            </Center>
          </>
        );
      case "Image":
        return (
          <>
            <Center w="100%">
              <VStack w="100%">
                <Text>IMAGE</Text>
                <Input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files![0]);
                    setHasChanged(true);
                  }}
                  w="90%"
                />
                <Textarea
                  defaultValue={content ? content : ""}
                  w="90%"
                  onChange={(e) => {
                    setContent(e.target.value);
                    setHasChanged(true);
                  }}
                  resize={"none"}
                  h={modalWidth / 4}
                />
                {hasChanged ? (
                  <Button onClick={updateCanvas}>保存</Button>
                ) : null}
              </VStack>
            </Center>
          </>
        );
      case "Article":
        return (
          <>
            <Center w="100%">
              <VStack w="100%">
                <Text>ARTICLE</Text>
                <Input
                  type="file"
                  onChange={(e) => {
                    setFile(e.target.files![0]);
                    setHasChanged(true);
                  }}
                  w="90%"
                />
                <Textarea
                  defaultValue={content ? content : ""}
                  w="90%"
                  h={modalWidth / 4}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setHasChanged(true);
                  }}
                  resize={"none"}
                />
                {hasChanged ? (
                  <Button onClick={updateCanvas}>保存</Button>
                ) : null}
              </VStack>
            </Center>
          </>
        );
      case "File":
        return (
          <>
            <Text>File</Text>
            <Input
              type="file"
              onChange={(e) => {
                setFile(e.target.files![0]);
                setHasChanged(true);
              }}
              w="90%"
            />
            {hasChanged ? <Button onClick={updateCanvas}>保存</Button> : null}
          </>
        );
    }
  };
  return (
    <>
      <Float
        right={isOpen ? modalWidth / 24 : modalWidth / 120}
        top={isOpen ? modalWidth / 48 : modalWidth / 120}
        onClick={() => setIsOpen(true)}
      >
        {isOpen ? (
          <Box bgColor={"white"} borderRadius={"xl"}>
            <HStack margin={modalWidth / 120}>
              <Dialog.Root
                size="xl"
                placement={"center"}
                scrollBehavior={"inside"}
                onOpenChange={(e) => modalJotai(e.open)}
              >
                <Dialog.Trigger asChild>
                  <Button bgColor={"white"} size="xs">
                    <LuPencilLine color="black" />
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content w={modalWidth * 2 - 10}>
                      <Dialog.Header margin={(modalWidth * 2 - 10) / 50}>
                        <Dialog.Title
                          margin={(modalWidth * 2 - 10) / 50}
                          fontSize={"2xl"}
                          w="90%"
                        >
                          <Input
                            defaultValue={title ? title : ""}
                            onChange={(e) => {
                              setTitle(e.target.value);
                              setHasChanged(true);
                            }}
                          />
                        </Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body
                        w="100%"
                        margin={(modalWidth * 2 - 10) / 100}
                      >
                        <Center>
                          <NativeSelect.Root w="90%">
                            <NativeSelect.Field
                              defaultValue={data.canvasmode}
                              onChange={(e) => {
                                console.log(e.currentTarget.value);
                                setMode(e.currentTarget.value);
                              }}
                            >
                              {canvasModes.items.map((canvasmode) => {
                                return (
                                  <option value={canvasmode} key={canvasmode}>
                                    {canvasmode}
                                  </option>
                                );
                              })}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                          </NativeSelect.Root>
                        </Center>
                        {data.image ? (
                          <Center>
                            <Image src={data.image} w="90%" />
                          </Center>
                        ) : null}
                        {inputImage ? <Image src={inputImage} /> : null}
                        {componentSwitch()}
                      </Dialog.Body>
                      <Dialog.Footer
                        margin={(modalWidth * 2 - 10) / 100}
                      ></Dialog.Footer>
                      <Dialog.CloseTrigger top="0" insetEnd="0" asChild>
                        {/* <Button borderRadius={"md"}> */}
                        <CloseButton bg="bg" size="sm" />
                        {/* </Button> */}
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
              <Dialog.Root
                size="xl"
                placement={"center"}
                scrollBehavior={"inside"}
                onOpenChange={(e) => modalJotai(e.open)}
              >
                <Dialog.Trigger asChild>
                  <Button bgColor={"white"} size="xs">
                    <LuTrash color="black" />
                  </Button>
                </Dialog.Trigger>
                <Portal>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content w={modalWidth * 2 - 10}>
                      <Dialog.Header margin={(modalWidth * 2 - 10) / 50}>
                        <Dialog.Title
                          margin={(modalWidth * 2 - 10) / 50}
                          fontSize={"2xl"}
                          w="90%"
                        >
                          Dialog Title
                        </Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body
                        w="100%"
                        margin={(modalWidth * 2 - 10) / 100}
                      >
                        <p>このCanvasを削除しますか？</p>
                      </Dialog.Body>
                      <Dialog.Footer margin={(modalWidth * 2 - 10) / 100}>
                        <Dialog.ActionTrigger asChild>
                          <Button variant="outline">削除しない</Button>
                        </Dialog.ActionTrigger>
                        <Button
                          onClick={() => {
                            deleteFunction();
                          }}
                        >
                          削除する
                        </Button>
                      </Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Portal>
              </Dialog.Root>
            </HStack>
          </Box>
        ) : (
          <Circle size={modalWidth / 48} bg="red" color={"white"}>
            <LuEllipsis />
          </Circle>
        )}
      </Float>
    </>
  );
}
