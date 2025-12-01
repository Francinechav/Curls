import Collection from "./components/Collection";
import Faq from "./components/Faq";
import Hero from "./components/Hero";
import Ourservices from "./components/Ourservices";

export default function Home(){
    return(
        <>
        <Hero/>
        <Collection/>
        <Ourservices/>
        <Faq/>
        </>
    )
}