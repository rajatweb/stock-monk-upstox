import React from 'react'
import ContentLayout from '@/components/atoms/content/content-layout'

const Account = () => {

    return (
        <ContentLayout pageMeta={{
            title: "Account",
            description: "Manage your account settings and set e-mail preferences."
        }}>
            Hello
        </ContentLayout>
    )
    // return (
    //     <section className="container items-center ">
    //         <div className="space-y-0.5 border-b py-4">
    //             <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
    //             <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
    //         </div>
    //         <div className="grid grid-cols-12">
    //             <aside className="h-screen self-start sticky top-0 col-span-3 border-x">
    //                 <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
    //                     <a
    //                         className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 bg-muted hover:bg-muted justify-start"
    //                         href="/examples/forms"
    //                     >
    //                         Profile
    //                     </a>
    //                     <a
    //                         className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
    //                         href="/examples/forms/account"
    //                     >
    //                         Account
    //                     </a>
    //                     <a
    //                         className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
    //                         href="/examples/forms/appearance"
    //                     >
    //                         Appearance
    //                     </a>
    //                     <a
    //                         className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
    //                         href="/examples/forms/notifications"
    //                     >
    //                         Notifications
    //                     </a>
    //                     <a
    //                         className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 px-4 py-2 hover:bg-transparent hover:underline justify-start"
    //                         href="/examples/forms/display"
    //                     >
    //                         Display
    //                     </a>
    //                 </nav>
    //             </aside>
    //             <main className="col-span-9 border-x">
    //                 <div className="space-y-6 p-4">
    //                     <div>
    //                         <h3 className="text-lg font-medium">Profile</h3>
    //                         <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
    //                     </div>
    //                     <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
    //                     <form className="space-y-8">
    //                         <div className="space-y-2">
    //                             <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor=":r1k8:-form-item">Username</label>
    //                             <input
    //                                 className="flex h-9 w-full border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    //                                 placeholder="shadcn"
    //                                 id=":r1k8:-form-item"
    //                                 aria-describedby=":r1k8:-form-item-description"
    //                                 aria-invalid="false"
    //                                 name="username"
    //                             />
    //                             <p id=":r1k8:-form-item-description" className="text-[0.8rem] text-muted-foreground">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p>
    //                         </div>
    //                         <button
    //                             className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
    //                             type="submit"
    //                         >
    //                             Update profile
    //                         </button>
    //                     </form>
    //                 </div>
    //             </main>
    //         </div>
    //     </section>
    // )
}

export default Account