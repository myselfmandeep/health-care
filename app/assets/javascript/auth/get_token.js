
class Auth {
  static removeToken() {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("role")
  };
};

async function getToken() {
  // if (!(localStorage.token && localStorage.user_id)) { return };
  const request = await fetch("/api/v1/get_authentication_token");
  const data    = await request.json();
  console.log(data);
  if (request.ok) {
    localStorage.setItem("token", data.token)
    localStorage.setItem("user_id", data.user_id)
    localStorage.setItem("role", data.role)
  } else {
    Auth.removeToken();
    console.log("Something went wrong");
  };
};

// Auth.removeToken();

export default getToken