import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
});

export async function GET(request: Request) {
    return new Response("Hello, from OpenAI!")
}

export async function POST(request: Request) {
    const {userText} = await request.json()
    
    // const completion = await openai.chat.completions.create({
    //     messages: [{ role: "system", content: userText }],
    //     model: "gpt-3.5-turbo",
    //   });
    //   const aiMessage = completion.choices[0].message;

    return NextResponse.json(
        {
            message : 
                "hey there visitor this is Puneeth Reddy here... the developer who created this 3 js project. As of now, I have revoked the API key for this project",
            }, 
            {status: 200});
}
