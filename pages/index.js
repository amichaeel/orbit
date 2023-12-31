import React from 'react';
import Navbar from '@/components/Navbar';
import withAuth from '@/components/withAuth';

function Home() {
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className='container mx-auto p-4 text-center'>
        <div className='flex flex-col justify-center items-center'>
          <a href="/browse" className='text-6xl font-bold text-gray-300 mb-4 hover:text-opacity-90'>browse</a>
          <a href="/join" className='text-6xl font-bold text-gray-300 mb-4 hover:text-opacity-90'>join</a>
        </div>
        <p className='text-xl text-gray-400 mb-8 mt-8'>popular channels:</p>
        <div className='flex flex-col justify-center items-center'>
          <a href="/channel/global" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#global</a>
          <a href="/channel/starwars" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#starwars</a>
          <a href="/channel/global" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#global</a>
          <a href="/channel/disney" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#disney</a>
          <a href="/channel/anime" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#anime</a>
          <a href="/channel/lostcause" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#lostcause</a>
          <a href="/channel/tired" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#tired</a>
          <a href="/channel/spam" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#spam</a>
          <a href="/channel/unfiltered" className='btn shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out hover:translate-y-1 transition-all text-6xl font-bold text-gray-400 mb-4 hover:text-opacity-90'>#unfiltered</a>
        </div>
      </div>
    </div>
  )
}

export default withAuth(Home);
