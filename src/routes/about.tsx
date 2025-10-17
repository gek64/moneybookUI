import {createFileRoute} from "@tanstack/react-router"
import {useQuery} from "@tanstack/react-query"

export const Route = createFileRoute("/about")({
    component: RouteComponent,
})

function RouteComponent() {
    const {isFetching, error, data,} = useQuery({
        queryKey: ["getAccountData"],
        queryFn: async (): Promise<{ id: string, name: string, type: string }[]> => {
            const resp = await fetch("http://nas.internal:8000/accounts")
            if (!resp.ok) {
                throw new Error("Error Code: " + resp.status + ", Error message: " + resp.statusText)
            }
            return await resp.json()
        },
    })

    if (isFetching) {
        return <div>Fetching...</div>
    }
    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div>
            <p>This is about.tsx</p>
            <ul>
                {data?.map(item => (
                    <li key={item.id}>
                        <p>id: {item.id}</p>
                        <p>name: {item.name}</p>
                        <p>type: {item.type}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
