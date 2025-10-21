import {createFileRoute} from "@tanstack/react-router"
import {useQuery} from "@tanstack/react-query"
import {API_readAccounts} from "../apis/account.ts"

export const Route = createFileRoute("/account")({
    component: RouteComponent,
})

async function RouteComponent() {
    let readAccountsQuery = useQuery({
        queryKey: ["readAccounts"],
        queryFn: API_readAccounts
    })

    if (readAccountsQuery.isFetching) {
        return <div>Fetching...</div>
    }
    if (readAccountsQuery.error) {
        return <div>Error: {readAccountsQuery.error.message}</div>
    }

    return (
        <div>
            <p>This is about.tsx</p>
            <ul>
                {readAccountsQuery.data?.map(item => (
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
