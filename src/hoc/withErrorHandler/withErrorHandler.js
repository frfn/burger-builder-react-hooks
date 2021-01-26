import React /* useEffect, useState */ from "react";

import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Aux/Aux";
import useHttpErrorHandler from "../../hooks/http-error-handler";

const withErrorHandler = (WrappedComponent, axios) => {
	return (props) => {
		const [error, errorConfirmedHandler] = useHttpErrorHandler(axios);

		console.log(error);

		return (
			<Aux>
				<Modal show={error.error} modalClosed={errorConfirmedHandler}>
					{error.error ? error.error.message : null}
				</Modal>
				<WrappedComponent {...props} />
			</Aux>
		);
	};
};

export default withErrorHandler;
