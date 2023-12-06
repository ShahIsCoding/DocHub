import React from 'react'
import { Icons } from './assets/icons'
const ToolBar = () => {
  return (
    <div className='bg-slate-300 flex flex-row gap-4 p-3'>
        <button>{Icons.bold}</button>
        <button>{Icons.italic}</button>
        <button>{Icons.underline}</button>
        <button>{Icons.textColor}</button>
        <button>{Icons.highlight}</button>
    </div>
  )
}

export default ToolBar