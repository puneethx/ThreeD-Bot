"use client";
import { AppContext } from '@/app/context/IsPlayingContext';
import { sendTextToOpenAi } from '@/utils/sendTextToOpenAI';
import React, { FormEvent, useState, useContext} from 'react'

export const TextToSpeech = () => {
    const [userText, setuserText] = useState("")
    const [isLoading, setisLoading] = useState(false);
    const { isPlaying, setIsPlaying } =  useContext(AppContext)

    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    const voices = synth?.getVoices();

    const selectedVoices = voices?.find((voice) => voice.name === "Microsoft David - English (United States)");

    const speak = ( textToSpeak : string) => {
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.voice = selectedVoices!;
        utterance.rate = 0.75;
        synth?.speak(utterance);
        setIsPlaying(true)
        utterance.onend = (() => {
            setIsPlaying(false)
        })
    }

    const handleUserText = async(e : FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setisLoading(true)
        try{
            const message = await sendTextToOpenAi(userText)
            speak(message)
        } catch(error) {
            let message = ""
            if(error instanceof Error) message = error.message
        }finally{
            setisLoading (false)
            setuserText("")
        }
    }
    return (
        <div className='relative top-0 z-50'>
            <form 
            onSubmit={handleUserText} 
            className='absolute top-[90vh] left-[30px] space-x-2 pt-2'>
                <input
                    value={userText}
                    onChange={(e) => setuserText(e.target.value)}
                    className='bg-transparent w-[510px] border border-[#b00c3f]/80 outline-none rounded-lg 
                    placeholder:text-[#b00c3f] p-2 text-[#b00c3f]'
                    type='text'
                    placeholder='Say "Hi" to Puneeth...?'
                />
                <button
                    disabled = {isLoading} 
                    className='text-[#b00c3f] p-2 border border-[#b00c3f] rounded-lg disabled:text-blue-100 
                    disabled:cursor-not-allowed disabled:bg-gray-500 hover:scale-110 hover:text-black 
                    hover:bg-[#b00c3f] duration-300 transition-all'>
                        {isLoading ? "Thinking..." : "Ask"}
                </button>
            </form>
        </div>
    )
}
