// src/pages/Signup/components/Background.jsx

const Background = () => (
	<div className="absolute inset-0">
		<div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
		<div className="absolute top-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
		<div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
		<div className="absolute top-[20%] left-[10%] w-32 h-32 border border-purple-300/30 rounded-full animate-float opacity-30" style={{ animationDuration: "8s" }} />
		<div className="absolute top-[30%] right-[15%] w-24 h-24 border border-blue-300/30 rounded-lg rotate-45 animate-float opacity-25" style={{ animationDuration: "10s", animationDelay: "2s" }} />
		<div className="absolute bottom-[25%] left-[20%] w-20 h-20 border border-indigo-300/30 rounded-full animate-float opacity-20" style={{ animationDuration: "12s", animationDelay: "4s" }} />
	</div>
);

export default Background;