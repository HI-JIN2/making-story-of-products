import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { input } = await req.json()

  const prompt = `
  아래의 농부의 사연을 바탕으로, 감성적인 포스터 제목과 짧은 소개 문구를 만들어 주세요.

  - 제목은 10자 내외로 간결하고 인상 깊게
  - 소개 문구는 1~2문장으로 따뜻하고 감동적으로 표현

  사연: """${input}"""
  
  포스터 제목:
  소개 문구:
  `

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
  })

  const content = response.choices[0].message.content || ''

  const [titleLine, descLine] = content
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^(포스터 제목|소개 문구):\s*/i, '').trim())

  return NextResponse.json({
    title: titleLine,
    description: descLine,
  })
}
