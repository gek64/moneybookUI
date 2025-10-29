import {createRootRoute, Link, Outlet, useLocation} from "@tanstack/react-router"
import {Affix, Layout, Menu} from "antd"
import {HomeOutlined, SearchOutlined, TableOutlined} from "@ant-design/icons"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    const location = useLocation()
    const menuItems = [
        {
            key: "/",
            icon: <HomeOutlined/>,
            label: <Link to="/">主页</Link>,
        },
        {
            key: "sub1",
            icon: <TableOutlined/>,
            label: "表单",
            children: [
                {key: "/transaction", label: <Link to="/transaction">交易</Link>},
                {key: "/product", label: <Link to="/product">商品</Link>},
                {key: "/account", label: <Link to="/account">账户</Link>},
                {key: "/type", label: <Link to="/type">类型</Link>}
            ]
        },
        {
            key: "sub2",
            icon: <SearchOutlined/>,
            label: "查询",
            children: [
                {key: "/transaction-search", label: <Link to="/transaction-search">交易查询</Link>}
            ]
        }
    ]

    return (
        <>
            <Layout style={{minHeight: "98vh"}}>
                <Layout.Sider collapsible={true} theme="light">
                    <Affix>
                        <Menu defaultOpenKeys={["sub1", "sub2"]} mode="inline" items={menuItems} selectedKeys={[location.pathname]}></Menu>
                    </Affix>
                </Layout.Sider>
                <Layout.Content>
                    <Outlet/>
                </Layout.Content>
            </Layout>
        </>
    )
}
