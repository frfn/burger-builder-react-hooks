import { useState, useEffect } from "react";

const httpClient = (axios) => {
	const [state, setState] = useState({
		error: null,
	});

	const reqInterceptor = axios.interceptors.request.use((req) => {
		setState({ error: null });
		return req;
	});

	const resInterceptor = axios.interceptors.response.use(
		(res) => res,
		(error) => {
			setState({ error: error, test: "test" });
		}
	);
	useEffect(() => {
		return () => {
			axios.interceptors.request.eject(reqInterceptor);
			axios.interceptors.response.eject(resInterceptor);
		};
	}, [reqInterceptor, resInterceptor]);

	const errorConfirmedHandler = () => {
		setState({ error: null });
	};

	console.log(state);
	return [state, errorConfirmedHandler];
};

export default httpClient;
