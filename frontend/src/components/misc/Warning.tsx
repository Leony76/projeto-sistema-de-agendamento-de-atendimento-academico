import { type JSX } from 'react'
import { MdErrorOutline } from 'react-icons/md'

const Warning = ({ error }: { error: string }): JSX.Element => {
  return (
    <div className='text-red-500 flex gap-0.5 items-center'>
      <MdErrorOutline />
      <span className="text-xs"> {error} </span>
    </div>
  )
}

export default Warning