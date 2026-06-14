import { Eye, EyeOff, Mail, Lock, Loader2, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import logoImage from "@/assets/images/Joineazy final-01.png";
import { useLoginForm } from "./utility/Useloginform";

export default function LoginUI({
  privacy_link, terms_link, guide_link,
  signup_link, forgot_password_link, logo_link,
  handleLogin, onLoginSuccess,
}) {
  const {
    loginForm, showPassword, setShowPassword,
    loginError, isLoading, message, onSubmit, navigate,
  } = useLoginForm({ handleLogin, onLoginSuccess });

  const go = (url) => navigate(url);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => go(logo_link)}>
            <img src={logoImage} alt="Joineazy Logo" className="h-32 w-auto transition-transform duration-300 group-hover:scale-110" />
          </div>
          <nav className="flex items-center gap-6">
            {[["Privacy", privacy_link], ["Terms", terms_link], ["Guide", guide_link]].map(([label, link]) => (
              <Button key={label} variant="ghost" className="text-slate-700 hover:text-slate-900 font-medium" onClick={() => go(link)}>
                {label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Welcome Back
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign in to JoinEazy</h1>
            <p className="text-slate-600">Continue your journey with seamless team collaboration</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
                  {message && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm text-center">{message}</p>
                    </div>
                  )}

                  {/* Email */}
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input type="email" placeholder="Enter your email"
                            className="pl-12 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 rounded-xl"
                            {...field}
                            onChange={(e) => { const v = e.target.value.toLowerCase(); e.target.value = v; field.onChange(v); }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} />

                  {/* Password */}
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-sm">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                          <Input type={showPassword ? "text" : "password"} placeholder="Enter your password"
                            className="pl-12 pr-12 h-12 bg-slate-50/50 border-slate-200 focus:border-blue-500 rounded-xl" {...field} />
                          <Button type="button" variant="ghost" size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-lg"
                            onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )} />

                  {/* Remember me + Forgot */}
                  <div className="flex items-center justify-between">
                    <FormField control={loginForm.control} name="rememberMe" render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500 data-[state=checked]:border-0" />
                        </FormControl>
                        <Label className="text-slate-600 text-sm font-medium">Keep me signed in</Label>
                      </FormItem>
                    )} />
                    <Button type="button" variant="link" className="text-blue-600 font-medium text-sm p-0 h-auto" onClick={() => go(forgot_password_link)}>
                      Forgot Password?
                    </Button>
                  </div>

                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm text-center">{loginError}</p>
                    </div>
                  )}

                  <Button type="submit" disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : <><Zap className="mr-2 h-4 w-4" /> Sign In</>}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-slate-600 text-sm">
                  Don't have an account?{" "}
                  <Button type="button" variant="link" className="text-blue-600 font-semibold p-0 h-auto text-sm" onClick={() => go(signup_link)}>
                    Sign up now
                  </Button>
                </p>
              </div>

              <div className="mt-6 p-4 bg-slate-50/50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>This site is protected by reCAPTCHA and Google's Privacy Policy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}