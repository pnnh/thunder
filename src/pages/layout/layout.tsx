import {HostNavbar} from "./navbar";
import {ConsoleFeature} from "./feature";
import {css} from "@emotion/css";

const rootStyle = css`
    display: flex;
    flex-direction: row;
    gap: 1rem;
    height: 100vh;
    width: 100vw;
`

export function RootLayout({children}: { children: React.ReactNode }) {
    return <div className={rootStyle}>
        <ConsoleFeature/>
        <main>
            <HostNavbar/>
            {children}
        </main>
    </div>
}
