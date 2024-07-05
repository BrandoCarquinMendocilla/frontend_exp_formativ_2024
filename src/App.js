import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard';
import { Login } from './components/login/Login';
import { Users } from './pages/Users';
import { Products } from './pages/Products';
import { AddUser } from './pages/AddUser';
import { EditUser } from './pages/EditUser';
import axios from 'axios';
import { Prestamista } from './pages/prestamista/PrestamistaList';
import { JefePrestamista } from './pages/jefe_prestamista/JefePrestamista';
import { JefePrestamistaCrear } from './pages/jefe_prestamista/JefePrestamistaCreate';
import { JefePrestamistaEditar } from './pages/jefe_prestamista/JefePrestamistaUpdate';
import { PrestamistaCrear } from './pages/prestamista/PrestamistaCreate';
import { PrestamistaEditar } from './pages/prestamista/PrestamistaUpdate';
import { PrestatarioLista } from './pages/prestatario/PrestatarioList';
import { PrestatarioCrear } from './pages/prestatario/PrestatarioCreate';
import { PrestatarioEditar } from './pages/prestatario/PrestamistaUpdate';
import { ChangePasswordLogin } from './pages/login/ChangePassword.';
import { CreateUserLogin } from './pages/login/CreateUser';
import { PropuestaList } from './pages/propuesta/propuesta';
import { PrestamoPrestatarioListar } from './pages/prestamo/prestamoPrestamista';
import { PrestamoListar } from './pages/prestamo/Prestamo';


axios.defaults.withCredentials = true;
const clientId = '125004556887-l37ga2f4ok8jqbbguneu0kooajoki9dq.apps.googleusercontent.com';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={

            <Login />

          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/edit/:id" element={<EditUser />} />
          <Route path="/users/create" element={<AddUser />} />
          <Route path="/products" element={<Products />} />

          <Route path="/jefes-prestamistas" element={<JefePrestamista />} />
          <Route path="/jefe_prestamistas/add" element={<JefePrestamistaCrear />} />
          <Route path="/jefe_prestamistas/edit/:id" element={<JefePrestamistaEditar />} />

          <Route path="/prestamistas" element={<Prestamista />} />
          <Route path="/prestamistas/add" element={<PrestamistaCrear />} />
          <Route path="/prestamistas/edit/:id" element={<PrestamistaEditar />} />


          <Route path="/prestatarios" element={<PrestatarioLista />} />
          <Route path="/prestatarios/add" element={<PrestatarioCrear />} />
          <Route path="/prestatarios/edit/:id" element={<PrestatarioEditar />} />


          <Route path="/change-password/:correo/:evento" element={<ChangePasswordLogin />} />
          <Route path="/register" element={<CreateUserLogin />} />


          <Route path="/inversionistas" element={<Products />} />


          <Route path="/solicitud-prestamos" element={<PropuestaList />} />
          <Route path="/prestamos-prestatario" element={<PrestamoPrestatarioListar />} />
          <Route path="/prestamos" element={<PrestamoListar />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
