// import Header from "./Header";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAxios } from "../api/useAxios";
import { useDispatch } from "react-redux";
import { AppDispatch, store } from "../redux/store";
import { logout } from "../redux/modules/user";
import { useEffect } from "react";
const Layout = () => {
  const user = store.getState().userSlice;
  const axios = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {}, [user]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(`api/user/signout`);
      console.log(response);

      localStorage.removeItem("accessToken");
      dispatch(logout());
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-my-color min-h-screen overflow-x-hidden">
      <div className="h-12 bg-white flex px-24 justify-between items-center sticky w-full left-0 top-0 z-[89] shadow-lg float-start">
        <div>logo</div>
        <div>
          {user.email !== "" ? (
            <div className="flex gap-3">
              <p>{user.name} 님</p>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          ) : (
            <Link to="/signin">로그인</Link>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};
export default Layout;
