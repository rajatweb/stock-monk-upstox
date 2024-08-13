import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'

const OptionsMeta = ({
  meta
}: any) => {
  return (
    <td
      className={cn(
        'group',
        '-px-4 font-medium text-center',
        true
          ? 'bg-yellow-50/50 text-yellow-800 dark:bg-stone-700/10 dark:text-yellow-400'
          : 'text-zinc-900 dark:bg-zinc-800/10 dark:text-zinc-100'
      )}
    >
      <div className='flex justify-center aligh-item items-center space-x-2 p-2'>
        <div className='space-x-2'>
          <Button size="sm" variant="outline">B</Button>
          <span>{meta.market_data.ask_price}</span>
          <Button size="sm" variant="destructive">S</Button>
        </div>
      </div>
    </td>
  )
}

export default OptionsMeta