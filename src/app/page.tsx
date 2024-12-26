import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            将文字转换为生动的GIF动画
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            只需输入您的创意描述，让AI为您生成独特的动态图像
          </p>
          <Link 
            href="/create" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center"
          >
            立即体验
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {/* 作品展示 */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-800/70 transition-colors">
              <div className="aspect-square bg-gray-700 rounded-lg mb-4 overflow-hidden">
                {/* 这里可以放示例GIF */}
              </div>
              <p className="text-gray-300 text-sm">"一只霓虹色蝴蝶在星空中翩翩起舞"</p>
            </div>
          ))}
        </div>
      </div>

      {/* 功能特点 */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center p-6 bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">快速生成</h3>
            <p className="text-gray-300">秒级生成，即刻获得创意成果</p>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">高品质输出</h3>
            <p className="text-gray-300">专业级别的动画效果</p>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-4">自由定制</h3>
            <p className="text-gray-300">丰富的参数调节选项</p>
          </div>
        </div>
      </div>
    </main>
  )
} 