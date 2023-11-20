"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
type Props = {};

const CreateNoteDialog = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = useState("");

  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post("/api/uploadFileToFirebase", {
        noteId,
      });
      return response.data;
    },
  });

  const createNoteBook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNoteBook", {
        name: input,
      });
      return response.data;
    },
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    // Your handling logic here
    console.log(event.target.value);
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input === "") {
      window.alert("Please enter a name for your notebook");
      return;
    }

    createNoteBook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        // console.log("success ", note_id);
        uploadToFirebase.mutate(note_id);
        router.push(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.error(error);
        window.alert("Failed to add note book");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 border-green-600 h-full flex  rounded-xl items-center justify-center sm:flex-col hover:shadow-xl transition hover:translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="text-green-600 font-semibold sm:mt-2">
            New Note Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input placeholder="Name..." value={input} onChange={handleChange} />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createNoteBook.isPending}
            >
              {createNoteBook.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
