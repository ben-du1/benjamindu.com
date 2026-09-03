import {Routes, Route} from 'react-router'
import Home from './pages/Home';
import Nav from './components/Nav';
import Post from './pages/Post';
import Console from './pages/Console';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Nav />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/p/:postSlug" element={<Post />} />
        <Route path="/console" element={<Console />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
