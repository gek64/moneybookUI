import {createFileRoute} from "@tanstack/react-router"
import {Flex} from "antd"

export const Route = createFileRoute("/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <>
        <Flex align="center" justify="space-between" vertical={true} style={{minHeight: "98vh"}}>
            <Flex align="flex-start"> </Flex>

            <Flex align="center" vertical={true}>
                <img alt="" style={{height: "auto", maxWidth: 350, width: "100%"}} src="/favicon.svg"/>
                <h1>MoneyBook</h1>
                <p>使用简便、安全可靠的记账查询工具</p>
            </Flex>

            <Flex align="flex-end">
                <a href="https://github.com/gek64/moneybookUI" style={{color: "inherit"}}>©gek64</a>
            </Flex>
        </Flex>
    </>
}
