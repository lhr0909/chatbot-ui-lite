import { ChatbotResponse } from "@/utils";

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const response = await fetch(`${process.env.API_URL}/reset`, {
      body: JSON.stringify({
        lead_id: process.env.LEAD_ID,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (response.status !== 200) {
      throw new Error("OpenAI API returned an error");
    }

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
};

export default handler;
