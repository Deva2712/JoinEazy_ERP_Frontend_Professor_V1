// src/pages/Signup/components/PageHeader.jsx

import { Button } from "@/components/ui/button";
import logoImage from "@/assets/images/Joineazy final-01.png";

const PageHeader = ({ onLogoClick, onLinkClick, privacy_link, terms_link, guide_link }) => (
	<header className="relative z-10 w-full p-2">
		<div className="flex justify-between items-center">
			<div className="flex items-center cursor-pointer group" onClick={onLogoClick}>
				<img src={logoImage} alt="Joineazy Logo" className="h-32 w-auto transition-transform duration-300 group-hover:scale-110" />
			</div>
			<nav className="flex items-center gap-6">
				{[["Privacy", privacy_link], ["Terms", terms_link], ["Guide", guide_link]].map(([label, link]) => (
					<Button key={label} variant="ghost"
						className="text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 transition-all duration-200 font-medium"
						onClick={() => onLinkClick(link)}
					>
						{label}
					</Button>
				))}
			</nav>
		</div>
	</header>
);

export default PageHeader;