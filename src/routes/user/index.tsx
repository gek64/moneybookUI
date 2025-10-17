import {createFileRoute} from "@tanstack/react-router"

type UserSearch = {
    id: string | number
}

export const Route = createFileRoute("/user/")({
    validateSearch: (search: UserSearch) => {
        return {
            id: Number(search?.id) || (search.id as string)
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = Route.useSearch()
    return (
        <div>
            <p>This is user/index.tsx</p>
            <p>the user id is <b style={{fontWeight: "bold"}}>{id}</b></p>
            <p>the type of id is <b style={{fontWeight: "bold"}}>{typeof id}</b></p>
        </div>
    )
}

