import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    console.log(request);

    const response = await fetch(request.url);
    const content = await response.text();

    const ogp = content.match(/<meta property="og:image" content="(.*?)"/);

    if (ogp && ogp[1]) {
      console.log(ogp[0]);
      console.log(ogp[1]);

      // 正常なレスポンスを返す
      return NextResponse.json({
        image: ogp[1],
      });
    } else {
      // OGPが見つからなかった場合のエラーレスポンス
      return NextResponse.json(
        { error: "OGP image not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching OGP:", error);

    // エラーレスポンスを返す
    return NextResponse.json({ error: "Failed to fetch OGP" }, { status: 500 });
  }
}
