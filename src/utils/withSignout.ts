import Cookies from "js-cookie";

export const withSignout = ({ fn }: { fn: () => void }) => {
  Cookies.remove("isAdmin");
  fn();
};
