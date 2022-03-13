import { GetServerSidePropsContext } from "next";
import { axios } from "../../../lib/axios";

const getMe = async (ctx?: GetServerSidePropsContext) => {
  try {
    const { data } = await axios.get("user/me", {
      headers: { Cookie: ctx.req.headers.cookie },
    });
    return data;
  } catch (err) {
    return null;
  }
};

export default getMe;
