import { useState } from "react";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

function App() {
    const [url, setUrl] = useState("");

    function search() {



        new WebviewWindow("browser", {
            url: url,
            title: url,
        });

    }

    return (


        <div>
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
    );
}

export default App;
