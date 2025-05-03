"use client";

import { Button, Image, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function page() {
  const [link, setLink] = useState<string>("");
  const [image, setImage] = useState<string>("");
  return (
    <>
      <Input onChange={(e) => setLink(e.target.value)} type="url" />
      <Button
        onClick={async () => {
          const res = await fetch("/api/getOGP", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: link }),
          });
          const data = await res.json();
          console.log(data);
          if (!data.error) {
            console.log(data.image);
          }
          setImage(data.image);
        }}
      >
        確認する
      </Button>
      {image ? <Image src={image} alt="OGP" /> : null}
    </>
  );
}
