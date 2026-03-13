import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Products } from './components/sections/Products';
import { About } from './components/sections/About';
import { HowWeWork } from './components/sections/HowWeWork';
import { Gallery } from './components/sections/Gallery';
import { OrderForm } from './components/sections/OrderForm';
import { Reviews } from './components/sections/Reviews';
import { FAQ } from './components/sections/FAQ';
import { Contacts } from './components/sections/Contacts';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <Products />
        <About />
        <HowWeWork />
        <Gallery />
        <OrderForm />
        <Reviews />
        <FAQ />
        <Contacts />
      </main>

      <Footer />
    </div>
  );
}

export default App;
