// /api/createNoteBook

import { generateImagePrompt, generateImage } from '@/lib/openai';
import {auth, currentUser} from '@clerk/nextjs'
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';


 

export async function POST(req: Request) {

    // return new NextResponse("ok");

    const {userId}: { userId: string | null } = auth();
    const user = await currentUser();
    
    if(!userId){
        return new Response("Unauthorized", { status: 401 });
      }

    const body = await req.json();
    const {name} = body;
    console.log(user?.firstName )
     const image_description = await generateImagePrompt(name);
    // console.log({image_description});
    const image_url = await generateImage(image_description);

      if(!image_url) {
        return new NextResponse ("failed to generate image description", {status: 500})
      }

      const note = await db.insert($notes).values(
        {
            name,
            imageUrl: image_url,
            userId
        }
      ).returning({
        insertedId: $notes.id
      })

    return  NextResponse.json({
        note_id: note[0].insertedId
    });
}

