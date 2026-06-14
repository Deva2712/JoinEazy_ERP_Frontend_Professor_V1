import React from "react";
import PayrollUI from "./PayrollUI";
import usePayroll from "./utility/Usepayroll";

/**
 * Controller component for managing payroll data.
 * Logic is delegated to the usePayroll custom hook.
 */
const PayrollController = () => {
	const { state, actions } = usePayroll();
	return <PayrollUI state={state} actions={actions} />;
};

export default PayrollController;