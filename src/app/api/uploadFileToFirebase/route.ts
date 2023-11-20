import {db} from '@/lib/db'
import { $notes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    try{
        const {note_id} = await req.json();

        //extract doll e image
        const notes = await db.select().from($notes).where(
            eq($notes.id, parseInt(note_id))
        )

        if(!notes[0].imageUrl) {
            return new NextResponse('no image url', {status: 400})
        }
        
    }
    catch(error){}

}