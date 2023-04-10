import { useEffect, useState } from "react";

export default function useScreenSize():
    [boolean, boolean, boolean, boolean, boolean] {

    const [screenSize, setScreenSize] = useState(0);

    const isXS: boolean = screenSize < 600;
    const isSM: boolean = screenSize >= 900;
    const isMD: boolean = screenSize >= 1200;
    const isLG: boolean = screenSize >= 1536;
    const isXL: boolean = screenSize >= 1536

    useEffect(() => {
        setScreenSize(window.innerWidth);

        window.addEventListener('resize', () => {
            setScreenSize(window.innerWidth);
        })

        return () => {
            window.removeEventListener("resize", () => {
                setScreenSize(window.innerWidth);
            })
        }
    }, []);

    return [isXS, isSM, isMD, isLG, isXL]
}