import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'Hindi (हिंदी)' },
        { code: 'te', label: 'Telugu (తెలుగు)' },
        { code: 'ta', label: 'Tamil (தமிழ்)' },
        { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
        { code: 'ml', label: 'Malayalam (മലയാളം)' },
        { code: 'bn', label: 'Bengali (বাংলা)' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch Language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
