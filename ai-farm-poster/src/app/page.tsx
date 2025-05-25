'use client'

import { useState } from 'react'
import html2canvas from 'html2canvas'
import { useRef } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const [story, setStory] = useState('')
  const [posterTitle, setPosterTitle] = useState('')
  const [posterDesc, setPosterDesc] = useState('')
  const [loadingStory, setLoadingStory] = useState(false)
  const [loadingPoster, setLoadingPoster] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [loadingImage, setLoadingImage] = useState(false)


  const handleStoryGenerate = async () => {
    setLoadingStory(true)
    const res = await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })
    const data = await res.json()
    setStory(data.story)
    setLoadingStory(false)
  }

  const handlePosterGenerate = async () => {
    setLoadingPoster(true)
    const res = await fetch('/api/poster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    })
    const data = await res.json()
    setPosterTitle(data.title)
    setPosterDesc(data.description)
    setLoadingPoster(false)
  }



  const posterRef = useRef<HTMLDivElement>(null)

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
    <main className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-4">🌾 농부의 사연을 감성 포스터로</h1>
      
      <textarea
        className="w-full h-40 p-3 border rounded mb-4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="예: 기후 때문에 사과 농사가 쉽지 않았지만, 가족을 위해 포기하지 않았습니다."
      />

      <button
        className="bg-green-600 text-white px-6 py-2 rounded mr-2"
        onClick={handleStoryGenerate}
        disabled={loadingStory}
      >
        {loadingStory ? '스토리 생성 중...' : '📖 스토리 생성하기'}
      </button>

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={handlePosterGenerate}
        disabled={loadingPoster}
      >
        {loadingPoster ? '포스터 생성 중...' : '🎨 포스터 제목/문구 생성'}
      </button>
      <button
        className="mt-2 px-6 py-2 bg-purple-600 text-white rounded"
        onClick={async () => {
          setLoadingImage(true)
          const res = await fetch('/api/image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input }),
          })
          const data = await res.json()
          setImageUrl(data.url)
          setLoadingImage(false)
        }}
      >
        {loadingImage ? '이미지 생성 중...' : '🖼️ 감성 포스터 이미지 생성'}
      </button>


      {story && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">📘 스토리 결과</h2>
          <p>{story}</p>
        </div>
      )}

      {posterTitle && (
        <div className="mt-6 p-4 border rounded bg-blue-50">
          <h2 className="text-xl font-semibold mb-2">🖼️ 포스터 제목</h2>
          <p className="text-lg font-bold">{posterTitle}</p>
          <h3 className="text-md mt-2">📣 소개 문구</h3>
          <p>{posterDesc}</p>
        </div>
      )}
      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">🖼️ 생성된 포스터 이미지</h2>
          <img src={imageUrl} alt="포스터 이미지" className="rounded border" />
        </div>
      )}

      {(posterTitle || imageUrl) && (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-2">🖼️ 최종 포스터</h2>

      <div ref={posterRef} className="w-[400px] p-4 border rounded bg-white shadow">
        {imageUrl && <img src={imageUrl} alt="포스터" className="rounded mb-4" />}
        {posterTitle && <h3 className="text-2xl font-bold mb-1">{posterTitle}</h3>}
        {posterDesc && <p className="text-gray-700">{posterDesc}</p>}
      </div>

      <button
        onClick={handleDownload}
        className="mt-4 px-6 py-2 bg-black text-white rounded"
      >
        ⬇️ 포스터 다운로드
      </button>
    </div>
  )}


    </main>
  )
}
