export const authHeader = () => {
  const user = JSON.parse(window.localStorage.getItem("user"));
  if (user && user.token) {
    return { Authorization: "Bearer_" + user.token };
  } else {
    return {};
  }
};
