import React from "react";
import HeaderController    from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../components/layout/Footer/FooterController";
import { SuccessScreen, JobBanner, ApplyForm } from "./components/PlacementApplySections";
import { usePlacementApply } from "./shared/Useplacementapply";

export default function PlacementApplyUI({ onSubmitApplication = () => {} }) {
	const { job, form, set, errors, submitted, navigate, handleSubmit } =
		usePlacementApply({ onSubmitApplication });

	if (submitted) return <SuccessScreen job={job} navigate={navigate} />;

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
			<HeaderController />

			<JobBanner job={job} navigate={navigate} />

			<main className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-12 w-full">
				{Object.keys(errors).length > 0 && (
					<div className="mb-6 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm font-semibold">
						Please fill in all required fields before submitting.
					</div>
				)}
				<ApplyForm
					job={job}
					form={form}
					set={set}
					errors={errors}
					handleSubmit={handleSubmit}
					navigate={navigate}
				/>
			</main>

			<BottomNavController />
			<FooterController />
		</div>
	);
}