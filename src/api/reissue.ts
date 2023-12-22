import { AxiosInstance } from "axios";
import React from "react";

export default async function reissueToken(axios: AxiosInstance) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/user/reissue-token`
    );
    console.log(response);
  } catch {}
}
