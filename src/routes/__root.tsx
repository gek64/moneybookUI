import {createRootRoute, Link, Outlet} from "@tanstack/react-router"
import {Layout, Menu} from "antd"
import {Content} from "antd/es/layout/layout"
import {HomeOutlined, SearchOutlined, TableOutlined} from "@ant-design/icons"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <>
            <Layout style={{minHeight: "98vh"}}>
                <Layout.Sider breakpoint="lg" collapsedWidth={0} collapsible={true} theme="light">
                    <Menu mode="inline">
                        <Menu.Item icon=<HomeOutlined/>>
                            <Link to="/">主页</Link>
                        </Menu.Item>
                        <Menu.SubMenu icon=<TableOutlined/> title="表单">
                            <Menu.Item>
                                <Link to="/transaction">交易</Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/product">商品</Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/account">账户</Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/type">类型</Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                        <Menu.SubMenu icon=<SearchOutlined/> title="查询">
                            <Menu.Item>
                                <Link to="/transaction-search">交易查询</Link>
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Layout.Sider>
                <Content>
                    <Outlet/>
                </Content>
            </Layout>
        </>
    )
}
