import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = async () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi Simon! Bellhop Moving here! We received your request and will be reaching out to you momentarily. Talk to you soon. rply optout to stop`,
      },
    ]);

    setLoading(true);

    const response = await fetch("/api/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    setLoading(false);
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.content,
      }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data: any = await response.json();

    if (!data) {
      return;
    }

    setLoading(false);

    setMessages((messages) => [
      ...messages,
      ...data.responses.map((response: string) => ({
        role: "assistant",
        content: response,
      })),
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi Simon! Bellhop Moving here! We received your request and will be reaching out to you momentarily. Talk to you soon. rply optout to stop`,
      },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Chatbot UI</title>
        <meta
          name="description"
          content="A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block mx-auto my-4"
          onClick={handleReset}
        >
          Reset Conversation
        </button>

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat messages={messages} loading={loading} onSend={handleSend} />
            <div ref={messagesEndRef} />
            {/* add a reset button below */}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
