// src/pages/Signup/components/SignupForm.jsx

import { Eye, EyeOff, Loader2, UserPlus, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ErrorBox from "./ErrorBox";

const SignupForm = ({ signupForm, onSubmit, showPassword, setShowPassword, signupError, onLinkClick, signin_link, terms_link, privacy_link, isLoading }) => (
	<Form {...signupForm}>
		<form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-6">
			<FormField control={signupForm.control} name="email" render={({ field }) => (
				<FormItem>
					<FormLabel className="text-slate-700 font-semibold text-sm">Email Address</FormLabel>
					<FormControl>
						<div className="relative group">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
							<Input type="email" placeholder="Enter your email" className="pl-12 pr-4 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400" {...field} />
						</div>
					</FormControl>
					<FormMessage className="text-red-500 text-sm" />
				</FormItem>
			)} />

			<FormField control={signupForm.control} name="password" render={({ field }) => (
				<FormItem>
					<FormLabel className="text-slate-700 font-semibold text-sm">Password</FormLabel>
					<FormControl>
						<div className="relative group">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" />
							<Input type={showPassword ? "text" : "password"} placeholder="Create a password" className="pl-12 pr-12 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200 placeholder:text-slate-400" {...field} />
							<Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100/50 rounded-lg" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
							</Button>
						</div>
					</FormControl>
					<FormMessage className="text-red-500 text-sm" />
				</FormItem>
			)} />

			<ErrorBox message={signupError} />

			<Button type="submit" disabled={isLoading} className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl">
				{isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</> : <><UserPlus className="mr-2 h-4 w-4" />Create Account</>}
			</Button>

			<div className="text-center">
				<p className="text-slate-600 text-sm">Already have an account?{" "}
					<Button type="button" variant="link" className="text-blue-600 hover:text-blue-700 font-semibold p-0 h-auto text-sm" onClick={() => onLinkClick(signin_link)}>Sign in instead</Button>
				</p>
			</div>

			<div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200">
				<p className="text-slate-600 text-xs text-center leading-relaxed">
					By creating an account, you agree to our{" "}
					<Button type="button" variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs font-medium" onClick={() => onLinkClick(terms_link)}>Terms of Service</Button>{" "}and{" "}
					<Button type="button" variant="link" className="text-blue-600 hover:text-blue-700 p-0 h-auto text-xs font-medium" onClick={() => onLinkClick(privacy_link)}>Privacy Policy</Button>
				</p>
			</div>
		</form>
	</Form>
);

export default SignupForm;