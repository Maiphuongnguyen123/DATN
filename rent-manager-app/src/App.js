import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./page/user/Main";
import DashboardAdmin from "./page/admin/DashboardAdmin";
import RentalHome from "./page/user/RentalHome";
import RentailHomeDetail from "./page/user/RentailHomeDetail";
import About from "./page/user/About";
import Blog from "./page/user/Blog";
import BlogDetail1 from "./page/user/BlogDetail1";
import Login from "./page/login/Login";
import { useState } from "react";
import { getCurrentAdmin, getCurrentlandlord, getCurrentUser } from "./services/fetch/ApiUtils";
import { ACCESS_TOKEN } from "./constants/Connect";
import LoadingIndicator from "./common/LoadingIndicator";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./page/signup/Signup";
import OAuth2RedirectHandler from './oauth2/OAuth2RedirectHandler';
import NotFound from './common/NotFound';
import Dashboardlandlord from './page/landlord/Dashboardlandlord';
import Loginlandlord from './page/login/Loginlandlord';
import LoginAdmin from './page/login/LoginAdmin';
import Signuplandlord from './page/signup/Signuplandlord';
import ForgotPassword from './common/ForgotPassword';
import ResetPassword from './common/ResetPassword';
import SuccessConfirmed from './common/SuccessConfirmed';
import AddRoom from './page/landlord/AddRoom';
import RoomManagement from './page/landlord/RoomManagement';
import EditRoom from './page/landlord/EditRoom';
import Profile from './page/user/Profile';
import Message from './page/messages/pages/Home'
import ContractManagement from './page/landlord/ContractManagement';
import AddContract from './page/landlord/AddContract';
import EditContract from './page/landlord/EditContract';
import MaintenceManagement from './page/landlord/MaintenceManagement';
import AddMaintence from './page/landlord/AddMaintence';
import EditMaintenance from './page/landlord/EditMaintence';
import RequierManagement from './page/landlord/RequierManagement';
import ExportBillRequier from './page/landlord/ExportBillRequier';
import ExportCheckoutRoom from './page/landlord/ExportCheckoutRoom';
import Profilelandlord from './page/landlord/Profilelandlord';
import ChangePassword from './page/landlord/ChangePassword'; 
import RoomManagementAdmin from './page/admin/RoomManagerment';
import AccountManagement from './page/admin/AccountManagement';
import SendEmail from './page/admin/SendEmail';
import Chat from './page/landlord/Chat';
import Authorization from './page/admin/Authorization';
import ChangePasswordOfUser from './page/user/ChangePassword';
import RoomHired from './page/user/RoomHired';
import AgentsGird from './page/user/AgentsGird';
import AgentSingle from './page/user/AgentSingle';
import SendRequest from './page/user/SendRequest';
import RequestManagement from './page/user/RequestManagement';
import Follow from './page/user/Follow';
import SaveBlog from './page/user/SaveBlog';
import ChatOfUser from './page/user/ChatOfUser';
import ElectricAndWaterManagement from './page/landlord/ElectricAndWaterManagement';
import AddElectricAndWater from './page/landlord/AddElectricAndWater';
import EditElectricAndWater from './page/landlord/EditElectricAndWater';
import RentManagement from './page/landlord/RentManagement';
import RentManagement_Dashboard from './page/landlord/RentManagement_Dashboard';
import EditRentManagement from './page/landlord/EditRentManagement';



function App() {

  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCurrentlyLoggedInUser = () => {
    getCurrentUser()
      .then(response => {
        setCurrentUser(response);
        setUsername(response.name);
        setRole(response.roles[0].name);
        setAuthenticated(true);
        setLoading(false);
        console.log(response)
        console.log({ authenticated, username, currentUser, role, loading });
      }).catch(error => {
        setLoading(false);
      });
  }

  const loadCurrentlyLoggedInLanlord = () => {
    getCurrentlandlord()
      .then(response => {
        setCurrentUser(response);
        setUsername(response.name);
        setRole(response.roles[0].name);
        setAuthenticated(true);
        setLoading(false);
        console.log({ authenticated, username, currentUser, role, loading });
      }).catch(error => {
        setLoading(false);
      });
  }

  const loadCurrentlyLoggedInAdmin = () => {
    getCurrentAdmin()
      .then(response => {
        setCurrentUser(response);
        setUsername(response.name);
        setRole(response.roles[0].name);
        setAuthenticated(true);
        setLoading(false);
        console.log({ authenticated, username, currentUser, role, loading });
      }).catch(error => {
        setLoading(false);
      });
  }

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthenticated(false);
    setCurrentUser(null);
    toast.success("Bạn đăng xuất thành công!!!");
  }

  const exitLogoutChangePassword = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    setAuthenticated(false);
    setCurrentUser(null);
  }

  useEffect(() => {
    loadCurrentlyLoggedInUser();
    loadCurrentlyLoggedInLanlord();
    loadCurrentlyLoggedInAdmin();
  }, []);

  if (loading) {
    return <LoadingIndicator />
  }

  console.log({ authenticated, username, currentUser, role, loading });
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Main authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/rental-home" element={<RentalHome authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/rental-home/:id" element={<RentailHomeDetail authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/landlord-grid" element={<AgentsGird authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/angent-single/:id" element={<AgentSingle authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/send-request/:id" element={<SendRequest authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/request-status" element={<RequestManagement authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/follow-agents" element={<Follow authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/save-blog" element={<SaveBlog authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/about-us" element={<About authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/blog" element={<Blog authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/blog/1" element={<BlogDetail1 authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/forgot-password" element={<ForgotPassword authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/message" element={<ChatOfUser authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/room-hired" element={<RoomHired authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/reset-password/:email" element={<ResetPassword />} />
          <Route exact path="/success-comfirmed/:email" element={<SuccessConfirmed />} />
          <Route exact path="/profile" element={<Profile authenticated={authenticated} loadCurrentUser={loadCurrentlyLoggedInUser} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/change-password" element={<ChangePasswordOfUser authenticated={authenticated} currentUser={currentUser} onLogout={handleLogout} />} />
          <Route exact path="/login" element={<Login authenticated={authenticated} />} />
          <Route exact path="/login-landlord" element={<Loginlandlord authenticated={authenticated} currentUser={currentUser} role={role} />} />
          <Route exact path="/login-admin" element={<LoginAdmin authenticated={authenticated} currentUser={currentUser} role={role} />} />
          <Route exact path="/signup" element={<Signup authenticated={authenticated} currentUser={currentUser} role={role} />} />
          <Route exact path="/signup-landlord" element={<Signuplandlord authenticated={authenticated} />} />
          {/* ADMIN */}
          <Route exact path="/admin" element={<DashboardAdmin authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/admin/room-management" element={<RoomManagementAdmin authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/admin/authorization/:userId" element={<Authorization authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/admin/account-management" element={<AccountManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/admin/send-email/:id" element={<SendEmail authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          {/* landlord */}
          <Route exact path="/landlord/change-password" element={<ChangePassword authenticated={authenticated} exit={exitLogoutChangePassword} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/profile" element={<Profilelandlord authenticated={authenticated} currentUser={currentUser} role={role} loadCurrentUser={loadCurrentlyLoggedInLanlord} onLogout={handleLogout} />} />
          <Route exact path="/landlord/dashboard" element={<Dashboardlandlord authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/chat" element={<Chat authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/add-room" element={<AddRoom authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/edit-room/:id" element={<EditRoom authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/add-contract" element={<AddContract authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/electric_water/add" element={<RentManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/edit-contract/:id" element={<EditContract authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/add-maintenance" element={<AddMaintence authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/edit-maintenance/:id" element={<EditMaintenance authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/contract-management" element={<ContractManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/room-management" element={<RoomManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/maintenance-management" element={<MaintenceManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/request-management" element={<RequierManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/export-bill/:id" element={<ExportBillRequier authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/export-contract/:id" element={<ExportCheckoutRoom authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/electric_water-management" element={<ElectricAndWaterManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/electric_water/edit/:id" element={<EditElectricAndWater authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/rent-management" element={<RentManagement_Dashboard authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/rent-management/edit/:id" element={<EditRentManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route exact path="/landlord/electric_water/add" element={<RentManagement authenticated={authenticated} currentUser={currentUser} role={role} onLogout={handleLogout} />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        </Routes>
        <Routes>
          <Route path="*" exact={true} component={NotFound} />
        </Routes>
      </Router>


      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>

  );
}

export default App;
