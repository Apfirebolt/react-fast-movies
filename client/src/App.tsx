import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from './routes';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './screens/Dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';


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
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
        style={{ zIndex: 9999 }}
      />
    </Router>
  );
}

export default App;
