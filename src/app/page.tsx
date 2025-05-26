'use client'

import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'

export default function Home() {
  const [input, setInput] = useState('')
  const [story, setStory] = useState('')
  const [posterTitle, setPosterTitle] = useState('')
  const [posterDesc, setPosterDesc] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const posterRef = useRef<HTMLDivElement>(null)

  const handleGenerate = async () => {
    setLoading(true)

    const storyRes = await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    }).then(res => res.json())

    setStory(storyRes.story)

    // const posterRes = await fetch('/api/poster', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ input })
    // }).then(res => res.json())

    setPosterTitle(storyRes.title)
    setPosterDesc(storyRes.description)

    setLoading(false)
  }

  const handleImage = async () => {
    const res = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })
    const data = await res.json()
    setImageUrl(data.url)
  }

  const handleDownload = async () => {
    if (!posterRef.current) return
    const canvas = await html2canvas(posterRef.current)
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = 'poster.png'
    link.click()
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">농부의 사연을 감성 포스터로</h1>

        <textarea
          className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-gray-800"
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="예: 장마로 수확이 늦어졌지만, 포기하지 않고 끝까지 사과를 키웠습니다."
        />

        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-xl"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? '포스터 생성 중...' : '📖 사연으로 포스터 만들기'}
        </button>

        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl"
          onClick={handleImage}
        >
          🖼️ 이미지 생성
        </button>

        {(posterTitle || posterDesc || imageUrl || story) && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4 mt-6" ref={posterRef}>
            {imageUrl && (
              <img src={imageUrl} alt="poster" className="rounded-xl w-full object-cover" />
            )}
            {posterTitle && (
              <h2 className="text-2xl font-bold text-gray-800">{posterTitle}</h2>
            )}
            {posterDesc && (
              <p className="text-gray-600">{posterDesc}</p>
            )}
            {story && (
              <div className="pt-2 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">📘 스토리</h3>
                <p className="text-gray-600 whitespace-pre-line">{story}</p>
              </div>
            )}
          </div>
        )}

        {(posterTitle || imageUrl) && (
          <button
            onClick={handleDownload}
            className="w-full mt-4 bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-xl"
          >
            ⬇️ 포스터 이미지 다운로드
          </button>
        )}
      </div>
    </main>
  )
}
