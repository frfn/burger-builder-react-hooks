import axios from "axios";

const instance = axios.create({
	baseURL: "https://react-hooks-burger-builder.firebaseio.com/",
});

export default instance;
