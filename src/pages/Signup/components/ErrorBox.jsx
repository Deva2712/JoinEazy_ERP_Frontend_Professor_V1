// src/pages/Signup/components/ErrorBox.jsx

const ErrorBox = ({ message }) =>
	message ? (
		<div className="bg-red-50 border border-red-200 rounded-xl p-4">
			<p className="text-red-600 text-sm text-center">{message}</p>
		</div>
	) : null;

export default ErrorBox;