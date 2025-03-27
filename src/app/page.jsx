import Captcha from '@/components/Captcha';
import React from 'react'

const page = () => {
  return (
    <div className='p-8 w-[300px]'>
      <input className='border p-2 rounded-sm w-[100%]' type="text" placeholder="message"></input>
      <div><Captcha /></div>
      <button className='p-2 border mt-4'>Send</button>
    </div>
  )
}

export default page;