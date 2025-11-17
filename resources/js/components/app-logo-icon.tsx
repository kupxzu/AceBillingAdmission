import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img 
            src="/acelogo.png" 
            alt="ACE Logo" 
            {...props}
        />
    );
}
