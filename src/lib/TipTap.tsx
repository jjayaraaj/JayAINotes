"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TipTapMenubar from "@/components/TipTapMenubar";
import { Button } from "@/components/ui/button";
import useDebounce from "./useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "./db/schema";
import { Text } from "@tiptap/extension-text";
import { useCompletion } from "ai/react";

type Props = {
  note: NoteType;
};

const TipTap = ({ note }: Props) => {
  const [editorState, setEditorState] = useState(
    note.editorState || `<h1>${note.name}</h1>`
  );

  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });

  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
      });
      return response.data;
    },
  });

  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          console.log(prompt);
          complete(prompt);
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    autofocus: true,
    extensions: [StarterKit, customText],
    content: editorState,
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  const lastCompletion = useRef("");
  const token = useMemo(() => {
    if (!completion) return;
    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    return diff;
  }, [completion]);

  useEffect(() => {
    if (!completion || !editor) return;

    const diff = completion.slice(lastCompletion.current.length);
    lastCompletion.current = completion;
    editor.commands.insertContent(diff);
    console.log(completion);
  }, [completion]);

  const debounceEditorState = useDebounce(editorState, 1000);

  useEffect(() => {
    console.log(debounceEditorState);
    if (debounceEditorState === "") return;
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("success update ", data);
      },
      onError: (error) => {
        console.error(error);
      },
    });

    // setEditorState(debBo)
  }, [debounceEditorState]);

  return (
    <>
      <div className=" flex">
        {editor && <TipTapMenubar editor={editor} />}
        <Button variant={"outline"} disabled>
          {saveNote.isPending ? "Saving..." : "Saved"}
        </Button>
      </div>

      <div className="prose prose-sm w-full mt-4">
        <EditorContent editor={editor} />
      </div>
      <div className="h-4"></div>
      <span className="text-sm">
        Tip: press{" "}
        <kbd className="px-2 py-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          Shift + a
        </kbd>{" "}
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTap;
