import { NextRequest, NextResponse } from 'next/server'
import { generateGif } from '@/lib/runway'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as string
    const promptText = formData.get('promptText') as string

    if (!image || !promptText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 图片已经是 base64 格式，直接使用
    const imageUrl = image

    // 调用 Runway API
    const result = await generateGif(imageUrl, promptText)

    return NextResponse.json(result)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 