import React from 'react';
import PageHeader from '../header/page-header';

interface IContentLayoutProps {
    children: React.ReactNode,
    pageMeta: {
        title: string,
        description: string
    },
    WatchList?: JSX.Element | React.ReactNode
}

const ContentLayout = ({
    children,
    pageMeta,
    ...props
}: IContentLayoutProps) => {
    const { title, description } = pageMeta;
    return (
        <section className="container items-center ">
            {/* <PageHeader title={title} description={description} /> */}
            <div className="grid grid-cols-12">
                {/* <aside className="h-screen self-start sticky top-0 col-span-3 border-x">
                    {props.WatchList}
                </aside> */}
                <main className="col-span-12 border-x">
                    {children}
                </main>
            </div>
        </section>
    )
}

export default ContentLayout;
