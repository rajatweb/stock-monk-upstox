interface IPageHeaderProps {
    title: string,
    description: string
}

const PageHeader = ({
    title,
    description
}: IPageHeaderProps) => {
    return (
        <div className="space-y-0.5 border-b py-4">
            <h2 className="text-2xl font-bold tracking-tight text-right">{title}</h2>
            <p className="text-muted-foreground text-right">{description}</p>
        </div>
    )
}

export default PageHeader