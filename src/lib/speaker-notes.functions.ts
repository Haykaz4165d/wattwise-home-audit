import { createServerFn } from "@tanstack/react-start";

export const generateSpeakerNotes = createServerFn({ method: "POST" })
  .inputValidator((input: { title: string; text: string }) => {
    if (typeof input?.title !== "string" || typeof input?.text !== "string") throw new Error("Invalid input");
    const title = input.title.trim().slice(0, 200);
    const text = input.text.trim().slice(0, 4000);
    if (!text) throw new Error("Slide text is empty");
    return { title, text };
  })
  .handler(async ({ data }) => {
    const { writeSpeakerNotes } = await import("./speaker-notes.server");
    try {
      return { notes: await writeSpeakerNotes(data.title, data.text), error: null as string | null };
    } catch (e) {
      console.error("speaker notes failed", e);
      return { notes: null as string | null, error: "AI-ն այս պահին չկարողացավ գրել խոսքը։ Փորձեք մի փոքր ուշ։" };
    }
  });
