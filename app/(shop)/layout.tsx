import Header from "@/shared/components/Header";
import Footer from "@/shared/components/Footer";

export default function MainPage([children]: [children: React.ReactNode]): React.JSX.Element {
return (
    <main>
        <Header />
        {children}
        <Footer />
    </main>
    )
}