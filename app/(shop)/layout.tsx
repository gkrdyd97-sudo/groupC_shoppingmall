import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';

export default function MainPage({children}: {
    children: React.ReactNode;
}): React.JSX.Element {

    return (
        <main>
            <Header />
            {children}
            <Footer />
        </main>
    );
}
