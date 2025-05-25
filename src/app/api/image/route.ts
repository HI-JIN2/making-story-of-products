import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { input } = await req.json()

  // 1. GPT로 이미지 프롬프트 생성
  const promptRes = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'user',
        content: `
        아래 농부의 사연을 감성적인 포스터 이미지 프롬프트로 바꿔줘.
        영어로, 따뜻하고 감동적인 분위기로 표현하고, 농업과 자연이 어우러진 장면이면 좋아.

        사연: """${input}"""
        `,
      },
    ],
    temperature: 0.8,
  })

  const imagePrompt = promptRes.choices[0].message.content?.trim()

  // 2. DALL·E 이미지 생성
  const imageRes = await openai.images.generate({
    model: 'dall-e-3',
    prompt: imagePrompt!,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  })

  const imageUrl = imageRes.data[0].url
  return NextResponse.json({ url: imageUrl })
}
