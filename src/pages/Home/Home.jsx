import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Banner from "../../components/Banner/Banner";
import Feature from "../../components/Features/Feature";
import Dishes from "../../components/Dishes/Dishes";
import Reviews from "../../components/Reviews/Reviews";

function Home() {
    return (
        <div>
            <Navbar />
            <Banner />
            <Feature />
            <Dishes />
            <Reviews />
            <Footer />
        </div>
    );
}

export default Home;
