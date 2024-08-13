import { cn } from '@/lib/utils'
import React from 'react'

const Chain = () => {
    return (
        <div className="max-h-[80vh] resize-y overflow-y-auto bg-white ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-700">
            <table className="min-w-full divide-y divide-zinc-300 dark:divide-white/10">
                <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-800">
                    <tr className="divide-x divide-zinc-200 dark:divide-white/10">
                        <th scope="col" className="min-w-[5ch]">
                            CE
                        </th>
                        <th scope="col" className="min-w-[5ch]">
                            Strike
                        </th>
                        <th scope="col" className="min-w-[5ch]">
                            PE
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 overflow-y-auto bg-white text-zinc-900 dark:divide-white/10 dark:bg-zinc-900 dark:text-zinc-100">
                    <tr

                        className="divide-x divide-zinc-200 dark:divide-white/10"

                    >

                        <td

                            className={cn(
                                'bg-blue-50/60 text-blue-800 dark:bg-blue-900/5 dark:text-blue-500 text-center',
                                true
                                    ? 'cursor-pointer hover:bg-blue-100 hover:dark:bg-blue-900/50'
                                    : 'pointer-events-none'
                            )}
                        >
                            {/* {Math.round(option.underlying_spot_price)} */}
                            hjih
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Chain