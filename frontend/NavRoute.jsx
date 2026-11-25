import { Route, Routes } from "react-router-dom";
import ReadAll from "./src/component/ReadAll.jsx";
import CreateForm from "./src/component/CreateForm.jsx";
import UpdateForm from "./src/component/UpdateForm.jsx";
import LoginForm from "./src/component/LoginForm.jsx";
import MyLibrary from "./src/component/MyLibrary.jsx";

const NavRoute = ({ user, setUser }) => {
  return (
    <Routes>
      <Route path="/" element={<ReadAll user={user} />}></Route>
      <Route path="/create" element={<CreateForm />}></Route>
      <Route path="/update/:id" element={<UpdateForm />}></Route>
      <Route path="/login" element={<LoginForm user={user} setUser={setUser} />}></Route>
      <Route path="/mylibrary" element={<MyLibrary user={user} />}></Route>
      <Route path="*" element={<p className="not-found">Page not found.</p>}></Route>
    </Routes>
  );
};

export default NavRoute;
