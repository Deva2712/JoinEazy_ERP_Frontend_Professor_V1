// src/pages/Placement/usePlacementApply.js
import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const DEFAULT_JOB = {
	role: "Position", company: "Company", location: "—",
	type: "Full Time", deadline: new Date().toISOString(),
	stipend: null, package: "—", description: "", requirements: [],
};

const INITIAL_FORM = {
	fullName: "", email: "", phone: "", rollNumber: "",
	branch: "", year: "", cgpa: "",
	whyCompany: "", strengths: "", experience: "", availability: "",
	linkedIn: "", portfolio: "", coverLetter: "",
	resumeFile: null,
};

export function usePlacementApply({ onSubmitApplication }) {
	const navigate     = useNavigate();
	const location     = useLocation();
	const { jobId }    = useParams();

	const job = location.state?.job ?? { id: jobId, ...DEFAULT_JOB };

	const [submitted, setSubmitted] = useState(false);
	const [errors, setErrors]       = useState({});
	const [form, setForm]           = useState(INITIAL_FORM);

	const set = (k, v) => {
		setForm((p) => ({ ...p, [k]: v }));
		setErrors((p) => ({ ...p, [k]: "" }));
	};

	const validate = () => {
		const e = {};
		["fullName", "email", "phone", "rollNumber", "branch", "cgpa", "whyCompany", "coverLetter"]
			.forEach((k) => { if (!form[k]) e[k] = "Required"; });
		return e;
	};

	const handleSubmit = () => {
		const e = validate();
		if (Object.keys(e).length) {
			setErrors(e);
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}
		onSubmitApplication({ jobId: job.id, ...form });
		setSubmitted(true);
	};

	return { job, form, set, errors, submitted, navigate, handleSubmit };
}