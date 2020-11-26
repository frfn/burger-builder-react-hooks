import React, {
	// Component,
	useState,
} from "react";
import { connect } from "react-redux";

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";
import { updateObject, checkValidity } from "../../../shared/utility";

const ContactData = (props) => {
	const [state, setState] = useState({
		orderForm: {
			name: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Your Name",
				},
				value: "",
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			street: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Street",
				},
				value: "",
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			zipCode: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "ZIP Code",
				},
				value: "",
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5,
					isNumeric: true,
				},
				valid: false,
				touched: false,
			},
			country: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Country",
				},
				value: "",
				validation: {
					required: true,
				},
				valid: false,
				touched: false,
			},
			email: {
				elementType: "input",
				elementConfig: {
					type: "email",
					placeholder: "Your E-Mail",
				},
				value: "",
				validation: {
					required: true,
					isEmail: true,
				},
				valid: false,
				touched: false,
			},
			deliveryMethod: {
				elementType: "select",
				elementConfig: {
					options: [
						{ value: "fastest", displayValue: "Fastest" },
						{ value: "cheapest", displayValue: "Cheapest" },
					],
				},
				value: "fastest",
				validation: {},
				valid: true,
			},
		},
		formIsValid: false,
	});

	const orderHandler = (event) => {
		event.preventDefault();

		const formData = {};
		for (let formElementIdentifier in state.orderForm) {
			formData[formElementIdentifier] =
				state.orderForm[formElementIdentifier].value;
		}
		const order = {
			ingredients: props.ings,
			price: props.price,
			orderData: formData,
			userId: props.userId,
		};

		props.onOrderBurger(order, props.token);
	};

	const inputChangedHandler = (event, inputIdentifier) => {
		const updatedFormElement = updateObject(
			state.orderForm[inputIdentifier],
			{
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					state.orderForm[inputIdentifier].validation
				),
				touched: true,
			}
		);
		const updatedOrderForm = updateObject(state.orderForm, {
			[inputIdentifier]: updatedFormElement,
		});

		let formIsValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid =
				updatedOrderForm[inputIdentifier].valid && formIsValid;
		}
		setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
	};

	const formElementsArray = [];
	for (let key in state.orderForm) {
		formElementsArray.push({
			id: key,
			config: state.orderForm[key],
		});
	}
	let form = (
		<form onSubmit={orderHandler}>
			{formElementsArray.map((formElement) => (
				<Input
					key={formElement.id}
					elementType={formElement.config.elementType}
					elementConfig={formElement.config.elementConfig}
					value={formElement.config.value}
					invalid={!formElement.config.valid}
					shouldValidate={formElement.config.validation}
					touched={formElement.config.touched}
					changed={(event) =>
						inputChangedHandler(event, formElement.id)
					}
				/>
			))}
			<Button btnType="Success" disabled={!state.formIsValid}>
				ORDER
			</Button>
		</form>
	);
	if (props.loading) {
		form = <Spinner />;
	}
	return (
		<div className={classes.ContactData}>
			<h4>Enter your Contact Data</h4>
			{form}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(actions.purchaseBurger(orderData, token)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios));
