import { RUNWAY_API_KEY, RUNWAY_API_URL } from './config'

export interface RunwayResponse {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED'
  output?: {
    video_url: string
  }
}

export async function generateGif(imageUrl: string, promptText: string) {
  try {
    // 确保图片是 base64 格式
    let base64Image = imageUrl
    if (!imageUrl.startsWith('data:image/')) {
      // 如果不是 base64，尝试转换
      try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error('Error converting image:', error)
        throw new Error('Invalid image format')
      }
    }

    console.log('Starting generation with:', {
      promptText,
      imageFormat: base64Image.substring(0, 30) + '...' // 只打印开头部分
    })

    const requestBody = {
      model: 'gen3a_turbo',
      promptImage: base64Image,
      promptText: promptText,
      parameters: {
        duration_seconds: 5,
        output_format: 'mp4',
        fps: 24,
        motion_bucket_id: 127,
        cond_aug: 0.02
      }
    }
    
    console.log('Request body structure:', {
      model: requestBody.model,
      hasImage: !!requestBody.promptImage,
      promptText: requestBody.promptText,
      parameters: requestBody.parameters
    })

    const createResponse = await fetch(`${RUNWAY_API_URL}/v1/image_to_video`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RUNWAY_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06'
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Initial response:', {
      status: createResponse.status,
      statusText: createResponse.statusText,
      headers: Object.fromEntries(createResponse.headers.entries())
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      console.error('Error response:', {
        text: errorText,
        status: createResponse.status
      })
      throw new Error(`API Error: ${errorText}`)
    }

    const task = await createResponse.json()
    console.log('Task created:', task)

    if (!task.id) {
      console.error('Invalid task response:', task)
      throw new Error('No task ID in response')
    }

    const taskId = task.id
    let result: RunwayResponse
    let attempts = 0
    const maxAttempts = 30 // 5分钟超时

    do {
      attempts++
      console.log(`Checking status (attempt ${attempts})...`)
      await new Promise(resolve => setTimeout(resolve, 10000))
      
      const statusResponse = await fetch(`${RUNWAY_API_URL}/v1/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${RUNWAY_API_KEY}`,
          'X-Runway-Version': '2024-11-06'
        }
      })

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        console.error('Status check failed:', errorText)
        throw new Error('Failed to check task status')
      }

      result = await statusResponse.json()
      console.log('Task status result:', result)

      // 检查是否生成成功并包含视频 URL
      if (result.status === 'SUCCEEDED' && result.output) {
        return {
          id: result.id,
          status: 'SUCCEEDED',
          output: {
            video_url: result.output // 直接使用 output 作为视频 URL
          }
        }
      }

      if (result.status === 'FAILED') {
        console.error('Task failed:', result)
        throw new Error(`Task processing failed: ${JSON.stringify(result)}`)
      }

      if (attempts >= maxAttempts) {
        throw new Error('Task timed out after 5 minutes')
      }
    } while (true)

  } catch (error) {
    console.error('Error generating video:', error)
    throw error
  }
} 