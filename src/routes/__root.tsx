import {createRootRoute} from "@tanstack/react-router"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <div>Hello This is __root.tsx</div>
        </>
    )
}
