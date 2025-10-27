import {createFileRoute} from "@tanstack/react-router"
import {Flex} from "antd"

export const Route = createFileRoute("/")({
    component: RouteComponent,
})

function RouteComponent() {
    return <>
        <Flex justify="space-between" vertical={true}>
            <Flex></Flex>
            <Flex align="center" vertical={true}>
                <img alt="" height="250" src="../assets/favicon.svg"/>
                <h1>MoneyBook</h1>
                <p>使用简便、安全可靠的记账查询工具</p>
                <a href="https://github.com/gek64/moneybookUI">©gek64 2025</a>
            </Flex>
        </Flex>
    </>
}
