import React, {
	// Component,
	useEffect,
	useState,
} from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import { updateObject, checkValidity } from "../../shared/utility";

const Auth = (props) => {
	const [state, setState] = useState({
		controls: {
			email: {
				elementType: "input",
				elementConfig: {
					type: "email",
					placeholder: "Mail Address",
				},
				value: "",
				validation: {
					required: true,
					isEmail: true,
				},
				valid: false,
				touched: false,
			},
			password: {
				elementType: "input",
				elementConfig: {
					type: "password",
					placeholder: "Password",
				},
				value: "",
				validation: {
					required: true,
					minLength: 6,
				},
				valid: false,
				touched: false,
			},
		},
		isSignup: true,
	});

	useEffect(() => {
		if (!props.buildingBurger && props.authRedirectPath !== "/") {
			props.onSetAuthRedirectPath();
		}
	}, []);

	const inputChangedHandler = (event, controlName) => {
		const updatedControls = updateObject(state.controls, {
			[controlName]: updateObject(state.controls[controlName], {
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					state.controls[controlName].validation
				),
				touched: true,
			}),
		});
		setState({ controls: updatedControls });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		props.onAuth(
			state.controls.email.value,
			state.controls.password.value,
			state.isSignup
		);
	};

	const switchAuthModeHandler = () => {
		setState((prevState) => {
			return { ...prevState, isSignup: !prevState.isSignup };
		});
	};

	const formElementsArray = [];
	for (let key in state.controls) {
		formElementsArray.push({
			id: key,
			config: state.controls[key],
		});
	}

	let form = formElementsArray.map((formElement) => (
		<Input
			key={formElement.id}
			elementType={formElement.config.elementType}
			elementConfig={formElement.config.elementConfig}
			value={formElement.config.value}
			invalid={!formElement.config.valid}
			shouldValidate={formElement.config.validation}
			touched={formElement.config.touched}
			changed={(event) => inputChangedHandler(event, formElement.id)}
		/>
	));

	if (props.loading) {
		form = <Spinner />;
	}

	let errorMessage = null;

	if (props.error) {
		errorMessage = <p>{props.error}</p>;
	}

	let authRedirect = null;
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirectPath} />;
	}

	return (
		<div className={classes.Auth}>
			{authRedirect}
			{errorMessage}
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType="Success">SUBMIT</Button>
			</form>
			<Button clicked={switchAuthModeHandler} btnType="Danger">
				SWITCH TO {state.isSignup ? "SIGNIN" : "SIGNUP"}
			</Button>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignup) =>
			dispatch(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
