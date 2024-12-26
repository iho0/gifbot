'use client'

import { useState, useCallback, useRef } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

export default function Create() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [promptText, setPromptText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [warning, setWarning] = useState<string | null>(null)

  const handleImageUpload = (file: File) => {
    if (file.type.startsWith('image/')) {
      setImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      setWarning(null)
      setCroppedImage(null)
      setCrop(undefined)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) handleImageUpload(file)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleImageUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onCropComplete = useCallback((crop: Crop) => {
    if (!imageRef.current || !crop.width || !crop.height) return

    const canvas = document.createElement('canvas')
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height
    canvas.width = crop.width
    canvas.height = crop.height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    setCroppedImage(canvas.toDataURL('image/jpeg'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!croppedImage) return
    
    if (!crop || crop.width < 256 || crop.height < 256) {
      setWarning('请裁剪图���至合适大小（至少 256x256 像素）')
      return
    }
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', croppedImage)
      formData.append('promptText', promptText)
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error?.includes('public figure content')) {
          throw new Error('图片包含人物肖像，请使用其他图片')
        }
        throw new Error(errorData.error || '生成失败，请重试')
      }

      const data = await response.json()
      console.log('API Response:', data)

      if (!data.output?.video_url) {
        throw new Error('No video URL in response')
      }

      setResult(data.output.video_url)
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : '生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!result) return
    try {
      const response = await fetch(result)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `generated-gif-${Date.now()}.gif`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('下载失败，请重试')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex h-screen">
        <div className="w-1/2 p-8 border-r border-gray-800 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8">创建动画</h1>
          
          <div className="mb-8 p-4 bg-blue-500/10 rounded-lg">
            <h2 className="font-semibold mb-2">使用说明：</h2>
            <div className="space-y-4">
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li>图片要求：</li>
                <ul className="list-none pl-5 space-y-1 text-gray-400">
                  <li>• 图片裁剪尺寸至少为 256x256 像素</li>
                  <li>• 提示词越具体，生成效果越好</li>
                </ul>
              </ul>

              <div className="mt-4">
                <p className="text-sm font-semibold text-red-400 mb-2">⚠️ 以下内容不被允许：</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                  <li>敏感内容：</li>
                  <ul className="list-none pl-5 space-y-1 text-gray-400">
                    <li>• 暴力或血腥内容</li>
                    <li>• 露骨或成人内容</li>
                    <li>• 仇恨或歧视性内容</li>
                    <li>• 政治敏感内容</li>
                  </ul>
                  
                  <li>版权内容：</li>
                  <ul className="list-none pl-5 space-y-1 text-gray-400">
                    <li>• 受版权保护的角色或商标</li>
                    <li>• 品牌标志或商业标识</li>
                  </ul>
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-green-400 mb-2">✅ 推荐使用的内容：</p>
                <ul className="list-none pl-5 space-y-1 text-gray-400">
                  <li>• 风景和自然场景</li>
                  <li>• 抽象艺术作品</li>
                  <li>• 人物肖像（配合适当的提示词）</li>
                  <li>• 物品和静物</li>
                  <li>• 建筑和城市景观</li>
                  <li>• 动物（非受保护物种）</li>
                  <li>• 几何图案和纹理</li>
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-blue-400 mb-2">💡 提示词建议：</p>
                <ul className="list-none pl-5 space-y-1 text-gray-400">
                  <li>• 使用具体、详细的描述</li>
                  <li>• 指定期望的动作和效果</li>
                  <li>• 对于人物图片，描述具体的动作和表情变化</li>
                  <li>• 可以添加艺术风格相关的描述</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-medium">上传并裁剪图片</label>
              {warning && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm">
                  ⚠️ {warning}
                </div>
              )}
              {imagePreview ? (
                <div className="relative">
                  <ReactCrop
                    crop={crop}
                    onChange={c => setCrop(c)}
                    onComplete={onCropComplete}
                    aspect={1}
                  >
                    <img
                      ref={imageRef}
                      src={imagePreview}
                      alt="Preview"
                      className="w-full rounded-lg"
                    />
                  </ReactCrop>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview('')
                      setCroppedImage(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-4">拖放图片到此处，或点击上传</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-purple-400 hover:text-purple-300"
                  >
                    选择文件
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-medium">动画提示词</label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-800/50 backdrop-blur-sm text-white resize-none"
                placeholder="描述你想要的动画效果..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !croppedImage}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl
                font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '生成中...' : '开始生成'}
            </button>
          </form>
        </div>

        <div className="w-1/2 p-8 bg-gray-900/50 overflow-y-auto">
          <div className="sticky top-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">预览结果</h2>
              {result && (
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>下载视频</span>
                </button>
              )}
            </div>

            {result ? (
              <div className="bg-gray-800 rounded-xl overflow-hidden">
                <video 
                  src={result} 
                  controls 
                  loop 
                  autoPlay 
                  muted 
                  className="w-full aspect-video"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-800/50 rounded-xl flex items-center justify-center">
                <p className="text-gray-400">生成的视频将在这里显示</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
} 