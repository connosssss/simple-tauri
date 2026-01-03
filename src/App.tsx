import { useState,  useEffect, useRef } from "react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";

function App() {
    const [url, setUrl] = useState("");
    const headerRef = useRef<HTMLDivElement>(null);

    async function getLayout() {
        const window = getCurrentWindow();
        const size = await window.innerSize();
        const scale = await window.scaleFactor();
        
        const headerHeight = headerRef.current ? headerRef.current.offsetHeight + 10: 0;
        
        return {
            x: 0,
            y: headerHeight,
            width: size.width / scale,
            height: (size.height / scale) - headerHeight
        };
    }

    async function search() {
        if (!url) return;

        const dimensions = await getLayout();

        await invoke("create_webview", {
            url: url,
            ...dimensions
        });

    }

    


    useEffect(() => {
        const handleResize = async () => {
            const dimensions = await getLayout();
            await invoke("resize_webview", dimensions);
        };

        const window = getCurrentWindow();
        const unlisten = window.onResized(handleResize);

        return () => {
            unlisten.then((fn) => fn());
        };
    }, []);

    return (


        <div>
            <div ref={headerRef}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    search();
                }}
            >

                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    
                />

                <button type="submit">Search</button>
            </form>
            </div>

        </div>
    );
}

export default App;
