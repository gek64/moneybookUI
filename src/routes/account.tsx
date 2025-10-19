import {createFileRoute} from "@tanstack/react-router"
import {useQuery} from "@tanstack/react-query"
import {API_GetAccounts} from "../apis/account.ts"

export const Route = createFileRoute("/account")({
    component: RouteComponent,
})

function RouteComponent() {
    let getAccounts = useQuery({
        queryKey: ["getAccounts"],
        queryFn: API_GetAccounts
    })

    if (getAccounts.isFetching) {
        return <div>Fetching...</div>
    }
    if (getAccounts.error) {
        return <div>Error: {getAccounts.error.message}</div>
    }

    return (
        <div>
            <p>This is about.tsx</p>
            <ul>
                {getAccounts.data?.map(item => (
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
