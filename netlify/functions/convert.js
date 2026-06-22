const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic();

const LEVEL_PROMPTS = {
  1: {
    name: "たしなみ程度",
    instruction:
      "怒りや不快感を、ごくささやかに、ほとんど気づかれない程度にだけ匂わせる、上品な令嬢の言葉に変換してください。怒りの強さはほんの一滴だけ。基本は穏やかで余裕のある口調にしてください。",
  },
  2: {
    name: "淑女風",
    instruction:
      "怒りや不快感を、淑女らしい落ち着いた言葉の奥にしっかりと隠して変換してください。表面上は上品ですが、行間から確かな不満が伝わるようにしてください。",
  },
  3: {
    name: "ご令嬢風",
    instruction:
      "怒りや敵意を、気高いご令嬢らしい毅然とした言葉で包んで変換してください。優雅さは保ちつつも、強い不満や非難の意志がはっきり伝わるようにしてください。",
  },
  4: {
    name: "公爵令嬢級",
    instruction:
      "激しい怒りや殺意すら漂うような感情を、公爵令嬢にふさわしい最上級の気品と格式で完全に覆い隠して変換してください。言葉は優雅で美しいのに、底知れぬ怒りと圧が伝わるようにしてください。",
  },
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const level = LEVEL_PROMPTS[body.level] ? body.level : 2;

  if (!text) {
    return { statusCode: 400, body: JSON.stringify({ error: "text is required" }) };
  }
  if (text.length > 500) {
    return { statusCode: 400, body: JSON.stringify({ error: "text is too long" }) };
  }

  const { instruction } = LEVEL_PROMPTS[level];

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 300,
      system:
        "あなたは「お嬢様翻訳協会」の専属翻訳官です。利用者が入力した荒ぶる感情(怒り・苛立ち・悪態など)を、お嬢様言葉に変換します。" +
        "ポイントは『上品な言葉にする』ことではなく『怒りをどれだけ優雅に隠せるか』です。怒りの内容・対象・強度は変換後も失わず、語尾や言葉選びだけを気品ある表現に変えてください。" +
        instruction +
        " 出力は変換後の一文(または短い文章)のみを返し、説明や前置きは一切つけないでください。",
      messages: [{ role: "user", content: text }],
    });

    const resultText = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: resultText }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "変換に失敗しましたわ" }),
    };
  }
};
