// src/pages/Signup/components/VerificationForm.jsx

import { Loader2, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ErrorBox from "./ErrorBox";

const VerificationForm = ({ verificationForm, onVerify, confirmError, onResendCode, onBackClick, isConfirming }) => (
	<Form {...verificationForm}>
		<form onSubmit={verificationForm.handleSubmit(onVerify)} className="space-y-6">
			<FormField control={verificationForm.control} name="verificationCode" render={({ field }) => (
				<FormItem>
					<FormLabel className="text-slate-700 font-semibold text-sm">Verification Code</FormLabel>
					<FormControl>
						<div className="relative group">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
							<input type="text" placeholder="Enter 4-digit code" value={verificationForm.watch("verificationCode") || ""}
								className="pl-12 pr-4 h-12 bg-slate-50/50 border border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400 w-full text-center text-lg font-mono tracking-widest"
								onChange={(e) => verificationForm.setValue("verificationCode", e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
								autoComplete="off" maxLength={4} />
						</div>
					</FormControl>
					<FormMessage className="text-red-500 text-sm" />
				</FormItem>
			)} />

			<ErrorBox message={confirmError} />

			<Button type="submit" disabled={isConfirming} className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl">
				{isConfirming ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : <><Sparkles className="mr-2 h-4 w-4" />Verify Email</>}
			</Button>

			<div className="text-center">
				<p className="text-slate-600 text-sm">Didn't receive a code?{" "}
					<Button type="button" variant="link" className="text-blue-600 hover:text-blue-700 font-semibold p-0 h-auto text-sm" onClick={onResendCode}>Resend code</Button>
				</p>
			</div>
			<div className="text-center">
				<Button type="button" variant="ghost" className="text-slate-600 hover:text-slate-800 p-0 h-auto text-sm" onClick={onBackClick}>← Back to Sign up</Button>
			</div>
		</form>
	</Form>
);

export default VerificationForm;