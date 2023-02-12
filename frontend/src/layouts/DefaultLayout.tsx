import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function DefaultLayout() {
    return (
        <div id="main-wrapper">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}