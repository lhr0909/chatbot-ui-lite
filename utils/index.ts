
export const ChatbotResponse = async (message: string) => {

  const res = await fetch(`${process.env.API_URL}/messages`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      lead_id: process.env.LEAD_ID,
      user_hash: process.env.USER_HASH,
      first_name: "Simon",
      last_name: "Harris",
      time_zone: "America/Los_Angeles",
      sms_message: message,
    }),
  });

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  return res.json();
};
