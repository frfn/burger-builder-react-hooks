import React from "react"; // useEffect, // Component,

/* Using React.memo for shouldComponentUpdate */
// you can add a second argument for .memo!

import classes from "./Modal.css";
import Aux from "../../../hoc/Aux/Aux";
import Backdrop from "../Backdrop/Backdrop";

const Modal = (props) => {
	// useEffect(() => {}, [props.show]); no need to use, use React.memo

	// shouldComponentUpdate ( nextProps, nextState ) {
	//     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
	// }

	return (
		<Aux>
			<Backdrop show={props.show} clicked={props.modalClosed} />
			<div
				className={classes.Modal}
				style={{
					transform: props.show
						? "translateY(0)"
						: "translateY(-100vh)",
					opacity: props.show ? "1" : "0",
				}}
			>
				{props.children}
			</div>
		</Aux>
	);
};

export default React.memo(
	Modal,
	(prevProps, nextProps) =>
		/* if the values are the same, KEEP this file, else rerender */
		nextProps.show === prevProps.show &&
		nextProps.children === prevProps.children
);
