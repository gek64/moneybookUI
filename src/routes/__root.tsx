import {createRootRoute, Link, Outlet} from "@tanstack/react-router"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <h1>App works!</h1>
            <ul>
                <li>
                    <Link to="/" activeProps={{style: {fontWeight: "bold"}}}>/</Link>
                </li>
                <li>
                    <Link to="/about" activeProps={{style: {fontWeight: "bold"}}}>/about</Link>
                </li>
                <li>
                    <Link to="/user" search={{id: 0}} activeProps={{style: {fontWeight: "bold"}}}>/user?id=0</Link>
                </li>
                <li>
                    <Link to="/user/$id" params={{id: "a"}} activeProps={{style: {fontWeight: "bold"}}}>/user/a</Link>
                </li>
            </ul>
            <Outlet/>
        </>
    )
}
