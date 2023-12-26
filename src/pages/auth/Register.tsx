import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/auth/FormInput";
import { userSaveRequest } from "../../types/userType";
import { FcCollaboration } from "react-icons/fc";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "../../api/useAxios";
import { AppDispatch } from "../../redux/store";
import { logout } from "../../redux/modules/user";

const Register = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errorData, setErrorData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const [authId, setAuthId] = useState<number>();
  const [state, setState] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {}, [done]);

  const handleSendEmailAuth = async () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");

    try {
      setIsLoading(true);
      const response = await axios.post(
        `/api/email-auth`,
        {
          email,
        },
        {
          headers: {},
        }
      );
      console.log(response);
      if (response.data.message !== null) {
        setErrorMessage(response.data.message);
      } else {
        setState("SENT");
        setAuthId(response.data.data.auth_id);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckEmailAuth = async () => {
    try {
      console.log(email, authId);
      const request = {
        email: email,
        authId: authId,
      };
      const response = await axios.post(`api/email-auth/check`, request, {
        headers: {},
      });

      if (response.data.message !== null) {
        setErrorMessage(response.data.message);
      } else {
        if (response.data.code !== 2000) {
          setErrorData(response.data.data);
        } else {
          if (response.data.data.emailVerified) {
            setState("CHECKED");
          } else {
            setState("YET CHECKED");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = async () => {
    try {
      const request: userSaveRequest = {
        email: email,
        name: name,
        password: password,
        authId: authId || 0,
      };

      const response = await axios.post(`/api/user/signup`, request, {
        headers: {},
      });

      if (response.data.message !== null) {
        setErrorMessage(response.data.message);
      } else {
        if (response.data.code !== 2000) {
          setErrorData(response.data.data);
        } else {
          setEmail("");
          setName("");
          setPassword("");
          setPasswordConfirm("");
          setDone(true);
        }
      }

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="h-full max-w-2xl flex justify-center items-center flex-col px-20 p-20 m-auto">
        {}
        {done ? (
          <div className="bg-white h-full w-full flex flex-col justify-center p-16 shadow-lg text-center gap-10">
            <h2 className="font-bold text-3xl py-2">
              🎉 회원가입이 완료되었습니다!
            </h2>
            <div className="min-h-[300px] bg-gradient-to-r from-cyan-400 to-blue-500 flex flex-col items-center justify-center gap-4">
              <div>
                <p className="text-white font-medium">
                  BITA IDE에서 즐거운 코딩을 즐겨보세요
                </p>
                <button
                  className="text-lg font-bold bg-amber-300 text-blue-500 px-4 mt-2 rounded-lg"
                  onClick={() => navigate("/signin")}
                >
                  시작하기
                </button>
              </div>
              <div className="bg-gradient-to-r from-cyan-300 to-blue-300 rounded-[50%] shadow-lg">
                <FcCollaboration className="size-40 p-4" />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white h-full w-full flex flex-col justify-center p-16 shadow-lg">
            <h3 className="font-bold text-3xl py-2">회원가입</h3>
            <div className="flex flex-col gap-4 py-4">
              <div>
                <div className="flex-grow flex gap-3">
                  <FormInput
                    value={email}
                    setValue={setEmail}
                    type="email"
                    name="이메일"
                  />
                  {state === "" ? (
                    <button
                      className="bg-blue-500 text-white w-[5em] flex justify-center items-center"
                      onClick={handleSendEmailAuth}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        "인증"
                      )}
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 text-white w-[5em]"
                      onClick={handleCheckEmailAuth}
                    >
                      확인
                    </button>
                  )}
                </div>
                {state !== "" && (
                  <div className="absolute flex text-[12px] ml-2">
                    {state !== "" && state === "SENT" ? (
                      <p className="text-blue-600">
                        인증 메일이 발송되었습니다.
                      </p>
                    ) : state === "YET CHECKED" ? (
                      <p className="text-blue-600">
                        인증이 완료되지 않았습니다.
                      </p>
                    ) : (
                      <p className="text-blue-600">
                        메일 인증이 완료되었습니다.
                      </p>
                    )}
                    <div className="flex gap-2"></div>
                  </div>
                )}
              </div>

              <FormInput
                value={name}
                setValue={setName}
                type="text"
                name="이름"
              />

              <FormInput
                value={password}
                setValue={setPassword}
                type="password"
                name="비밀번호"
              />

              <FormInput
                value={passwordConfirm}
                setValue={setPasswordConfirm}
                type="password"
                name="비밀번호 확인"
              />

              <div className="h-[1em] text-red-600 text-center text-sm">
                {errorMessage}
              </div>

              <button
                className="bg-blue-500 text-white p-2 mb-4 mt-2"
                onClick={handleSignUp}
              >
                로그인
              </button>
            </div>
            <div className="flex justify-center">
              <p className="mr-3">이미 회원이신가요?</p>
              <Link to="/signin" className="text-blue-500">
                로그인
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Register;
