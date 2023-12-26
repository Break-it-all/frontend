import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { UserState, login, logout } from "../../redux/modules/user";
import { userFindRequest } from "../../types/userType";
import { FcHome } from "react-icons/fc";
import FormInput from "../../components/auth/FormInput";
import { useAxios } from "../../api/useAxios";

const Login = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorData, setErrorData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");

    try {
      const request: userFindRequest = {
        email: email,
        password: password,
      };

      const response = await axios.post(`/api/user/signin`, request, {
        headers: {},
      });

      if (response.data.message !== null) {
        setErrorMessage(response.data.message);
      } else {
        if (response.data.code !== 2000) {
          setErrorData(response.data.data);
        } else {
          console.log(response.data.data.accessToken);
          const { accessToken } = response.data.data.accessToken;

          localStorage.setItem("accessToken", response.data.data.accessToken);

          console.log("set default header : ", response.data.data.accessToken);
          const user: UserState = {
            id: response.data.data.id,
            email: response.data.data.email,
            name: response.data.data.name,
          };

          dispatch(login(user));

          setEmail("");
          setPassword("");

          navigate("/");
        }
      }

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="h-[750px] max-w-5xl flex justify-center items-center px-20 p-20 m-auto">
        <div className="h-full w-full bg-blue-500  p-auto">
          {/* <div className="h-full w-full bg-gradient-to-r from-cyan-400 to-blue-500 p-auto"> */}
          <div className="h-full flex flex-col justify-center items-center gap-3 text-white p-3">
            <h3 className="text-4xl font-extrabold">BITA IDE</h3>
            <p>BITA IDE 서비스 이용을 위해 로그인 해주세요.</p>
            <FcHome className="size-36" />
          </div>
        </div>
        <div className="bg-white h-full w-full flex flex-col justify-center p-16 shadow-lg">
          <h3 className="font-bold text-3xl py-2">로그인</h3>
          <div className="flex flex-col gap-4 py-4">
            <FormInput
              value={email}
              setValue={setEmail}
              type="email"
              name="이메일"
            />

            <FormInput
              value={password}
              setValue={setPassword}
              type="password"
              name="비밀번호"
            />
            <div className="h-[1em] text-red-600 text-center">
              {errorMessage}
            </div>
            <button
              className="bg-blue-500 text-white p-2 mb-4 mt-2"
              onClick={handleSignIn}
            >
              로그인
            </button>
          </div>
          <div className="flex ml-auto">
            <Link to="/signup" className="text-blue-500">
              회원가입
            </Link>
            <span className="mx-2 text-blue-500">|</span>
            <Link to="/reset-password" className="text-blue-500">
              비밀번호 재설정
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
