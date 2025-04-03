import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import Header from './components/Header';
import Footer from './components/Footer';

interface RouteConfig {
  path: string;
  component: React.ComponentType;
}

function App(): React.ReactElement {
  return (
    <Router>
      <Header />
      <Routes>
        {routes.map(({ path, component: Component }: RouteConfig, index: number) => (
          <Route key={index} path={path} element={<Component />} />
        ))}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
