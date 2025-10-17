import {createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute("/user/$id")({
    component: RouteComponent,
})

function RouteComponent() {
    const {id} = Route.useParams()
    return (
        <div>
            <p>This is user/$id.tsx</p>
            <p>the user id is <b style={{fontWeight: "bold"}}>{id}</b></p>
            <p>the type of id is <b style={{fontWeight: "bold"}}>{typeof id}</b></p>
        </div>
    )
}
