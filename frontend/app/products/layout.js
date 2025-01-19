import NavBar from "@/app/front-page/NavBar";

import "./product.css"

const Layout = ({children}) => (
    <div>
        <div style={{height: "10vh"}}></div>
        <div>{children}</div>
    </div>


);
export default Layout;