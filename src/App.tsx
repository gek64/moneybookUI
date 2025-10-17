import "./App.css"
import {createRouter} from "@tanstack/react-router"
import {routeTree} from "./routeTree.gen.ts"

const router = createRouter({routeTree})

function App() {
    return (
        <>
            hello world!
        </>
    )
}

export default App
