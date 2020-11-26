import React, {
	// Component,
	useEffect,
	useState,
} from "react";
import { connect } from "react-redux";

import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import axios from "../../axios-orders";

const BurgerBuilder = (props) => {
	// constructor(props) {
	//     super(props);
	//     state = {...}
	// }
	const [state, setState] = useState({
		purchasing: false,
	});

	const { onInitIngredients } = props;

	useEffect(() => {
		props.onInitIngredients();
	}, [onInitIngredients]);

	const updatePurchaseState = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((igKey) => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);
		return sum > 0;
	};

	const purchaseHandler = () => {
		if (props.isAuthenticated) {
			setState({ purchasing: true });
		} else {
			props.onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelHandler = () => {
		setState({ purchasing: false });
	};

	const purchaseContinueHandler = () => {
		props.onInitPurchase();
		props.history.push("/checkout");
	};

	const disabledInfo = {
		...props.ings,
	};
	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}
	let orderSummary = null;
	let burger = props.error ? (
		<p>Ingredients can't be loaded!</p>
	) : (
		<Spinner />
	);

	if (props.ings) {
		burger = (
			<Aux>
				<Burger ingredients={props.ings} />
				<BuildControls
					ingredientAdded={props.onIngredientAdded}
					ingredientRemoved={props.onIngredientRemoved}
					disabled={disabledInfo}
					purchasable={updatePurchaseState(props.ings)}
					ordered={purchaseHandler}
					isAuth={props.isAuthenticated}
					price={props.price}
				/>
			</Aux>
		);
		orderSummary = (
			<OrderSummary
				ingredients={props.ings}
				price={props.price}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
			/>
		);
	}
	// {salad: true, meat: false, ...}
	return (
		<Aux>
			<Modal show={state.purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Aux>
	);
};

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientAdded: (ingName) =>
			dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: (ingName) =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: (path) =>
			dispatch(actions.setAuthRedirectPath(path)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
