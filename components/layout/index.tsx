import NavBar from "../NavBar";

const Layout = ({ children }) => {

    return (<>
        <NavBar/>
        <main className={"m-4"}>{children}</main>
    </>)

}

export default Layout