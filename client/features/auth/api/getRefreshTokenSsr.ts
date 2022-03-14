import { GetServerSidePropsContext } from "next";
import { AxiosAuthRefreshRequestConfig } from "axios-auth-refresh";
import { axios } from "../../../lib/axios";

const getRefreshTokenSsr = async (ctx: GetServerSidePropsContext) => {
  const axiosConfig: AxiosAuthRefreshRequestConfig = {
    headers: { Cookie: ctx.req.headers.cookie },
    skipAuthRefresh: true,
  };

  const { headers } = await axios.get("auth/refresh", axiosConfig);

  ctx.res.setHeader("set-cookie", headers["set-cookie"]);
};

export default getRefreshTokenSsr;
